import { forwardRef, useState, useId } from "react";

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

export const Switch = forwardRef(function Switch(
  {
    checked: propChecked,
    defaultChecked = false,
    onChange,
    disabled = false,
    status, // "default" | "hover" | "focus" | "checked" | "disabled" (展示用)
    label,
    description,
    id: propId,
    name,
    className = "",
    containerClassName = "",
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const id = propId || generatedId;

  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const isControlled = propChecked !== undefined;

  // status 強制展示邏輯
  const isChecked =
    status === "checked"
      ? true
      : status === "default"
        ? false
        : isControlled
          ? propChecked
          : internalChecked;

  const isDisabled = disabled || status === "disabled";
  const isHovered = status === "hover";
  const isFocused = status === "focus";

  const handleToggle = () => {
    if (isDisabled) return;
    const next = !isChecked;
    if (!isControlled) {
      setInternalChecked(next);
    }
    onChange?.(next);
  };

  const handleKeyDown = (e) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      handleToggle();
    }
  };

  return (
    <div
      className={cx(
        "flex min-h-[28px] items-center justify-between gap-12 font-primary select-none",
        isDisabled && "opacity-60 cursor-not-allowed",
        containerClassName,
      )}
    >
      {(label || description) && (
        <label
          htmlFor={id}
          className={cx(
            "flex flex-col text-left",
            isDisabled ? "cursor-not-allowed" : "cursor-pointer",
          )}
        >
          {label && (
            <span className="text-caption-1 font-medium text-[#A3A3A3]">
              {label}
            </span>
          )}
          {description && (
            <span className="text-caption-2 text-description leading-tight">
              {description}
            </span>
          )}
        </label>
      )}

      {/* 開關本體 (尺寸 44x24px，背景色彩平滑過渡) */}
      <button
        {...props}
        ref={ref}
        id={id}
        name={name}
        type="button"
        role="switch"
        aria-checked={isChecked}
        disabled={isDisabled}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        className={cx(
          "relative inline-flex h-[24px] w-[44px] shrink-0 items-center rounded-full transition-all duration-200 outline-none select-none",
          isDisabled ? "cursor-not-allowed" : "cursor-pointer active:scale-95",

          // 狀態色彩判定
          isChecked
            ? isHovered
              ? "bg-primary/85 ring-2 ring-primary/20"
              : isFocused
                ? "bg-primary ring-2 ring-primary/30"
                : "bg-primary"
            : isHovered
              ? "bg-slate-300 ring-2 ring-slate-400/20"
              : isFocused
                ? "bg-slate-300 ring-2 ring-primary/30"
                : "bg-stroke",

          // 互動狀態 (非展示時)
          !status && !isDisabled && [
            "hover:ring-2 hover:ring-primary/20",
            "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
          ],

          className,
        )}
      >
        {/* 滑動旋鈕 (左右跳動彈性開關效果：Spring 物理回彈曲線 cubic-bezier(0.34, 1.75, 0.64, 1)) */}
        <span
          className={cx(
            "inline-block h-[20px] w-[20px] rounded-full bg-white shadow-drop-s pointer-events-none",
            "transition-transform duration-350 [transition-timing-function:cubic-bezier(0.34,1.75,0.64,1)]",
            isChecked ? "translate-x-[22px]" : "translate-x-[2px]",
          )}
        />
      </button>
    </div>
  );
});

export default Switch;
