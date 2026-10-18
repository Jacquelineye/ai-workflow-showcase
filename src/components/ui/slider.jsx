import { forwardRef, useState, useId } from "react";

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

export const Slider = forwardRef(function Slider(
  {
    min = 0,
    max = 100,
    step = 1,
    value: propValue,
    defaultValue = 50,
    onChange,
    disabled = false,
    status, // "default" | "hover" | "active" | "disabled"
    label,
    showValue = true,
    unit = "",
    formatValue,
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

  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = propValue !== undefined;
  const rawValue = isControlled ? propValue : internalValue;
  const value = Number(rawValue);

  const isDisabled = disabled || status === "disabled";
  const isHovered = status === "hover";
  const isActive = status === "active";

  const percentage = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));

  const handleChange = (e) => {
    if (isDisabled) return;
    const next = Number(e.target.value);
    if (!isControlled) {
      setInternalValue(next);
    }
    onChange?.(next);
  };

  const displayVal = formatValue ? formatValue(value) : `${value}${unit}`;

  return (
    <div
      className={cx(
        "flex flex-col gap-4 font-primary text-left select-none",
        containerClassName,
      )}
    >
      {/* 標籤列 */}
      {label && (
        <label htmlFor={id} className="text-caption-1 font-medium text-[#A3A3A3] select-none">
          {label}
        </label>
      )}

      {/* 滑桿軸與右側數值顯示列：上下 padding +4px，與 label 保持舒適間距並增加點擊舒適度 */}
      <div className="flex items-center gap-10 py-[4px]">
        {/* 滑桿控制列：高度緊湊 16px 包覆 12px 軌道，消除上下多餘留白 */}
        <div
          className={cx(
            "relative flex h-[16px] flex-1 items-center",
            isDisabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
            className,
          )}
        >
          {/* 背景軌道 (高度 12px) */}
          <div className="relative h-[12px] w-full rounded-full bg-slate-200 overflow-hidden">
            {/* 已填滿區域 */}
            <div
              className={cx(
                "h-full rounded-full transition-all duration-75",
                isDisabled ? "bg-slate-400" : "bg-primary",
              )}
              style={{ width: `${percentage}%` }}
            />
          </div>

          {/* 原生 range input (透明疊在上方提供完整無障礙與鍵盤互動) */}
          <input
            {...props}
            ref={ref}
            id={id}
            name={name}
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            disabled={isDisabled}
            onChange={handleChange}
            className={cx(
              "absolute inset-0 h-full w-full opacity-0",
              isDisabled ? "cursor-not-allowed" : "cursor-pointer",
            )}
          />

          {/* 滑動的球 (高度 10px、寬度 10px，內嵌置中於 12px 軌道內) */}
          <div
            className={cx(
              "pointer-events-none absolute h-[10px] w-[10px] rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.25)] transition-all duration-75",
              isDisabled
                ? "bg-slate-300"
                : isHovered
                  ? "ring-2 ring-primary/30 scale-110"
                  : isActive
                    ? "ring-2 ring-primary/50 scale-110"
                    : "",
            )}
            style={{
              top: "calc(50% - 5px)",
              left: `calc(1px + (100% - 12px) * ${percentage / 100})`,
            }}
          />
        </div>

        {/* 軸右側數值顯示：無底色、純文字 */}
        {showValue && (
          <span
            className={cx(
              "shrink-0 font-mono text-caption-1 font-normal text-fontcolor select-none min-w-[36px] text-right",
              isDisabled && "opacity-50 text-description",
            )}
          >
            {displayVal}
          </span>
        )}
      </div>
    </div>
  );
});

export default Slider;

