import { forwardRef } from "react";



const INTENTS = {
  primary: {
    filled:
      "bg-primary text-white enabled:hover:bg-primary/80 enabled:active:bg-primary disabled:bg-primary/50",
    outline:
      "border-primary bg-white text-primary enabled:hover:bg-primary/10 enabled:active:bg-primary/30 disabled:border-primary/50 disabled:bg-white disabled:text-primary/50",
    ghost:
      "bg-transparent text-primary enabled:hover:bg-primary/10 enabled:active:bg-primary/30 disabled:bg-transparent disabled:text-primary/50",
    preview: {
      filled: {
        hover: "bg-primary/80",
        active: "bg-primary",
      },
      outline: {
        hover: "bg-primary/10",
        active: "bg-primary/30",
      },
      ghost: {
        hover: "bg-primary/10",
        active: "bg-primary/30",
      },
    },
  },

  secondary: {
    filled:
      "bg-secondary text-white enabled:hover:bg-secondary/80 enabled:active:bg-secondary disabled:bg-secondary/50",
    outline:
      "border-secondary bg-white text-secondary enabled:hover:bg-secondary/10 enabled:active:bg-secondary/30 disabled:border-secondary/50 disabled:bg-white disabled:text-secondary/50",
    ghost:
      "bg-transparent text-secondary enabled:hover:bg-secondary/10 enabled:active:bg-secondary/30 disabled:bg-transparent disabled:text-secondary/50",
    preview: {
      filled: {
        hover: "bg-secondary/80",
        active: "bg-secondary",
      },
      outline: {
        hover: "bg-secondary/10",
        active: "bg-secondary/30",
      },
      ghost: {
        hover: "bg-secondary/10",
        active: "bg-secondary/30",
      },
    },
  },

  success: {
    filled:
      "bg-success text-white enabled:hover:bg-success/80 enabled:active:bg-success disabled:bg-success/50",
    outline:
      "border-success bg-white text-success enabled:hover:bg-success/10 enabled:active:bg-success/30 disabled:border-success/50 disabled:bg-white disabled:text-success/50",
    ghost:
      "bg-transparent text-success enabled:hover:bg-success/10 enabled:active:bg-success/30 disabled:bg-transparent disabled:text-success/50",
    preview: {
      filled: {
        hover: "bg-success/80",
        active: "bg-success",
      },
      outline: {
        hover: "bg-success/10",
        active: "bg-success/30",
      },
      ghost: {
        hover: "bg-success/10",
        active: "bg-success/30",
      },
    },
  },

  error: {
    filled:
      "bg-error text-white enabled:hover:bg-error/80 enabled:active:bg-error disabled:bg-error/50",
    outline:
      "border-error bg-white text-error enabled:hover:bg-error/10 enabled:active:bg-error/30 disabled:border-error/50 disabled:bg-white disabled:text-error/50",
    ghost:
      "bg-transparent text-error enabled:hover:bg-error/10 enabled:active:bg-error/30 disabled:bg-transparent disabled:text-error/50",
    preview: {
      filled: {
        hover: "bg-error/80",
        active: "bg-error",
      },
      outline: {
        hover: "bg-error/10",
        active: "bg-error/30",
      },
      ghost: {
        hover: "bg-error/10",
        active: "bg-error/30",
      },
    },
  },

  warning: {
    filled:
      "bg-warning text-white enabled:hover:bg-warning/80 enabled:active:bg-warning disabled:bg-warning/50",
    outline:
      "border-warning bg-white text-warning enabled:hover:bg-warning/10 enabled:active:bg-warning/30 disabled:border-warning/50 disabled:bg-white disabled:text-warning/50",
    ghost:
      "bg-transparent text-warning enabled:hover:bg-warning/10 enabled:active:bg-warning/30 disabled:bg-transparent disabled:text-warning/50",
    preview: {
      filled: {
        hover: "bg-warning/80",
        active: "bg-warning",
      },
      outline: {
        hover: "bg-warning/10",
        active: "bg-warning/30",
      },
      ghost: {
        hover: "bg-warning/10",
        active: "bg-warning/30",
      },
    },
  },
};

const VARIANTS = {
  filled:
    "border-0 shadow-drop-s enabled:hover:shadow-inner-s enabled:active:shadow-inner-s disabled:shadow-none",
  outline:
    "border shadow-drop-s enabled:hover:shadow-inner-s enabled:active:shadow-inner-s disabled:shadow-none",
  ghost:
    "border-0 shadow-none enabled:hover:shadow-inner-s enabled:active:shadow-inner-s disabled:shadow-none",
};

