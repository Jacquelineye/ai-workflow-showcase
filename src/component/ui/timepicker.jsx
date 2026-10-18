import React, { useState, useEffect, useLayoutEffect, useRef, useMemo, useCallback } from "react";
import { createPortal } from "react-dom";

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

/* =========================================================
 * 向量圖示 (Icons)
 * ======================================================= */
function Icon({ name, size = 16, className = "" }) {
  const paths = {
    clock: (
      <>
        <circle cx="8" cy="8" r="6" />
        <path d="M8 4.5V8l2.5 1.5" />
      </>
    ),
    sun: (
      <>
        <circle cx="8" cy="8" r="2.5" />
        <path d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M3 3l1 1M12 12l1 1M3 13l1-1M12 4l1-1" />
      </>
    ),
    moon: <path d="M13.6 9.1A6 6 0 0 1 6.9 2.4 6 6 0 1 0 13.6 9.1Z" />,
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cx("shrink-0", className)}
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

/* =========================================================
 * 時間滾輪欄位 (TimeColumn)
 * ======================================================= */
function TimeColumn({ value, type = "hour", onChange }) {
  const rows = [-2, -1, 0, 1, 2];

  const handleWheel = (e) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      // 向上滾動 (加數)
      const next = type === "hour" ? (value % 12) + 1 : (value + 1) % 60;
      onChange?.(next);
    } else {
      // 向下滾動 (減數)
      const prev =
        type === "hour"
          ? ((value - 2 + 12) % 12) + 1
          : (value - 1 + 60) % 60;
      onChange?.(prev);
    }
  };

  return (
    <div
      role="group"
      aria-label={type === "hour" ? "Hours" : "Minutes"}
      onWheel={handleWheel}
      className="flex flex-col items-center justify-center gap-8 min-w-[37px] h-[162px] select-none cursor-ns-resize"
    >
      {rows.map((offset) => {
        const number =
          type === "hour"
            ? ((value - 1 + offset + 12) % 12) + 1
            : (value + offset + 60) % 60;

        const distance = Math.abs(offset);
        const fontSize = distance === 0 ? "text-[28px]" : distance === 1 ? "text-[20px]" : "text-[17px]";
        const height = distance === 0 ? "h-[36px]" : distance === 1 ? "h-[28px]" : "h-[22px]";

        return (
          <button
            key={offset}
            type="button"
            aria-pressed={offset === 0}
            aria-label={`${number} ${type === "hour" ? "hours" : "minutes"}`}
            onClick={() => onChange?.(number)}
            className={cx(
              "flex items-center justify-center w-full m-0 p-0 border-0 bg-transparent font-primary tabular-nums tracking-tight cursor-pointer transition-all",
              fontSize,
              height,
              distance === 0
                ? "text-fontcolor font-normal"
                : "text-placeholder hover:text-secondary",
              distance === 2 ? "opacity-65" : "opacity-100",
            )}
          >
            {String(number).padStart(2, "0")}
          </button>
        );
      })}
    </div>
  );
}

/* =========================================================
 * 底部操作按鈕 (PickerFooter)
 * ======================================================= */
function PickerFooter({ onCancel, onConfirm }) {
  return (
    <div className="flex items-center justify-between w-full h-[36px] pt-4 select-none">
      <button
        type="button"
        onClick={onCancel}
        className="inline-flex items-center justify-center h-[36px] px-12 rounded-[22px] text-body-3 text-secondary hover:bg-bg/60 transition-colors cursor-pointer font-primary"
      >
        Cancel
      </button>

      <button
        type="button"
        onClick={onConfirm}
        className="inline-flex items-center justify-center min-w-[48px] h-[36px] px-16 rounded-[22px] bg-primary text-white text-body-3 font-medium shadow-[0_2px_6px_-1px_rgba(0,0,0,0.07)] hover:bg-primary/90 transition-all cursor-pointer font-primary"
      >
        OK
      </button>
    </div>
  );
}

function parseTimeString(val) {
  if (!val || typeof val !== "string") return null;
  const match = val.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!match) return null;
  let hour = parseInt(match[1], 10);
  const minute = parseInt(match[2], 10);
  const period = (match[3] || (hour >= 12 ? "PM" : "AM")).toUpperCase();
  if (hour > 12) hour = hour - 12;
  if (hour === 0) hour = 12;
  return { hour, minute, period };
}

