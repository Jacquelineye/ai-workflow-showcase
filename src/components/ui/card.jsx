import { forwardRef } from "react";

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Card 卡片容器元件
 *
 * 設計規範：
 * - 圓角：固定 22px (rounded-4xl / rounded-[22px])
 * - 邊框：border border-stroke
 * - 陰影：shadow-drop-s
 * - 內距：預設 p-16 (可透過 className 覆蓋調整)
 * - 支援多種卡片變體 (variant: "default" | "subtle" | "flat" | "outline")
 */
export const Card = forwardRef(function Card(
  {
    as: Component = "div",
    children,
    className = "",
    variant = "default",
    "data-component": dataComponent = "Card",
    ...props
  },
  ref,
) {
  const variantStyles = {
    default: "bg-white border-stroke shadow-drop-s text-fontcolor",
    subtle: "bg-bg/50 border-stroke/70 text-fontcolor",
    flat: "bg-white border-stroke text-fontcolor",
    outline: "bg-transparent border-stroke text-fontcolor",
  };

  return (
    <Component
      {...props}
      ref={ref}
      data-component={dataComponent}
      className={cx(
        "box-border flex flex-col",
        "rounded-[22px] rounded-4xl border",
        variantStyles[variant] || variantStyles.default,
        "font-primary text-left select-none",
        className,
      )}
    >
      {children}
    </Component>
  );
});

export default Card;

