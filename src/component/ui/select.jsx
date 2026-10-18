import { forwardRef, useState, useRef, useEffect, useLayoutEffect, useId, useCallback } from "react";
import { createPortal } from "react-dom";

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

const STATUS_STYLES = {
  default: "bg-white border-stroke text-fontcolor",
  hover: "bg-white border-primary/70 text-fontcolor shadow-drop-s",
  focus: "bg-white border-primary ring-2 ring-primary/20 text-fontcolor",
  disabled: "bg-bg/60 border-stroke/60 text-description cursor-not-allowed",
  error: "bg-white border-error text-fontcolor", // 錯誤未聚焦 (純紅框)
  "error-hover": "bg-white border-error text-fontcolor shadow-drop-s ring-2 ring-error/15", // 錯誤懸停 (紅框 + 微紅外環與陰影)
  errorHover: "bg-white border-error text-fontcolor shadow-drop-s ring-2 ring-error/15",
  "error-focus": "bg-white border-error text-fontcolor ring-2 ring-error/20", // 錯誤且聚焦/展開中
  errorFocus: "bg-white border-error text-fontcolor ring-2 ring-error/20",
};

export const Select = forwardRef(function Select(
  {
    options = [],
    value: propValue,
    defaultValue,
    onChange,
    placeholder = "請選擇...",
    disabled = false,
    error = false,
    status, // "default" | "hover" | "focus" | "disabled" | "error" | "error-focus" (展示專用)
    prefixIcon,
    label,
    helperText,
    errorMessage,
    id: propId,
    className = "",
    containerClassName = "",
  },
  ref,
) {
  const generatedId = useId();
  const id = propId || generatedId;

  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue ?? options[0]?.value ?? "");
  const value = propValue !== undefined ? propValue : internalValue;

  const selectRef = useRef(null);
  const internalButtonRef = useRef(null);
  const menuRef = useRef(null);
  const [dropdownStyle, setDropdownStyle] = useState({});

  const isDisabled = disabled || status === "disabled";
  const isError = Boolean(error || errorMessage || status === "error" || status === "error-focus" || status === "errorFocus");

  const selectedOption = options.find((opt) => opt.value === value);

  // 結合外部 ref 與內部按鈕 ref
  const setButtonRefs = useCallback(
    (node) => {
      internalButtonRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    },
    [ref],
  );

  // 精確計算浮動清單之 fixed 座標，使其徹底跨出父容器與卡片之限制
  const updatePosition = useCallback(() => {
    const el = internalButtonRef.current || selectRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();

    if (rect.width <= 0) return;

    // 若觸發按鈕已滾動離開視窗範圍，主動關閉選單
    if (rect.bottom < 0 || rect.top > window.innerHeight) {
      setIsOpen(false);
      return;
    }

    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const menuMaxHeight = 220;

    // 若下方空間不足 180px 且上方空間更大，則往上展開；否則正常往下展開
    const openUpward = spaceBelow < 180 && spaceAbove > spaceBelow;
    const availableHeight = openUpward ? spaceAbove - 16 : spaceBelow - 16;
    const maxHeight = Math.min(menuMaxHeight, Math.max(100, availableHeight));

    // 橫向位置：嚴格與觸發按鈕左邊界對齊，並確保不超出螢幕左右邊界，選單寬度至少 108px 以舒適容納文字與勾選圖示
    const menuWidth = Math.max(108, rect.width);
    const safeLeft = Math.max(8, Math.min(rect.left, window.innerWidth - menuWidth - 8));

    setDropdownStyle({
      position: "fixed",
      left: `${safeLeft}px`,
      width: `${menuWidth}px`,
      top: openUpward ? "auto" : `${rect.bottom + 4}px`,
      bottom: openUpward ? `${window.innerHeight - rect.top + 4}px` : "auto",
      maxHeight: `${maxHeight}px`,
      boxSizing: "border-box",
      margin: 0,
      zIndex: 99999,
    });
  }, []);

  // 監聽全域事件：一次只能打開一個 select
  useEffect(() => {
    const handleCloseOther = (e) => {
      if (e.detail?.id !== id) {
        setIsOpen(false);
      }
    };
    document.addEventListener("close-other-selects", handleCloseOther);
    return () => {
      document.removeEventListener("close-other-selects", handleCloseOther);
    };
  }, [id]);

  // 開啟選單時立即在 Paint 之前精確計算位置 (useLayoutEffect)
  useLayoutEffect(() => {
    if (!isOpen) return;
    updatePosition();
  }, [isOpen, updatePosition]);

  // 開啟選單時監聽全域滾動與視窗大小變更以即時同步位置
  useEffect(() => {
    if (!isOpen) return;

    const handleScrollOrResize = () => {
      updatePosition();
    };

    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);

    return () => {
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [isOpen, updatePosition]);

  // 點選外部關閉選單（需同時判斷按鈕容器與 Portal 選單）
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      const inButton = selectRef.current && selectRef.current.contains(e.target);
      const inMenu = menuRef.current && menuRef.current.contains(e.target);
      if (!inButton && !inMenu) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const toggleOpen = () => {
    if (isDisabled) return;
    if (!isOpen) {
      updatePosition();
      document.dispatchEvent(new CustomEvent("close-other-selects", { detail: { id } }));
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  const handleSelectOption = (opt) => {
    if (opt.disabled) return;
    if (propValue === undefined) {
      setInternalValue(opt.value);
    }
    onChange?.(opt.value, opt);
    setIsOpen(false);
  };

  return (
    <div
      ref={selectRef}
      className={cx("relative flex flex-col gap-4 font-primary text-left", containerClassName)}
    >
      {label && (
        <label htmlFor={id} className="text-caption-1 font-medium text-[#A3A3A3] select-none">
          {label}
        </label>
      )}

      {/* 觸發按鈕 (固定高度 36px，圓角 18px) */}
      <button
        ref={setButtonRefs}
        id={id}
        type="button"
        disabled={isDisabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={toggleOpen}
        className={cx(
          "box-border flex h-[36px] min-h-[36px] max-h-[36px] w-full items-center justify-between rounded-[18px] border px-12 text-label-3 font-normal font-primary transition-all duration-150",
          "outline-none text-left select-none",
          prefixIcon && "pl-10",

          isDisabled
            ? "!bg-bg/60 bg-bg/60 !border-stroke/60 border-stroke/60 !text-description text-description !cursor-not-allowed cursor-not-allowed shadow-none pointer-events-none"
            : status
              ? cx("bg-white cursor-pointer", STATUS_STYLES[status])
              : isError
                ? cx(
                    "bg-white cursor-pointer border-error text-fontcolor hover:border-error hover:ring-2 hover:ring-error/15 hover:shadow-drop-s focus:border-error focus:ring-2 focus:ring-error/20",
                    isOpen && "ring-2 ring-error/20",
                  )
                : cx(
                    "bg-white cursor-pointer border-stroke text-fontcolor hover:border-primary/70 hover:shadow-drop-s focus:border-primary focus:ring-2 focus:ring-primary/20",
                    isOpen && "border-primary ring-2 ring-primary/20",
                  ),

          "disabled:!bg-bg/60 disabled:bg-bg/60 disabled:!border-stroke/60 disabled:border-stroke/60 disabled:!text-description disabled:text-description disabled:!cursor-not-allowed disabled:cursor-not-allowed disabled:pointer-events-none disabled:shadow-none",
          className,
        )}
      >
        <div className="flex min-w-0 items-center gap-8 truncate">
          {prefixIcon && (
            <span className="flex h-16 w-16 shrink-0 items-center justify-center text-description">
              {prefixIcon}
            </span>
          )}
          {selectedOption?.icon && (
            <span className="flex h-16 w-16 shrink-0 items-center justify-center text-primary">
              {selectedOption.icon}
            </span>
          )}
          <span className={cx("truncate", !selectedOption && "text-placeholder", isDisabled && "!text-description")}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>

        {/* 箭頭指示圖示 */}
        <span
          className={cx(
            "flex h-[20px] w-[20px] shrink-0 items-center justify-center rounded-full transition-all",
            isOpen ? "bg-[#CEDAE3] text-primary shadow-inner" : "text-description",
          )}
        >
          <svg
            viewBox="0 0 24 24"
            className={cx(
              "h-14 w-14 shrink-0 stroke-current fill-none stroke-2 transition-transform duration-150",
              isDisabled ? "opacity-40" : isOpen ? "rotate-180 text-primary" : "text-description",
            )}
          >
            <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>

      {/* 下拉浮動清單：以 Portal 渲染於最外層，超出卡片時直接跨出，不被 card 限制裁切 */}
      {isOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <ul
            ref={menuRef}
            role="listbox"
            style={dropdownStyle}
            onMouseDown={(e) => e.stopPropagation()}
            className="m-0 box-border flex flex-col gap-4 overflow-y-auto rounded-[18px] border border-stroke bg-white p-4 shadow-drop-m list-none animate-in fade-in duration-100 custom-scrollbar select-none"
          >
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <li
                  key={opt.value}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelectOption(opt)}
                  className={cx(
                    "flex h-32 w-full items-center justify-between gap-8 rounded-full px-12 text-label-3 transition-colors select-none",
                    opt.disabled
                      ? "cursor-not-allowed text-description/50"
                      : isSelected
                        ? "bg-primary/15 font-medium text-primary cursor-default"
                        : "cursor-pointer text-fontcolor hover:bg-primary/10 hover:text-primary",
                  )}
                >
                  <div className="flex min-w-0 items-center gap-8 truncate">
                    {opt.icon && (
                      <span className="flex h-16 w-16 shrink-0 items-center justify-center">
                        {opt.icon}
                      </span>
                    )}
                    <span className="truncate">{opt.label}</span>
                  </div>

                  {isSelected && (
                    <svg
                      viewBox="0 0 24 24"
                      className="h-16 w-16 shrink-0 stroke-current fill-none stroke-2 text-primary"
                    >
                      <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </li>
              );
            })}
          </ul>,
          document.body,
        )}

      {(errorMessage || helperText) && (
        <p className={cx("m-0 text-caption-2", isError ? "text-error" : "text-description")}>
          {errorMessage || helperText}
        </p>
      )}
    </div>
  );
});

export default Select;