/**
 * Desktop TimePicker 元件
 *
 * 支援 Figma 原稿 4 種 Desktop 變體：
 * 1. active=false, editable=true
 * 2. active=true, editable=true
 * 3. active=false, editable=false
 * 4. active=true, editable=false
 */
export function TimePicker({
  active: controlledActive,
  defaultActive = false,
  editable = true,
  disabled = false,
  error = false,
  value: controlledValue,
  defaultValue = "",
  placeholder = "Pick Time",
  period: controlledPeriod,
  defaultPeriod = "AM",
  hour: controlledHour,
  defaultHour = 10,
  minute: controlledMinute,
  defaultMinute = 30,
  onChange,
  onInputChange,
  onToggle,
  onPeriodChange,
  onHourChange,
  onMinuteChange,
  onCancel,
  onConfirm,
  className = "",
  style,
}) {
  const containerRef = useRef(null);
  const dialogRef = useRef(null);
  const [dropdownStyle, setDropdownStyle] = useState({});

  // 內部狀態
  const [internalActive, setInternalActive] = useState(defaultActive);
  const isActive = controlledActive !== undefined ? controlledActive : internalActive;

  const [internalValue, setInternalValue] = useState(defaultValue);
  const currentValue = controlledValue !== undefined ? controlledValue : internalValue;

  // 解析初始傳入時間字串 (如 "10:00 AM")
  const parsedInitial = useMemo(() => parseTimeString(controlledValue || defaultValue), []);

  const [internalPeriod, setInternalPeriod] = useState(() => parsedInitial?.period ?? defaultPeriod);
  const currentPeriod = controlledPeriod !== undefined ? controlledPeriod : internalPeriod;

  const [internalHour, setInternalHour] = useState(() => parsedInitial?.hour ?? defaultHour);
  const currentHour = controlledHour !== undefined ? controlledHour : internalHour;

  const [internalMinute, setInternalMinute] = useState(() => parsedInitial?.minute ?? defaultMinute);
  const currentMinute = controlledMinute !== undefined ? controlledMinute : internalMinute;

  // 當受控 value 變更時，自動同步時、分與 AM/PM
  useEffect(() => {
    const parsed = parseTimeString(currentValue);
    if (parsed) {
      if (controlledHour === undefined) setInternalHour(parsed.hour);
      if (controlledMinute === undefined) setInternalMinute(parsed.minute);
      if (controlledPeriod === undefined) setInternalPeriod(parsed.period);
    }
  }, [currentValue, controlledHour, controlledMinute, controlledPeriod]);

  // 計算 Portal 浮動時間選單之精確 fixed 座標，使其不被任何父容器限制裁切
  const updatePosition = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    if (rect.width <= 0) return;

    // 若觸發欄位已滾出可視區域（例如面板內部滾動或視窗滾動過頭），自動關閉選單
    if (rect.bottom < 40 || rect.top > window.innerHeight - 40) {
      if (controlledActive === undefined) setInternalActive(false);
      onCancel?.();
      return;
    }

    const margin = 12;
    const gap = 6;
    const dialogHeight = dialogRef.current?.offsetHeight || 240;
    // 浮動面板寬度：若觸發輸入框在面板內有完整寬度 (如 !w-full: 248px)，可自適應或維持標準 198px
    const dialogWidth = dialogRef.current?.offsetWidth || Math.max(198, Math.min(288, rect.width));

    const spaceBelow = window.innerHeight - rect.bottom - margin;
    const spaceAbove = rect.top - margin;

    const openUpward = spaceBelow < dialogHeight && spaceAbove > spaceBelow;

    // 水平對齊判斷：
    // 若位於畫面右半部（例如右側屬性面板）且對齊右側能避免超出右側容器
    // 則右對齊觸發輸入框右側 (rect.right)；否則左對齊 (rect.left)
    let left;
    const preferRightAlign =
      (rect.right - dialogWidth >= margin) &&
      (rect.left + dialogWidth > window.innerWidth - margin || rect.left > window.innerWidth / 2);

    if (preferRightAlign) {
      left = rect.right - dialogWidth;
    } else {
      left = rect.left;
    }

    if (left + dialogWidth > window.innerWidth - margin) {
      left = Math.max(margin, window.innerWidth - dialogWidth - margin);
    }
    if (left < margin) left = margin;

    // 垂直座標計算並嚴格限制在視窗可視範圍內，避免頂部/底部被裁切
    let top;
    if (openUpward) {
      top = rect.top - gap - dialogHeight;
      if (top < margin) {
        top = margin;
      }
    } else {
      top = rect.bottom + gap;
      if (top + dialogHeight > window.innerHeight - margin) {
        top = Math.max(margin, window.innerHeight - dialogHeight - margin);
      }
    }

    setDropdownStyle({
      position: "fixed",
      left: `${left}px`,
      top: `${top}px`,
      width: `${dialogWidth}px`,
      boxSizing: "border-box",
      zIndex: 99999,
    });
  }, [controlledActive, onCancel]);

  // 開啟彈窗時在 Paint 前精確計算位置 (useLayoutEffect)
  useLayoutEffect(() => {
    if (!isActive) return;
    updatePosition();
  }, [isActive, updatePosition]);

  // 點選外部自動關閉彈窗，並在視窗滾動或縮放時即時同步座標
  useEffect(() => {
    if (!isActive) return;

    const handleScrollOrResize = () => {
      updatePosition();
    };

    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);

    const handleClickOutside = (e) => {
      const inContainer = containerRef.current && containerRef.current.contains(e.target);
      const inDialog = dialogRef.current && dialogRef.current.contains(e.target);
      if (!inContainer && !inDialog) {
        if (controlledActive === undefined) {
          setInternalActive(false);
        }
        onCancel?.();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isActive, updatePosition, controlledActive, onCancel]);

  const handleToggle = () => {
    if (disabled) return;
    if (controlledActive === undefined) {
      setInternalActive((prev) => !prev);
    }
    onToggle?.();
  };

  const handlePeriodChange = (nextPeriod) => {
    if (controlledPeriod === undefined) {
      setInternalPeriod(nextPeriod);
    }
    onPeriodChange?.(nextPeriod);
  };

  const handleHourChange = (nextHour) => {
    if (controlledHour === undefined) {
      setInternalHour(nextHour);
    }
    onHourChange?.(nextHour);
  };

  const handleMinuteChange = (nextMinute) => {
    if (controlledMinute === undefined) {
      setInternalMinute(nextMinute);
    }
    onMinuteChange?.(nextMinute);
  };

  const handleConfirm = () => {
    const formatted = `${String(currentHour).padStart(2, "0")}:${String(currentMinute).padStart(2, "0")} ${currentPeriod}`;
    if (controlledValue === undefined) {
      setInternalValue(formatted);
    }
    const result = {
      hour: currentHour,
      minute: currentMinute,
      period: currentPeriod,
      formatted,
    };
    onChange?.(formatted, result);
    onConfirm?.(result);
    if (controlledActive === undefined) {
      setInternalActive(false);
    }
  };

  const handleCancel = () => {
    onCancel?.();
    if (controlledActive === undefined) {
      setInternalActive(false);
    }
  };

  const handleInputChangeInternal = (val) => {
    if (controlledValue === undefined) {
      setInternalValue(val);
    }
    onInputChange?.(val);
    onChange?.(val);
  };

  return (
    <div
      ref={containerRef}
      className={cx(
        "relative inline-block w-[198px] align-top font-primary text-body-3 text-fontcolor select-none",
        className,
      )}
      style={style}
    >
      {/* 依據 editable 切換輸入框或按鈕樣式 */}
      {editable ? (
        <div
          className={cx(
            "box-border flex items-center gap-8 w-full h-[36px] pl-12 pr-0 rounded-[22px] border border-stroke bg-white",
            "shadow-[0_2px_6px_-1px_rgba(0,0,0,0.07)] transition-all font-primary",
            disabled && "!bg-bg/60 !border-stroke/60 !text-description !cursor-not-allowed pointer-events-none shadow-none",
            error
              ? "border-error text-fontcolor hover:border-error ring-1 ring-error/20 focus-within:ring-2 focus-within:ring-error/20"
              : isActive
                ? "border-primary ring-2 ring-primary/20"
                : "hover:border-stroke/80",
          )}
        >
          <input
            disabled={disabled}
            aria-label={placeholder}
            value={currentValue}
            placeholder={placeholder}
            onChange={(e) => handleInputChangeInternal(e.target.value)}
            className="flex-1 w-0 min-w-0 h-[28px] m-0 p-0 border-0 outline-none bg-transparent font-primary text-caption-1 text-fontcolor placeholder:text-placeholder disabled:cursor-not-allowed disabled:text-description"
          />

          <span className="flex items-center justify-center shrink-0 w-[36px] h-[36px]">
            <button
              type="button"
              disabled={disabled}
              aria-label="開啟時間選擇器"
              aria-haspopup="dialog"
              aria-expanded={isActive}
              onClick={disabled ? undefined : handleToggle}
              className={cx(
                "inline-flex items-center justify-center w-[28px] h-[28px] p-0 border-0 rounded-[22px] cursor-pointer transition-all",
                disabled
                  ? "text-description/60 pointer-events-none"
                  : isActive
                    ? "bg-[#CEDAE3] text-primary shadow-inner"
                    : "bg-transparent text-primary hover:bg-primary/10",
              )}
            >
              <Icon name="clock" />
            </button>
          </span>
        </div>
      ) : (
        <button
          type="button"
          disabled={disabled}
          aria-label={placeholder}
          aria-haspopup="dialog"
          aria-expanded={isActive}
          onClick={disabled ? undefined : handleToggle}
          className={cx(
            "w-full h-[36px] pl-12 pr-12 rounded-[22px] border border-stroke bg-white",
            "shadow-[0_2px_6px_-1px_rgba(0,0,0,0.07)] flex items-center gap-8 cursor-pointer text-left font-primary transition-all select-none",
            disabled && "!bg-bg/60 !border-stroke/60 !text-description !cursor-not-allowed pointer-events-none shadow-none",
            error
              ? "border-error text-fontcolor hover:border-error ring-1 ring-error/20"
              : isActive
                ? "border-primary ring-2 ring-primary/20"
                : "hover:border-stroke/80",
          )}
        >
          <span className="text-[#9CA3AF] shrink-0">
            <Icon name="clock" />
          </span>
          <span
            className={cx(
              "flex-1 min-w-0 truncate text-caption-1",
              disabled ? "!text-description" : currentValue ? "text-fontcolor font-medium" : "text-placeholder",
            )}
          >
            {currentValue || placeholder}
          </span>
        </button>
      )}

      {/* 彈出時間面板：透過 createPortal 渲染於外層，避免受側邊欄 overflow-y-auto 與寬度限制 */}
      {isActive &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={dialogRef}
            role="dialog"
            aria-label="Choose time"
            style={{
              position: "fixed",
              visibility: dropdownStyle.left !== undefined ? "visible" : "hidden",
              ...dropdownStyle,
            }}
            onMouseDown={(e) => e.stopPropagation()}
            className={cx(
              "box-border flex flex-col gap-16 min-w-[198px] p-12 rounded-[22px] bg-white",
              "shadow-[0_4px_16px_rgba(0,0,0,0.08),0_0_0_1px_#CBD5E1] animate-in fade-in zoom-in-95 duration-100 select-none",
            )}
          >
            {/* AM / PM 切換條 */}
            <div
              role="group"
              aria-label="AM or PM"
              className="box-border flex items-center gap-4 w-full h-[36px] p-2 rounded-full bg-primary shadow-[0_2px_6px_-1px_rgba(0,0,0,0.07)] select-none"
            >
              {["AM", "PM"].map((item) => {
                const selected = currentPeriod === item;

                return (
                  <button
                    key={item}
                    type="button"
                    aria-label={item}
                    aria-pressed={selected}
                    onClick={() => handlePeriodChange(item)}
                    style={{
                      flex: selected ? 3 : 1,
                    }}
                    className={cx(
                      "inline-flex items-center justify-center gap-4 h-[32px] p-0 border-0 rounded-full font-primary text-body-4 font-medium transition-all duration-200 cursor-pointer",
                      selected
                        ? "bg-white text-primary shadow-[0_2px_6px_-1px_rgba(0,0,0,0.07)]"
                        : "bg-transparent text-white hover:bg-white/10",
                    )}
                  >
                    <Icon
                      name={item === "AM" ? "sun" : "moon"}
                      size={14}
                    />
                    {selected && (item === "AM" ? "Am" : "Pm")}
                  </button>
                );
              })}
            </div>

            {/* 時鐘數字滾輪區塊 */}
            <div className="box-border flex items-center justify-center gap-16 w-full h-[178px] py-8">
              <TimeColumn
                type="hour"
                value={currentHour}
                onChange={handleHourChange}
              />

              <span
                aria-hidden="true"
                className="text-[17px] font-bold leading-[22px] text-fontcolor pb-2 select-none"
              >
                :
              </span>

              <TimeColumn
                type="minute"
                value={currentMinute}
                onChange={handleMinuteChange}
              />
            </div>

            {/* 底部按鈕 */}
            <PickerFooter
              onCancel={handleCancel}
              onConfirm={handleConfirm}
            />
          </div>,
          document.body,
        )}
    </div>
  );
}

export default TimePicker;

