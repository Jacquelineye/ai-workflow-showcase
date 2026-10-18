import { forwardRef, useState } from "react";


const VARIANTS = {
  filled: {
    default:
      "bg-transparent text-primary shadow-none",

    hover:
      "bg-white bg-gradient-to-r from-primary/30 to-primary/30 text-primary shadow-drop-s",

    selected:
      "bg-primary text-white shadow-inner-s",

    interaction: [
      "enabled:hover:bg-white",
      "enabled:hover:bg-gradient-to-r",
      "enabled:hover:from-primary/30",
      "enabled:hover:to-primary/30",
      "enabled:hover:shadow-drop-s",
      "enabled:active:shadow-inner-s",
    ].join(" "),
  },

  outline: {
    default:
      "border border-transparent bg-transparent text-primary shadow-none",

    hover:
      "border border-primary bg-white text-primary shadow-drop-s",

    selected:
      "border border-primary bg-white text-primary shadow-inner-s",

    interaction: [
      "enabled:hover:border-primary",
      "enabled:hover:bg-white",
      "enabled:hover:shadow-drop-s",
      "enabled:active:shadow-inner-s",
    ].join(" "),
  },

  ghost: {
    // 原設計預設為透明底、白字，適合深色背景。
    default:
      "bg-transparent text-white shadow-none",

    hover:
      "bg-white text-primary shadow-drop-s",

    selected:
      "bg-white text-primary shadow-inner-s",

    interaction: [
      "enabled:hover:bg-white",
      "enabled:hover:text-primary",
      "enabled:hover:shadow-drop-s",
      "enabled:active:shadow-inner-s",
    ].join(" "),
  },
};

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

/* 保留原設計的 music 圖示，背景透明。 */
export function MusicIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="h-full w-full bg-transparent fill-current"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M14.4333 1.49339C14.3607 1.43103 14.2754 1.38505 14.1834 1.3586C14.0914 1.33214 13.9947 1.32581 13.9 1.34006L5.23334 2.67339C5.07552 2.69734 4.93152 2.77712 4.82753 2.89824C4.72355 3.01935 4.66647 3.17376 4.66668 3.33339V10.2334C4.35519 10.0812 4.01334 10.0015 3.66668 10.0001C3.20519 10.0001 2.75406 10.1369 2.37035 10.3933C1.98663 10.6497 1.68756 11.0141 1.51096 11.4405C1.33435 11.8668 1.28815 12.336 1.37818 12.7886C1.46821 13.2412 1.69044 13.657 2.01676 13.9833C2.34308 14.3096 2.75884 14.5319 3.21147 14.6219C3.66409 14.7119 4.13324 14.6657 4.55961 14.4891C4.98597 14.3125 5.35038 14.0134 5.60677 13.6297C5.86316 13.246 6.00001 12.7949 6.00001 12.3334V7.24006L13.3333 6.11339V8.90006C13.0219 8.74792 12.68 8.66815 12.3333 8.66673C11.8719 8.66673 11.4207 8.80357 11.037 9.05996C10.6533 9.31635 10.3542 9.68077 10.1776 10.1071C10.001 10.5335 9.95481 11.0026 10.0448 11.4553C10.1349 11.9079 10.3571 12.3237 10.6834 12.65C11.0098 12.9763 11.4255 13.1985 11.8781 13.2886C12.3308 13.3786 12.7999 13.3324 13.2263 13.1558C13.6526 12.9792 14.0171 12.6801 14.2734 12.2964C14.5298 11.9127 14.6667 11.4615 14.6667 11.0001V2.00006C14.6667 1.90377 14.6458 1.80861 14.6056 1.72115C14.5653 1.63368 14.5065 1.55598 14.4333 1.49339ZM3.66668 13.3334C3.4689 13.3334 3.27556 13.2747 3.11111 13.1649C2.94666 13.055 2.81849 12.8988 2.7428 12.7161C2.66711 12.5333 2.64731 12.3323 2.68589 12.1383C2.72448 11.9443 2.81972 11.7661 2.95957 11.6263C3.09942 11.4864 3.27761 11.3912 3.47159 11.3526C3.66557 11.314 3.86664 11.3338 4.04936 11.4095C4.23209 11.4852 4.38827 11.6134 4.49815 11.7778C4.60803 11.9423 4.66668 12.1356 4.66668 12.3334C4.66668 12.5986 4.56132 12.853 4.37378 13.0405C4.18625 13.228 3.93189 13.3334 3.66668 13.3334ZM12.3333 12.0001C12.1356 12.0001 11.9422 11.9414 11.7778 11.8315C11.6133 11.7216 11.4852 11.5655 11.4095 11.3827C11.3338 11.2 11.314 10.999 11.3526 10.805C11.3911 10.611 11.4864 10.4328 11.6262 10.293C11.7661 10.1531 11.9443 10.0579 12.1383 10.0193C12.3322 9.98069 12.5333 10.0005 12.716 10.0762C12.8988 10.1519 13.0549 10.28 13.1648 10.4445C13.2747 10.6089 13.3333 10.8023 13.3333 11.0001C13.3333 11.2653 13.228 11.5196 13.0405 11.7072C12.8529 11.8947 12.5986 12.0001 12.3333 12.0001ZM13.3333 4.76006L6.00001 5.88673V3.88673L13.3333 2.78006V4.76006Z" />
    </svg>
  );
}

