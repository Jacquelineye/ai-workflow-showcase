import React, { useState, useEffect, useLayoutEffect, useRef, useMemo, useCallback } from "react";
import { createPortal } from "react-dom";
import ListItem from "./listitem";

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

/* =========================================================
 * 向量圖示 (Icons)
 * ======================================================= */
function Icon({ name, size = 16, className = "" }) {
  const paths = {
    calendar: (
      <>
        <rect x="2" y="3.5" width="12" height="10.5" rx="1.5" />
        <path d="M5 2v3M11 2v3M2 7h12M5 10h2M9 10h2" />
      </>
    ),
    clock: (
      <>
        <circle cx="8" cy="8" r="6" />
        <path d="M8 4.5V8l2.5 1.5" />
      </>
    ),
    left: <path d="m10 4-4 4 4 4" />,
    right: <path d="m6 4 4 4-4 4" />,
    down: <path d="m4 6 4 4 4-4" />,
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
 * 日期工具與預設假資料 (Figma 忠實對齊)
 * ======================================================= */
const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export const DEFAULT_DESIGN_DAYS = [
  { day: 29, outside: true, monthOffset: -1 },
  { day: 30, outside: true, monthOffset: -1 },
  { day: 31, outside: false, monthOffset: 0 },
  ...Array.from({ length: 30 }, (_, index) => ({
    day: index + 1,
    outside: false,
    monthOffset: 0,
  })),
  { day: 1, outside: true, monthOffset: 1 },
  { day: 2, outside: true, monthOffset: 1 },
];

/**
 * 根據年份與月份動態生成精確月曆日期格陣列
 */
export function generateMonthDays(year, monthIndex) {
  const firstDayOfWeek = new Date(year, monthIndex, 1).getDay();
  const daysInCurrentMonth = new Date(year, monthIndex + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, monthIndex, 0).getDate();

  const days = [];

  // 上個月跨過來的日子
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    days.push({
      day: daysInPrevMonth - i,
      outside: true,
      monthOffset: -1,
    });
  }

  // 當前月份日子
  for (let d = 1; d <= daysInCurrentMonth; d++) {
    days.push({
      day: d,
      outside: false,
      monthOffset: 0,
    });
  }

  // 下個月補滿到 35 或 42 格 (以整除 7 為基準)
  const remainder = days.length % 7;
  if (remainder !== 0) {
    const fillCount = 7 - remainder;
    for (let d = 1; d <= fillCount; d++) {
      days.push({
        day: d,
        outside: true,
        monthOffset: 1,
      });
    }
  }

  return days;
}

/**
 * 解析日期字串為 { year, monthIndex, day }
 */
export function parseDateString(val) {
  if (!val || typeof val !== "string") return null;
  const parts = val.replace(",", "").trim().split(/\s+/);
  if (parts.length === 3 && MONTH_NAMES.includes(parts[0])) {
    const mIdx = MONTH_NAMES.indexOf(parts[0]);
    const d = parseInt(parts[1], 10);
    const y = parseInt(parts[2], 10);
    if (!isNaN(mIdx) && !isNaN(d) && !isNaN(y)) {
      return { year: y, monthIndex: mIdx, day: d };
    }
  } else if (val.includes("/")) {
    const slashParts = val.split("/").map((p) => parseInt(p, 10));
    if (slashParts.length === 3 && !slashParts.some(isNaN)) {
      return { year: slashParts[0], monthIndex: slashParts[1] - 1, day: slashParts[2] };
    }
  }
  return null;
}

/* =========================================================
 * 輸入欄位 (PickerField)
 * ======================================================= */
function PickerField({
  kind = "date",
  active,
  editable,
  disabled = false,
  error = false,
  value,
  placeholder,
  onInputChange,
  onToggle,
  onClear,
}) {
  const icon = kind === "date" ? "calendar" : "clock";

  if (!editable) {
    return (
      <button
        type="button"
        disabled={disabled}
        aria-label={placeholder}
        aria-haspopup="dialog"
        aria-expanded={active}
        onClick={disabled ? undefined : onToggle}
        className={cx(
          "w-full h-[36px] pl-10 pr-10 rounded-full border bg-white",
          "shadow-drop-s flex items-center gap-6 cursor-pointer text-left font-primary transition-all select-none",
          disabled && "!bg-bg/60 !border-stroke/60 !text-description !cursor-not-allowed pointer-events-none shadow-none",
          error
            ? "border-error text-fontcolor hover:border-error ring-1 ring-error/20"
            : active
              ? "border-primary ring-2 ring-primary/20 text-primary font-medium"
              : "border-stroke text-fontcolor hover:bg-bg/40",
        )}
      >
        <span
          className={cx(
            "w-[20px] h-[20px] rounded-full flex items-center justify-center shrink-0 transition-all",
            disabled
              ? "text-description"
              : active
                ? "bg-[#CEDAE3] text-primary shadow-inner"
                : "text-description",
          )}
        >
          <Icon name={icon} size={13} />
        </span>
        <span
          className={cx(
            "flex-1 min-w-0 truncate text-caption-1",
            disabled ? "!text-description" : value ? "text-fontcolor font-medium" : "text-placeholder",
          )}
        >
          {value || placeholder}
        </span>
      </button>
    );
  }

  return (
    <div
      className={cx(
        "box-border flex items-center gap-6 w-full h-[36px] pl-12 pr-4 rounded-full border bg-white",
        "shadow-drop-s transition-all font-primary",
        disabled && "!bg-bg/60 !border-stroke/60 !text-description !cursor-not-allowed pointer-events-none shadow-none",
        error
          ? "border-error text-fontcolor hover:border-error ring-1 ring-error/20 focus-within:ring-2 focus-within:ring-error/20"
          : active
            ? "border-primary ring-2 ring-primary/20"
            : "border-stroke hover:border-stroke/80",
      )}
    >
      <input
        disabled={disabled}
        aria-label={placeholder}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onInputChange?.(e.target.value)}
        className="flex-1 w-0 min-w-0 h-[28px] m-0 p-0 border-0 outline-none bg-transparent font-primary text-caption-1 text-fontcolor placeholder:text-placeholder disabled:cursor-not-allowed disabled:text-description"
      />

      <span className="flex items-center justify-center shrink-0 w-[28px] h-[28px]">
        <button
          type="button"
          disabled={disabled}
          aria-label={`開啟${kind === "date" ? "日期" : "時間"}選擇器`}
          aria-haspopup="dialog"
          aria-expanded={active}
          onClick={disabled ? undefined : onToggle}
          className={cx(
            "inline-flex items-center justify-center w-[22px] h-[22px] p-0 border-0 rounded-full cursor-pointer transition-all",
            disabled
              ? "text-description/60 pointer-events-none"
              : active
                ? "bg-[#CEDAE3] text-primary shadow-inner"
                : "bg-transparent text-primary hover:bg-primary/10",
          )}
        >
          <Icon name={icon} size={13} />
        </button>
      </span>
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

/**
 * Desktop Datepicker 元件
 *
 * 支援 Figma 原稿 4 種 Desktop 變體：
 * 1. active=false, editable=true
 * 2. active=true, editable=true
 * 3. active=false, editable=false
 * 4. active=true, editable=false
 *
 * 同時支援受控與自控狀態切換。
 */
export function Datepicker({
  active: controlledActive,
  defaultActive = false,
  editable = true,
  disabled = false,
  error = false,
  value: controlledValue,
  defaultValue = "",
  placeholder = "Pick a Date",
  month: initialMonth = "Oct",
  year: initialYear = 2026,
  days: customDays,
  selectedIndex: controlledSelectedIndex = null,
  onChange,
  onInputChange,
  onToggle,
  onPreviousMonth,
  onNextMonth,
  onMonthClick,
  onYearClick,
  onDayClick,
  onCancel,
  onConfirm,
  className = "",
  style,
}) {
  const containerRef = useRef(null);
  const dialogRef = useRef(null);
  const monthDropdownRef = useRef(null);
  const yearDropdownRef = useRef(null);
  const yearListRef = useRef(null);
  const [dropdownStyle, setDropdownStyle] = useState({});

  // 內部狀態（支援自控與受控相容）
  const [internalActive, setInternalActive] = useState(defaultActive);
  const isActive = controlledActive !== undefined ? controlledActive : internalActive;

  const [internalValue, setInternalValue] = useState(defaultValue);
  const currentValue = controlledValue !== undefined ? controlledValue : internalValue;

  // 解析初始傳入日期
  const parsedInitial = useMemo(() => parseDateString(controlledValue || defaultValue), []);

  const [currentYear, setCurrentYear] = useState(() => parsedInitial?.year ?? initialYear);
  const [currentMonthIndex, setCurrentMonthIndex] = useState(() => {
    if (parsedInitial?.monthIndex !== undefined) return parsedInitial.monthIndex;
    const idx = MONTH_NAMES.indexOf(initialMonth);
    return idx >= 0 ? idx : 9; // 預設 9: Oct
  });

  const [selectedDayIndex, setSelectedDayIndex] = useState(controlledSelectedIndex);

  // 當受控 value 變更時，自動同步年月
  useEffect(() => {
    const parsed = parseDateString(currentValue);
    if (parsed) {
      setCurrentYear(parsed.year);
      setCurrentMonthIndex(parsed.monthIndex);
    }
  }, [currentValue]);

  // 月/年份下拉選單展開狀態
  const [isMonthOpen, setIsMonthOpen] = useState(false);
  const [isYearOpen, setIsYearOpen] = useState(false);

  // 年份選項目錄 (2000 ~ 2060)
  const YEAR_OPTIONS = useMemo(() => Array.from({ length: 61 }, (_, i) => 2000 + i), []);

  // 日期格陣列：自訂傳入或依據目前月份動態生成
  const calendarDays = useMemo(() => {
    if (customDays) return customDays;
    return generateMonthDays(currentYear, currentMonthIndex);
  }, [customDays, currentYear, currentMonthIndex]);

  const weekCount = Math.ceil(calendarDays.length / 7);

  // 同步受控 value 的選中日到月曆網格中
  useEffect(() => {
    const parsed = parseDateString(currentValue);
    if (parsed && calendarDays.length > 0) {
      const idx = calendarDays.findIndex((item) => !item.outside && item.day === parsed.day);
      if (idx !== -1) {
        setSelectedDayIndex(idx);
      }
    }
  }, [currentValue, calendarDays]);

  // 計算 Portal 浮動月曆之精確 fixed 座標，使其不被任何父容器之 overflow 或邊界裁切
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
    const dialogHeight = dialogRef.current?.offsetHeight || 370;
    const dialogWidth = dialogRef.current?.offsetWidth || 288;

    const spaceBelow = window.innerHeight - rect.bottom - margin;
    const spaceAbove = rect.top - margin;

    // 若下方空間不足且上方空間較寬裕，則向上展開；否則預設向下展開
    const openUpward = spaceBelow < dialogHeight && spaceAbove > spaceBelow;

    // 水平對齊判斷：
    // 若位於畫面右半部（例如右側屬性面板）或向左延伸能更好地容納寬度且不溢出右邊界
    // 則右對齊觸發輸入框右側 (rect.right)，使彈出面板不會突出右側面板邊界；否則左對齊 (rect.left)
    let left;
    const preferRightAlign =
      (rect.right - dialogWidth >= margin) &&
      (rect.left + dialogWidth > window.innerWidth - margin || rect.left > window.innerWidth / 2);

    if (preferRightAlign) {
      left = rect.right - dialogWidth;
    } else {
      left = rect.left;
    }

    // 視窗邊界限制（保護彈窗不超出螢幕四周）
    if (left + dialogWidth > window.innerWidth - margin) {
      left = Math.max(margin, window.innerWidth - dialogWidth - margin);
    }
    if (left < margin) left = margin;

    // 垂直座標計算並嚴格限制在視窗可視範圍內，避免頂部/底部按鈕被裁切
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

  // 點選外部自動關閉彈窗與下拉選單，並在視窗滾動或縮放時即時同步座標
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
        setIsMonthOpen(false);
        setIsYearOpen(false);
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

  // 點選其他區域時關閉月/年份下拉選單
  useEffect(() => {
    if (!isMonthOpen && !isYearOpen) return;
    const handleCloseDropdowns = (e) => {
      if (
        monthDropdownRef.current &&
        !monthDropdownRef.current.contains(e.target) &&
        yearDropdownRef.current &&
        !yearDropdownRef.current.contains(e.target)
      ) {
        setIsMonthOpen(false);
        setIsYearOpen(false);
      }
    };
    document.addEventListener("mousedown", handleCloseDropdowns);
    return () => document.removeEventListener("mousedown", handleCloseDropdowns);
  }, [isMonthOpen, isYearOpen]);

  // 開啟年份下拉選單時，自動平滑滾動至目前年份置中
  useEffect(() => {
    if (isYearOpen && yearListRef.current) {
      const activeEl = yearListRef.current.querySelector(`#year-opt-${currentYear}`);
      if (activeEl) {
        activeEl.scrollIntoView({ block: "center", behavior: "auto" });
      }
    }
  }, [isYearOpen, currentYear]);

  const handleToggle = () => {
    if (disabled) return;
    if (controlledActive === undefined) {
      setInternalActive((prev) => !prev);
    }
    setIsMonthOpen(false);
    setIsYearOpen(false);
    onToggle?.();
  };

  const handlePrevMonth = () => {
    setIsMonthOpen(false);
    setIsYearOpen(false);
    if (onPreviousMonth) {
      onPreviousMonth();
    } else {
      if (currentMonthIndex === 0) {
        setCurrentMonthIndex(11);
        setCurrentYear((y) => y - 1);
      } else {
        setCurrentMonthIndex((m) => m - 1);
      }
    }
  };

  const handleNextMonth = () => {
    setIsMonthOpen(false);
    setIsYearOpen(false);
    if (onNextMonth) {
      onNextMonth();
    } else {
      if (currentMonthIndex === 11) {
        setCurrentMonthIndex(0);
        setCurrentYear((y) => y + 1);
      } else {
        setCurrentMonthIndex((m) => m + 1);
      }
    }
  };

  const handleSelectDay = (item, index) => {
    setSelectedDayIndex(index);
    onDayClick?.(item, index);
  };

  const handleConfirm = () => {
    let finalValue = currentValue;
    if (selectedDayIndex !== null && calendarDays[selectedDayIndex]) {
      const selectedItem = calendarDays[selectedDayIndex];
      const monthStr = MONTH_NAMES[currentMonthIndex];
      finalValue = `${monthStr} ${selectedItem.day}, ${currentYear}`;
      if (controlledValue === undefined) {
        setInternalValue(finalValue);
      }
    }
    onChange?.(finalValue);
    onConfirm?.(finalValue);
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
        "relative inline-block w-[288px] align-top font-primary text-body-3 text-fontcolor select-none",
        className,
      )}
      style={style}
    >
      <PickerField
        kind="date"
        active={isActive}
        editable={editable}
        disabled={disabled}
        error={error}
        value={currentValue}
        placeholder={placeholder}
        onInputChange={handleInputChangeInternal}
        onToggle={handleToggle}
      />

      {isActive &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={dialogRef}
            role="dialog"
            aria-label="Choose date"
            style={{
              position: "fixed",
              visibility: dropdownStyle.left !== undefined ? "visible" : "hidden",
              ...dropdownStyle,
            }}
            onMouseDown={(e) => e.stopPropagation()}
            className={cx(
              "box-border flex flex-col gap-12 w-[288px] p-12 rounded-[22px] bg-white",
              "shadow-[0_4px_16px_rgba(0,0,0,0.08),0_0_0_1px_#CBD5E1] animate-in fade-in zoom-in-95 duration-100 select-none",
            )}
          >
          {/* 月曆頂部選單 */}
          <div className="flex items-center justify-between w-full h-[36px]">
            <button
              type="button"
              aria-label="Previous month"
              onClick={handlePrevMonth}
              className="inline-flex items-center justify-center w-[36px] h-[36px] p-8 border-0 rounded-[22px] bg-transparent text-primary hover:bg-primary/10 transition-colors cursor-pointer"
            >
              <Icon name="left" />
            </button>

            <div className="flex items-center gap-4">
              {/* Month Dropdown */}
              <div ref={monthDropdownRef} className="relative">
                <button
                  type="button"
                  aria-haspopup="listbox"
                  aria-expanded={isMonthOpen}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMonthOpen((prev) => !prev);
                    setIsYearOpen(false);
                    onMonthClick?.();
                  }}
                  className={cx(
                    "inline-flex items-center justify-center gap-4 h-[32px] px-10 border-0 rounded-[22px] font-primary text-body-3 font-medium transition-all duration-150 cursor-pointer select-none",
                    isMonthOpen
                      ? "bg-primary/25 text-primary shadow-inner-s"
                      : "bg-transparent text-primary hover:bg-primary/10 active:bg-primary/30",
                  )}
                >
                  <span>{MONTH_NAMES[currentMonthIndex]}</span>
                  <Icon
                    name="down"
                    size={14}
                    className={cx("transition-transform duration-200", isMonthOpen && "rotate-180")}
                  />
                </button>

                {isMonthOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40 cursor-default"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsMonthOpen(false);
                      }}
                    />
                    <div
                      role="listbox"
                      aria-label="選擇月份"
                      className="absolute top-[38px] left-0 z-50 min-w-[124px] max-h-[220px] overflow-y-auto rounded-[22px] border border-stroke bg-white p-6 shadow-drop-l custom-scrollbar animate-in fade-in duration-100"
                    >
                      <ul role="listbox" className="m-0 list-none p-0 flex flex-col gap-2">
                        {MONTH_NAMES.map((name, idx) => {
                          const isSelected = currentMonthIndex === idx;
                          return (
                            <ListItem
                              key={name}
                              role="option"
                              selected={isSelected}
                              onClick={(e) => {
                                e.stopPropagation();
                                setCurrentMonthIndex(idx);
                                setIsMonthOpen(false);
                              }}
                              className="!h-[30px] !min-h-[30px] !px-10 !rounded-full !text-caption-1 cursor-pointer"
                            >
                              <div className="w-full flex items-center justify-between">
                                <span>{name}</span>
                                <span className={cx("text-[10px]", isSelected ? "text-primary/80" : "text-description")}>
                                  {idx + 1}月
                                </span>
                              </div>
                            </ListItem>
                          );
                        })}
                      </ul>
                    </div>
                  </>
                )}
              </div>

              {/* Year Dropdown */}
              <div ref={yearDropdownRef} className="relative">
                <button
                  type="button"
                  aria-haspopup="listbox"
                  aria-expanded={isYearOpen}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsYearOpen((prev) => !prev);
                    setIsMonthOpen(false);
                    onYearClick?.();
                  }}
                  className={cx(
                    "inline-flex items-center justify-center gap-4 h-[32px] px-10 border-0 rounded-[22px] font-primary text-body-3 font-medium transition-all duration-150 cursor-pointer select-none",
                    isYearOpen
                      ? "bg-primary/25 text-primary shadow-inner-s"
                      : "bg-transparent text-primary hover:bg-primary/10 active:bg-primary/30",
                  )}
                >
                  <span>{currentYear}</span>
                  <Icon
                    name="down"
                    size={14}
                    className={cx("transition-transform duration-200", isYearOpen && "rotate-180")}
                  />
                </button>

                {isYearOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40 cursor-default"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsYearOpen(false);
                      }}
                    />
                    <div
                      ref={yearListRef}
                      role="listbox"
                      aria-label="選擇年份"
                      className="absolute top-[38px] left-0 z-50 min-w-[110px] max-h-[220px] overflow-y-auto rounded-[22px] border border-stroke bg-white p-6 shadow-drop-l custom-scrollbar animate-in fade-in duration-100"
                    >
                      <ul role="listbox" className="m-0 list-none p-0 flex flex-col gap-2">
                        {YEAR_OPTIONS.map((y) => {
                          const isSelected = currentYear === y;
                          return (
                            <ListItem
                              key={y}
                              id={`year-opt-${y}`}
                              role="option"
                              selected={isSelected}
                              onClick={(e) => {
                                e.stopPropagation();
                                setCurrentYear(y);
                                setIsYearOpen(false);
                              }}
                              className="!h-[30px] !min-h-[30px] !px-10 !rounded-full !text-caption-1 font-mono cursor-pointer"
                            >
                              <div className="w-full flex items-center justify-between">
                                <span>{y}</span>
                                {isSelected && <span className="text-[11px] font-bold">✓</span>}
                              </div>
                            </ListItem>
                          );
                        })}
                      </ul>
                    </div>
                  </>
                )}
              </div>
            </div>

            <button
              type="button"
              aria-label="Next month"
              onClick={handleNextMonth}
              className="inline-flex items-center justify-center w-[36px] h-[36px] p-8 border-0 rounded-[22px] bg-transparent text-primary hover:bg-primary/10 transition-colors cursor-pointer"
            >
              <Icon name="right" />
            </button>
          </div>

          {/* 星期與日期網格 (7 欄) */}
          <div
            className="grid grid-cols-7 gap-2"
            style={{
              gridTemplateRows: `20px repeat(${weekCount}, 36px)`,
            }}
          >
            {WEEKDAYS.map((weekday) => (
              <span
                key={weekday}
                className="flex items-center justify-center h-[20px] text-caption-1 font-medium text-muted text-center"
              >
                {weekday}
              </span>
            ))}

            {calendarDays.map((item, index) => {
              const selected = index === selectedDayIndex;

              return (
                <button
                  key={index}
                  type="button"
                  aria-label={`${item.day}${item.outside ? ", adjacent month" : ""}`}
                  aria-pressed={selected}
                  onClick={() => handleSelectDay(item, index)}
                  className={cx(
                    "box-border flex items-center justify-center w-[36px] h-[36px] p-0 border-0 rounded-full font-primary text-body-3 transition-all cursor-pointer",
                    selected
                      ? "bg-primary text-white font-semibold shadow-xs"
                      : item.outside
                        ? "text-[#CBD5E1] hover:bg-bg/40"
                        : "text-fontcolor hover:bg-primary/10",
                  )}
                >
                  {item.day}
                </button>
              );
            })}
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

export default Datepicker;