const BASE_CLASSES = [
  "box-border inline-flex shrink-0 items-center justify-center",
  "h-[36px] gap-4 rounded-4xl",
  "font-primary text-label-2 font-normal whitespace-nowrap",
  "cursor-pointer disabled:cursor-not-allowed",
  "transition-all duration-200 motion-reduce:transition-none",
  "focus-visible:outline-none",
  "focus-visible:ring-4 focus-visible:ring-stroke",
  "focus-visible:ring-offset-2 focus-visible:ring-offset-white",
].join(" ");

const ICON_CLASSES =
  "inline-flex h-16 w-16 shrink-0 items-center justify-center";

const PREVIEW_STATUSES = new Set([
  "default",
  "hover",
  "active",
  "focus",
]);

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

function hasOwn(object, key) {
  return Object.prototype.hasOwnProperty.call(object, key);
}

/*
 * 所有 Tailwind 類別都是完整靜態字串。
 * 不使用 `bg-${intent}`，避免 Tailwind 掃描不到。
 */
function resolvePreviewClasses(
  classes,
  { fixed, replaceBackground = false, replaceShadow = false },
) {
  return classes
    .split(" ")
    .filter((token) => {
      if (!fixed) return true;

      if (
        token.startsWith("enabled:hover:") ||
        token.startsWith("enabled:active:")
      ) {
        return false;
      }

      if (replaceBackground && token.startsWith("bg-")) {
        return false;
      }

      if (replaceShadow && token.startsWith("shadow-")) {
        return false;
      }

      return true;
    })
    .join(" ");
}

function PlusIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="h-full w-full fill-none stroke-current"
      strokeWidth="1.333"
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M8 3.333v9.334M3.333 8h9.334" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="h-full w-full fill-none stroke-current"
      strokeWidth="1.333"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="m4 8.167 2.56 2.56L12 5.287" />
    </svg>
  );
}

function CloudIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="h-full w-full fill-none stroke-current"
      strokeWidth="1.333"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M4 12h7.333a2.667 2.667 0 0 0 .453-5.293A4 4 0 0 0 4 8a2 2 0 1 0 0 4Z" />
    </svg>
  );
}

const Button = forwardRef(function Button(
  {
    variant = "filled",
    intent = "primary",
    status,

    disabled = false,
    iconOnly = false,

    children = "Button",
    icon = <PlusIcon />,
    leftIcon = <CloudIcon />,
    rightIcon = <CheckIcon />,
    showLeftIcon = false,
    showRightIcon = false,

    type = "button",
    className = "",
    "aria-label": ariaLabel,
    ...nativeProps
  },
  ref,
) {
  const resolvedVariant = hasOwn(VARIANTS, variant)
    ? variant
    : "filled";

  const palette = hasOwn(INTENTS, intent)
    ? INTENTS[intent]
    : INTENTS.primary;

  const isDisabled = disabled || status === "disabled";

  if (
    iconOnly &&
    (typeof ariaLabel !== "string" || !ariaLabel.trim())
  ) {
    throw new Error(
      "純圖示 Button 必須提供非空白的 aria-label。",
    );
  }

  const previewState =
    !isDisabled && PREVIEW_STATUSES.has(status)
      ? status
      : undefined;

  const fixedPreview = previewState !== undefined;

  const previewBackground =
    palette.preview[resolvedVariant][previewState] ?? "";

  const previewShadow =
    previewState === "hover" || previewState === "active"
      ? "shadow-inner-s"
      : "";

  const previewFocus =
    previewState === "focus"
      ? "ring-4 ring-stroke ring-offset-2 ring-offset-white"
      : "";

  const colorClasses = resolvePreviewClasses(
    palette[resolvedVariant],
    {
      fixed: fixedPreview,
      replaceBackground: Boolean(previewBackground),
    },
  );

  const variantClasses = resolvePreviewClasses(
    VARIANTS[resolvedVariant],
    {
      fixed: fixedPreview,
      replaceShadow: Boolean(previewShadow),
    },
  );

  return (
    <button
      {...nativeProps}
      ref={ref}
      type={type}
      disabled={isDisabled}
      aria-label={ariaLabel}
      className={cx(
        BASE_CLASSES,
        iconOnly ? "w-[36px] p-0" : "px-12",
        variantClasses,
        colorClasses,
        previewBackground,
        previewShadow,
        previewFocus,
        className,
      )}
    >
      {iconOnly ? (
        <span className={ICON_CLASSES} aria-hidden="true">
          {icon}
        </span>
      ) : (
        <>
          {showLeftIcon && (
            <span className={ICON_CLASSES} aria-hidden="true">
              {leftIcon}
            </span>
          )}

          <span>{children}</span>

          {showRightIcon && (
            <span className={ICON_CLASSES} aria-hidden="true">
              {rightIcon}
            </span>
          )}
        </>
      )}
    </button>
  );
});

export { Button, PlusIcon, CheckIcon, CloudIcon };
export default Button;