const ToggleButton = forwardRef(function ToggleButton(
  {
    variant = "filled",

    selected,
    defaultSelected = false,
    onSelectedChange,

    disabled = false,
    status,

    showIcon = true,
    icon = <MusicIcon />,

    showText = true,
    children = "Music",

    onClick,
    type = "button",
    className = "",
    "aria-label": ariaLabel,

    ...buttonProps
  },
  ref,
) {
  const [internalSelected, setInternalSelected] = useState(
    defaultSelected,
  );

  const fixedPreview = [
    "default",
    "hover",
    "selected",
  ].includes(status);

  const isSelected = Boolean(
    selected ??
      (fixedPreview
        ? status === "selected"
        : internalSelected),
  );

  const styles = Object.prototype.hasOwnProperty.call(
    VARIANTS,
    variant,
  )
    ? VARIANTS[variant]
    : VARIANTS.filled;

  const state = isSelected
    ? "selected"
    : status === "hover"
      ? "hover"
      : "default";

  const accessibleLabel =
    ariaLabel ??
    (!showText && typeof children === "string"
      ? children
      : undefined);

  if (!showIcon && !showText) {
    throw new Error(
      "ToggleButton 至少需要顯示圖示或文字。",
    );
  }

  if (
    !showText &&
    (typeof accessibleLabel !== "string" ||
      !accessibleLabel.trim())
  ) {
    throw new Error(
      "純圖示 ToggleButton 必須提供 aria-label。",
    );
  }

  function handleClick(event) {
    if (disabled) return;

    onClick?.(event);

    // 呼叫端可取消自動切換。
    if (event.defaultPrevented) return;

    const next = !isSelected;

    if (selected === undefined && !fixedPreview) {
      setInternalSelected(next);
    }

    onSelectedChange?.(next, event);
  }

  return (
    <button
      {...buttonProps}
      ref={ref}
      type={type}
      disabled={disabled}
      aria-label={accessibleLabel}
      aria-pressed={isSelected}
      onClick={handleClick}
      className={cx(
        "box-border inline-flex h-[36px] shrink-0",
        "items-center justify-center gap-4",
        "rounded-full",
        "font-primary text-label-2 whitespace-nowrap",

        showText ? "px-10 py-4" : "w-[36px] p-0",

        isSelected ? "font-medium" : "font-normal",

        "cursor-pointer",
        "transition-all duration-200",
        "motion-reduce:transition-none",

        // 滑鼠操作不顯示焦點外框。
        "focus:outline-none",
        "focus-visible:ring-2 focus-visible:ring-stroke",
        "focus-visible:ring-offset-2",
        "focus-visible:ring-offset-white",

        "disabled:cursor-not-allowed disabled:opacity-50",

        styles[state],

        !disabled &&
          !isSelected &&
          !fixedPreview &&
          styles.interaction,

        className,
      )}
    >
      {showIcon && (
        <span
          className="inline-flex h-16 w-16 shrink-0 items-center justify-center bg-transparent"
          aria-hidden="true"
        >
          {icon}
        </span>
      )}

      {showText && <span>{children}</span>}
    </button>
  );
});

export default ToggleButton;
export { ToggleButton };