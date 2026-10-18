import { forwardRef, useId, useState } from "react";

const STATES = {
  default: [
    "bg-transparent text-fontcolor",
    "hover:bg-white hover:bg-gradient-to-r",
    "hover:from-secondary/10 hover:to-secondary/10",
    "active:bg-white active:bg-gradient-to-r",
    "active:from-secondary/20 active:to-secondary/20",
  ].join(" "),

  hover:
    "bg-white bg-gradient-to-r from-secondary/10 to-secondary/10 text-fontcolor",

  selected:
    "bg-white bg-gradient-to-r from-primary/25 to-primary/25 text-primary",

  disabled: "bg-white text-fontcolor/60",
};

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

/* 背景透明，保留原設計的 user 圖示路徑。 */
export function UserIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="h-full w-full bg-transparent fill-current"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M10.4733 8.47338C11.1269 7.95915 11.604 7.25399 11.8382 6.456C12.0723 5.65802 12.0519 4.80689 11.7799 4.02102C11.5078 3.23516 10.9975 2.55364 10.32 2.07128C9.64259 1.58892 8.83163 1.32971 8 1.32971C7.16836 1.32971 6.35741 1.58892 5.67995 2.07128C5.0025 2.55364 4.49223 3.23516 4.22014 4.02102C3.94805 4.80689 3.92767 5.65802 4.16184 6.456C4.396 7.25399 4.87307 7.95915 5.52666 8.47338C4.40672 8.92207 3.42952 9.66628 2.69926 10.6267C1.969 11.587 1.51304 12.7276 1.38 13.9267C1.37037 14.0143 1.37808 14.1028 1.40268 14.1874C1.42729 14.272 1.46831 14.3509 1.52341 14.4196C1.63468 14.5584 1.79652 14.6473 1.97333 14.6667C2.15014 14.6862 2.32744 14.6346 2.46621 14.5233C2.60499 14.412 2.69388 14.2502 2.71333 14.0734C2.85972 12.7702 3.48112 11.5666 4.45881 10.6926C5.4365 9.81856 6.70193 9.3354 8.01333 9.3354C9.32473 9.3354 10.5902 9.81856 11.5679 10.6926C12.5455 11.5666 13.1669 12.7702 13.3133 14.0734C13.3315 14.2372 13.4096 14.3885 13.5327 14.4981C13.6559 14.6076 13.8152 14.6677 13.98 14.6667H14.0533C14.2281 14.6466 14.3878 14.5582 14.4977 14.4209C14.6076 14.2835 14.6587 14.1083 14.64 13.9334C14.5063 12.7308 14.0479 11.5874 13.3139 10.6255C12.5799 9.66366 11.5979 8.9197 10.4733 8.47338ZM8 8.00004C7.47258 8.00004 6.95701 7.84365 6.51848 7.55063C6.07995 7.25761 5.73815 6.84114 5.53632 6.35387C5.33449 5.8666 5.28168 5.33042 5.38457 4.81314C5.48746 4.29585 5.74144 3.8207 6.11438 3.44776C6.48732 3.07482 6.96247 2.82084 7.47976 2.71795C7.99704 2.61505 8.53322 2.66786 9.02049 2.8697C9.50776 3.07153 9.92423 3.41332 10.2173 3.85186C10.5103 4.29039 10.6667 4.80596 10.6667 5.33338C10.6667 6.04062 10.3857 6.7189 9.88562 7.21899C9.38552 7.71909 8.70724 8.00004 8 8.00004Z" />
    </svg>
  );
}

/* 背景透明，保留原設計的 layers 圖示路徑。 */
export function LayersIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="h-full w-full bg-transparent fill-current"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M1.66667 7.04001L7.66667 10.5067C7.76801 10.5652 7.88298 10.596 8 10.596C8.11702 10.596 8.23199 10.5652 8.33333 10.5067L14.3333 7.04001C14.4344 6.9814 14.5182 6.89729 14.5765 6.79608C14.6348 6.69488 14.6655 6.58013 14.6655 6.46334C14.6655 6.34655 14.6348 6.2318 14.5765 6.1306C14.5182 6.02939 14.4344 5.94528 14.3333 5.88667L8.33333 2.42001C8.23199 2.36149 8.11702 2.33069 8 2.33069C7.88298 2.33069 7.76801 2.36149 7.66667 2.42001L1.66667 5.88667C1.56564 5.94528 1.48178 6.02939 1.42349 6.1306C1.3652 6.2318 1.33451 6.34655 1.33451 6.46334C1.33451 6.58013 1.3652 6.69488 1.42349 6.79608C1.48178 6.89729 1.56564 6.9814 1.66667 7.04001ZM8 3.76667L12.6667 6.43334L8 9.13334L3.33333 6.46L8 3.76667ZM13.6667 8.96L8 12.2333L2.33333 8.96C2.25764 8.91565 2.17394 8.88667 2.08703 8.87473C2.00011 8.86279 1.9117 8.86812 1.82685 8.89041C1.742 8.91271 1.66238 8.95153 1.59257 9.00466C1.52275 9.05779 1.46411 9.12417 1.42 9.20001C1.37592 9.27609 1.34733 9.36015 1.33587 9.44734C1.32442 9.53452 1.33032 9.62311 1.35325 9.70801C1.37618 9.7929 1.41567 9.87242 1.46946 9.94199C1.52325 10.0115 1.59027 10.0698 1.66667 10.1133L7.66667 13.58C7.76801 13.6385 7.88298 13.6693 8 13.6693C8.11702 13.6693 8.23199 13.6385 8.33333 13.58L14.3333 10.1133C14.4097 10.0698 14.4767 10.0115 14.5305 9.94199C14.5843 9.87242 14.6238 9.7929 14.6467 9.70801C14.6697 9.62311 14.6756 9.53452 14.6641 9.44734C14.6527 9.36015 14.6241 9.27609 14.58 9.20001C14.5359 9.12417 14.4772 9.05779 14.4074 9.00466C14.3376 8.95153 14.258 8.91271 14.1732 8.89041C14.0883 8.86812 13.9999 8.86279 13.913 8.87473C13.8261 8.88667 13.7424 8.91565 13.6667 8.96Z" />
    </svg>
  );
}

