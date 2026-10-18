import { forwardRef, useState, useRef, useEffect, useCallback, useId } from "react";

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
  "error-focus": "bg-white border-error text-fontcolor ring-2 ring-error/20", // 錯誤且聚焦 (紅框 + 紅色聚焦環)
  errorFocus: "bg-white border-error text-fontcolor ring-2 ring-error/20",
};

export const Input = forwardRef(function Input(
  {
    type = "text",
    value: propValue,
    defaultValue,
    onChange,
    placeholder = "請輸入...",
    disabled = false,
    error = false,
    status, // "default" | "hover" | "focus" | "disabled" | "error" | "error-focus" (展示專用)
    prefixIcon,
    suffixIcon,
    step = 1,
    min,
    max,
    label,
    helperText,
    errorMessage,
    id: propId,
    className = "",
    containerClassName = "",
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const id = propId || generatedId;

  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const prefixRef = useRef(null);
  const suffixRef = useRef(null);

  const [prefixPadding, setPrefixPadding] = useState(null);
  const [suffixPadding, setSuffixPadding] = useState(null);

  useEffect(() => {
    if (prefixRef.current) {
      const w = prefixRef.current.offsetWidth || 16;
      setPrefixPadding(w + 14); // 10px 左邊界 + 圖示寬 + 4px 間距
    } else {
      setPrefixPadding(null);
    }
  }, [prefixIcon]);

  useEffect(() => {
    if (suffixRef.current) {
      const w = suffixRef.current.offsetWidth || 14;
      setSuffixPadding(w + 14); // 10px 右邊界 + 單位寬 + 4px 間距
    } else {
      setSuffixPadding(null);
    }
  }, [suffixIcon]);

  const [internalValue, setInternalValue] = useState(
    defaultValue ?? (propValue !== undefined ? propValue : ""),
  );
  const isControlled = propValue !== undefined;
  const currentValue = isControlled ? propValue : internalValue;

  const isDisabled = disabled || status === "disabled";
  const isError = Boolean(
    error ||
      errorMessage ||
      status === "error" ||
      status === "error-hover" ||
      status === "errorHover" ||
      status === "error-focus" ||
      status === "errorFocus",
  );

  const isNumberType = type === "number";

  // 結合外部 ref
  const setRefs = useCallback(
    (node) => {
      inputRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    },
    [ref],
  );

  // 數值增減邏輯 (支援滾輪微調，無須上下箭頭按鈕)
  const adjustNumber = useCallback(
    (direction) => {
      if (isDisabled) return;
      const stepVal = Number(step) || 1;
      const minVal = min !== undefined ? Number(min) : -Infinity;
      const maxVal = max !== undefined ? Number(max) : Infinity;

      const num = Number(currentValue === "" ? 0 : currentValue);
      const safeNum = isNaN(num) ? 0 : num;
      const nextNum = Math.max(minVal, Math.min(maxVal, safeNum + direction * stepVal));

      const stepDecimals = (stepVal.toString().split(".")[1] || "").length;
      const formatted = stepDecimals > 0 ? Number(nextNum.toFixed(stepDecimals)) : nextNum;

      if (!isControlled) {
        setInternalValue(formatted);
      }
      if (inputRef.current) {
        inputRef.current.value = formatted;
      }

      const syntheticEvent = {
        target: {
          value: formatted,
          name: props.name,
          id,
        },
      };
      onChange?.(syntheticEvent);
    },
    [currentValue, isControlled, isDisabled, max, min, onChange, props.name, step, id],
  );

  // 支援在該框內滾輪調整數字大小
  useEffect(() => {
    const el = containerRef.current;
    if (!el || !isNumberType) return;

    const handleWheel = (e) => {
      if (isDisabled) return;
      e.preventDefault();
      const direction = e.deltaY < 0 ? 1 : -1;
      adjustNumber(direction);
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", handleWheel);
    };
  }, [isDisabled, isNumberType, adjustNumber]);

  const handleChange = (e) => {
    if (!isControlled) {
      setInternalValue(e.target.value);
    }
    onChange?.(e);
  };

  return (
    <div className={cx("flex flex-col gap-4 font-primary text-left", containerClassName)}>
      {label && (
        <label htmlFor={id} className="text-caption-1 font-medium text-[#A3A3A3] select-none">
          {label}
        </label>
      )}

      <div
        ref={containerRef}
        className="relative flex h-[36px] w-full items-center select-none"
      >
        {prefixIcon && (
          <div
            ref={prefixRef}
            className="pointer-events-none absolute left-10 flex h-16 w-16 items-center justify-center text-description"
          >
            {prefixIcon}
          </div>
        )}

        <input
          {...props}
          ref={setRefs}
          id={id}
          type={type}
          value={isControlled ? propValue : internalValue}
          defaultValue={defaultValue}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={isDisabled}
          step={step}
          min={min}
          max={max}
          className={cx(
            "box-border h-[36px] min-h-[36px] max-h-[36px] w-full appearance-none rounded-[18px] border bg-white text-label-3 font-normal font-primary transition-all duration-150",
            "outline-none placeholder:text-placeholder",
            prefixIcon ? (prefixPadding ? "" : "pl-[28px]") : "pl-12",
            suffixIcon ? (suffixPadding ? "" : "pr-[26px]") : "pr-12",

            // 隱藏原生粗糙的數字輸入箭頭，保持乾淨簡潔
            isNumberType && [
              "[appearance:textfield]",
              "[&::-webkit-outer-spin-button]:appearance-none",
              "[&::-webkit-inner-spin-button]:appearance-none",
              "[-moz-appearance:textfield]",
            ],

            // 狀態判定
            status
              ? STATUS_STYLES[status]
              : cx(
                  isError
                    ? "border-error text-fontcolor hover:border-error hover:ring-2 hover:ring-error/15 hover:shadow-drop-s focus:border-error focus:ring-2 focus:ring-error/20"
                    : "border-stroke text-fontcolor hover:border-primary/70 hover:shadow-drop-s focus:border-primary focus:ring-2 focus:ring-primary/20",
                  "disabled:bg-bg/60 disabled:border-stroke/60 disabled:text-description disabled:cursor-not-allowed",
                ),

            className,
          )}
          style={{
            ...(isNumberType ? { WebkitAppearance: "none", MozAppearance: "textfield" } : {}),
            ...(prefixPadding ? { paddingLeft: `${prefixPadding}px` } : {}),
            ...(suffixPadding ? { paddingRight: `${suffixPadding}px` } : {}),
            ...props.style,
          }}
        />

        {suffixIcon && (
          <div
            ref={suffixRef}
            className="pointer-events-none absolute right-10 flex items-center justify-center text-caption-2 font-mono text-description select-none"
          >
            {suffixIcon}
          </div>
        )}
      </div>

      {(errorMessage || helperText) && (
        <p className={cx("m-0 text-caption-2", isError ? "text-error" : "text-description")}>
          {errorMessage || helperText}
        </p>
      )}
    </div>
  );
});

export default Input;
