import { forwardRef, useRef, useEffect, useCallback, useImperativeHandle, useId } from "react";

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

export const Textarea = forwardRef(function Textarea(
  {
    value,
    defaultValue,
    onChange,
    placeholder = "請輸入內容...",
    disabled = false,
    error = false,
    status, // "default" | "hover" | "focus" | "disabled" | "error" | "error-hover" | "error-focus" (展示專用)
    label,
    helperText,
    errorMessage,
    minHeight = 36, // 預設固定初始高度 36px，與 input / select 統一
    maxHeight = 160,
    id: propId,
    style,
    className = "",
    containerClassName = "",
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const id = propId || generatedId;

  const innerRef = useRef(null);
  useImperativeHandle(ref, () => innerRef.current);

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

  // 自行延伸高度邏輯：固定某高 (minHeight)，文字量超過時自動向下延伸
  const adjustHeight = useCallback(() => {
    const el = innerRef.current;
    if (!el) return;
    el.style.height = "auto";
    const nextHeight = Math.max(minHeight, el.scrollHeight);
    if (maxHeight && nextHeight > maxHeight) {
      el.style.height = `${maxHeight}px`;
      el.style.overflowY = "auto";
    } else {
      el.style.height = `${nextHeight}px`;
      el.style.overflowY = "hidden";
    }
  }, [minHeight, maxHeight]);

  useEffect(() => {
    adjustHeight();
  }, [value, defaultValue, adjustHeight]);

  const handleChange = (e) => {
    adjustHeight();
    onChange?.(e);
  };

  return (
    <div className={cx("flex flex-col gap-4 font-primary text-left", containerClassName)}>
      {label && (
        <label htmlFor={id} className="text-caption-1 font-medium text-[#A3A3A3] select-none">
          {label}
        </label>
      )}

      <textarea
        {...props}
        ref={innerRef}
        id={id}
        value={value}
        defaultValue={defaultValue}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={isDisabled}
        readOnly={isDisabled}
        style={{
          minHeight: `${minHeight}px`,
          ...style,
        }}
        className={cx(
          // 禁止使用者手動拖拉 (resize-none)，初始高度 36px，內容超出自動延伸
          "box-border w-full min-h-[36px] rounded-[18px] border px-12 py-[7px] text-label-3 font-normal font-primary transition-all duration-150 resize-none",
          "outline-none placeholder:text-placeholder",

          // 狀態判定
          isDisabled
            ? "!bg-bg/60 bg-bg/60 !border-stroke/60 border-stroke/60 !text-description text-description !cursor-not-allowed cursor-not-allowed shadow-none"
            : status
              ? cx("bg-white", STATUS_STYLES[status])
              : isError
                ? "bg-white border-error text-fontcolor hover:border-error hover:ring-2 hover:ring-error/15 hover:shadow-drop-s focus:border-error focus:ring-2 focus:ring-error/20"
                : "bg-white border-stroke text-fontcolor hover:border-primary/70 hover:shadow-drop-s focus:border-primary focus:ring-2 focus:ring-primary/20",

          "disabled:!bg-bg/60 disabled:bg-bg/60 disabled:!border-stroke/60 disabled:border-stroke/60 disabled:!text-description disabled:text-description disabled:!cursor-not-allowed disabled:cursor-not-allowed disabled:shadow-none",
          className,
        )}
      />

      {(errorMessage || helperText) && (
        <p className={cx("m-0 text-caption-2", isError ? "text-error" : "text-description")}>
          {errorMessage || helperText}
        </p>
      )}
    </div>
  );
});

export default Textarea;
