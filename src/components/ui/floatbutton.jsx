import { forwardRef } from "react";

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

/**
 * FloatButton 懸浮按鈕元件
 *
 * 設計規範：
 * - 支援圓形 (circle，預設 44x44) 與圓角方形 (square)
 * - 支援主要風格 (primary，填滿主色) 與預設風格 (default，純白底加邊框陰影)
 * - 支援 Hover 向左流暢展開文字 (icon + label)
 * - 具備高品質懸浮陰影 (shadow-drop-m / shadow-drop-l) 與微互動動態
 */
export const FloatButton = forwardRef(function FloatButton(
  {
    as: Component = "button",
    type = "button",
    icon,
    text,
    shape = "circle", // "circle" | "square"
    variant = "primary", // "primary" | "default" | "subtle"
    badge,
    tooltip,
    title,
    description,
    disabled = false,
    className = "",
    children,
    onClick,
    "aria-label": ariaLabel,
    ...props
  },
  ref,
) {
  const displayText = text || (typeof children === "string" ? children : null);

  const resolvedAriaLabel =
    ariaLabel ||
    title ||
    tooltip ||
    (displayText ? `新增${displayText}` : "懸浮按鈕");

  const shapeClass = shape === "circle" ? "rounded-full" : "rounded-xl";

  const variantStyles = {
    primary:
      "bg-primary text-white border-0 hover:bg-primary/90 active:bg-primary shadow-drop-m hover:shadow-drop-l focus-visible:ring-primary",
    default:
      "bg-white text-fontcolor border border-stroke hover:border-primary/40 hover:text-primary active:bg-bg shadow-drop-m hover:shadow-drop-l focus-visible:ring-primary",
    subtle:
      "bg-white/80 backdrop-blur-sm text-fontcolor border border-stroke/60 hover:bg-white hover:text-primary shadow-drop-s hover:shadow-drop-m focus-visible:ring-primary",
  };

  return (
    <Component
      {...props}
      ref={ref}
      type={Component === "button" ? type : undefined}
      disabled={disabled}
      onClick={onClick}
      aria-label={resolvedAriaLabel}
      title={title || tooltip || (displayText ? `新增${displayText}` : undefined)}
      className={cx(
        "group relative box-border inline-flex h-[44px] shrink-0 items-center justify-center select-none",
        "cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] motion-reduce:transition-none",
        "hover:shadow-drop-l active:scale-95",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none",
        shapeClass,
        variantStyles[variant] ?? variantStyles.primary,
        displayText
          ? "min-w-[44px] max-w-[44px] hover:max-w-[120px] px-[13px] hover:px-14"
          : "w-[44px]",
        className,
      )}
    >
      {badge && (
        <span className="absolute -top-4 -right-4 flex h-16 min-w-16 items-center justify-center rounded-full bg-error px-4 text-[10px] font-bold text-white shadow-drop-s">
          {badge}
        </span>
      )}

      {icon ? (
        <span
          className="inline-flex h-18 w-18 shrink-0 items-center justify-center bg-transparent fill-current stroke-current"
          aria-hidden="true"
        >
          {icon}
        </span>
      ) : null}

      {displayText && (
        <span
          className={cx(
            "whitespace-nowrap text-[13.5px] font-medium leading-none overflow-hidden",
            "max-w-0 opacity-0 -translate-x-2",
            "transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]",
            "group-hover:max-w-[80px] group-hover:opacity-100 group-hover:translate-x-0 group-hover:ml-6",
          )}
        >
          {displayText}
        </span>
      )}

      {!icon && !displayText ? children : null}
    </Component>
  );
});

export default FloatButton;