function ChevronIcon({ expanded }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={cx(
        "h-16 w-16 bg-transparent fill-none stroke-current stroke-2",
        "transition-transform duration-200 motion-reduce:transition-none",
        expanded && "rotate-90",
      )}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="m6 4 4 4-4 4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="h-16 w-16 bg-transparent fill-none stroke-current stroke-2"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="m4 8 3 3 5-6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const ListItem = forwardRef(function ListItem(
  {
    as: Component = "li",
    children = "List Item",

    description = "This is an item description.",
    showDescription = false,

    showLeftIcon = false,
    leftIcon = <UserIcon />,

    showRightIcon = false,
    rightIcon = <LayersIcon />,

    showAvatar = false,
    avatar,
    avatarSrc,

    showSuffix = false,
    suffix = "Text",

    showCheckbox = false,
    checked,
    defaultChecked,
    onCheckedChange,

    selected,
    defaultSelected = false,
    onSelectedChange,

    disabled = false,
    status,

    showCollapse = false,
    expanded,
    defaultExpanded = false,
    onExpandedChange,
    collapseLabel = "展開或收合項目",
    collapseTargetId,

    onClick,
    className = "",
    ...liProps
  },
  ref,
) {
  const id = useId();
  const titleId = `${id}-title`;
  const descriptionId = `${id}-description`;

  const [internalChecked, setInternalChecked] = useState(
    defaultChecked ?? defaultSelected,
  );

  const [internalSelected, setInternalSelected] =
    useState(defaultSelected);

  const [internalExpanded, setInternalExpanded] =
    useState(defaultExpanded);

  const isDisabled = disabled || status === "disabled";

  const isChecked = Boolean(
    checked ??
      selected ??
      (status === "selected" ? true : internalChecked),
  );

  const isExpanded = Boolean(expanded ?? internalExpanded);

  /*
   * 左側已有 icon、avatar 或展開箭頭時，checkbox 放右側。
   * 否則 checkbox 預設放左側。
   */
  const hasLeftContent =
    showLeftIcon || showAvatar || showCollapse;

  const checkboxOnLeft = showCheckbox && !hasLeftContent;
  const checkboxOnRight = showCheckbox && hasLeftContent;

  /*
   * 展開模式：整列選取樣式由展開狀態決定。
   * 非展開模式：保留原有選取與勾選判斷。
   */
  const isSelected = showCollapse
    ? isExpanded
    : Boolean(
        selected ??
          (status === "selected" ||
            (showCheckbox ? isChecked : internalSelected)),
      );

  const visibleDescription =
    showDescription &&
    description != null &&
    description !== "";

  /*
   * 收起後回到 default；
   * 滑鼠仍在整列上時，自動套用 default 裡的 hover 樣式。
   */
  const state = isDisabled
    ? "disabled"
    : isSelected
      ? "selected"
      : status === "hover"
        ? "hover"
        : "default";

  const iconClass = cx(
    "inline-flex h-16 w-16 shrink-0 items-center justify-center bg-transparent",
    isDisabled ? "text-primary/60" : "text-primary",
  );

  function changeSelection(next, event) {
    if (isDisabled) return;

    if (selected === undefined) {
      setInternalSelected(next);
    }

    onSelectedChange?.(next, event);
  }

  function changeChecked(next, event) {
    if (isDisabled) return;

    if (checked === undefined && selected === undefined) {
      setInternalChecked(next);
    }

    onCheckedChange?.(next, event);
    changeSelection(next, event);
  }

  function toggleCollapse(event) {
    if (isDisabled) return;

    const next = !isExpanded;

    if (expanded === undefined) {
      setInternalExpanded(next);
    }

    // 展開時選取，收起時取消選取，並通知父層。
    changeSelection(next, event);

    onExpandedChange?.(next, event);
  }

  function handleClick(event) {
    if (isDisabled) return;

    onClick?.(event);

    if (event.defaultPrevented) return;

    // 展開模式：點擊整列切換展開。
    if (showCollapse) {
      toggleCollapse(event);
    }

    // 勾選框模式：點擊整列切換勾選。
    if (showCheckbox) {
      changeChecked(!isChecked, event);
    } else if (!showCollapse) {
      // 一般模式：切換選取。
      changeSelection(!isSelected, event);
    }
  }

  // 左右共用同一份 checkbox，實際只渲染其中一側。
  const checkboxElement = showCheckbox ? (
    <span className="relative inline-flex h-16 w-16 shrink-0 items-center justify-center bg-transparent">
      <input
        type="checkbox"
        checked={isChecked}
        disabled={isDisabled}
        aria-labelledby={titleId}
        aria-describedby={
          visibleDescription ? descriptionId : undefined
        }
        onClick={(event) => event.stopPropagation()}
        onChange={(event) =>
          changeChecked(event.target.checked, event)
        }
        className={cx(
          "m-0 h-16 w-16 cursor-pointer appearance-none",
          "rounded-sm border-[1.5px] border-primary bg-transparent",
          "checked:bg-primary",
          "transition-all duration-200 motion-reduce:transition-none",
          "focus:outline-none",
          "disabled:cursor-not-allowed",
          "disabled:border-primary/60",
          "disabled:checked:bg-primary/60",
        )}
      />

      {isChecked && (
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-transparent text-white">
          <CheckIcon />
        </span>
      )}
    </span>
  ) : null;

  return (
    <Component
      {...liProps}
      ref={ref}
      onClick={handleClick}
      className={cx(
        "box-border flex min-h-40 h-auto w-full list-none items-center",
        "gap-8 rounded-3xl px-12 py-4 font-primary",
        "transition-all duration-200 motion-reduce:transition-none",

        // 只在子控制項具有鍵盤焦點時顯示整列外框（使用 ring-inset 避免被外層 overflow 容器邊界裁切）。
        "has-[:focus-visible]:ring-2",
        "has-[:focus-visible]:ring-inset",
        "has-[:focus-visible]:ring-stroke",

        isSelected ? "font-bold" : "font-normal",
        STATES[state],
        isDisabled ? "cursor-not-allowed" : "cursor-pointer",
        className,
      )}
    >
      {checkboxOnLeft && checkboxElement}

      {showCollapse && (
        <span
          aria-hidden="true"
          className={cx(
            "inline-flex h-16 w-16 shrink-0 items-center justify-center",
            "bg-transparent p-0 text-inherit pointer-events-none",
            isDisabled && "opacity-50",
          )}
        >
          <ChevronIcon expanded={isExpanded} />
        </span>
      )}

      <button
        type="button"
        disabled={isDisabled}
        aria-label={showCollapse ? collapseLabel : undefined}
        aria-expanded={showCollapse ? isExpanded : undefined}
        aria-controls={
          showCollapse ? collapseTargetId : undefined
        }
        aria-pressed={showCollapse ? undefined : isSelected}
        aria-labelledby={titleId}
        aria-describedby={
          visibleDescription ? descriptionId : undefined
        }
        className={cx(
          "flex min-w-0 flex-1 items-center gap-8",
          "rounded-sm border-0 bg-transparent p-0",
          "text-left font-primary text-inherit",
          "focus:outline-none",
          "disabled:cursor-not-allowed",
        )}
      >
        {showAvatar && (
          <span
            className={cx(
              "inline-flex h-24 w-24 shrink-0 items-center justify-center",
              "overflow-hidden rounded-full bg-transparent text-primary",
              isDisabled && "opacity-60",
            )}
            aria-hidden="true"
          >
            {avatar ??
              (avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt=""
                  className="h-full w-full rounded-full object-cover object-center bg-transparent"
                />
              ) : (
                <span className="inline-flex h-16 w-16 bg-transparent items-center justify-center">
                  <UserIcon />
                </span>
              ))}
          </span>
        )}

        {showLeftIcon && (
          <span className={iconClass} aria-hidden="true">
            {leftIcon}
          </span>
        )}

        <span className="flex min-w-0 flex-1 flex-col gap-4">
          <span
            id={titleId}
            className={cx(
              "block truncate text-[15px] leading-[20px]",
              isSelected ? "font-bold [&_*]:font-bold" : "font-normal",
            )}
          >
            {children}
          </span>

          {visibleDescription && (
            <span
              id={descriptionId}
              className={cx(
                "block break-words text-caption-2 font-normal",
                isDisabled
                  ? "text-fontcolor/60"
                  : "text-description",
              )}
            >
              {description}
            </span>
          )}
        </span>
      </button>

      {showSuffix && (
        <span
          className={cx(
            "shrink-0 text-label-1",
            isSelected ? "font-bold" : "font-normal",
          )}
        >
          {suffix}
        </span>
      )}

      {showRightIcon && (
        <span className={iconClass} aria-hidden="true">
          {rightIcon}
        </span>
      )}

      {checkboxOnRight && checkboxElement}
    </Component>
  );
});

export default ListItem;
export { ListItem };
