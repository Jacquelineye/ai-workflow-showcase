import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

const STATES = {
  default:
    "bg-transparent text-fontcolor font-normal shadow-none",

  hover:
    "bg-white bg-gradient-to-r from-primary/20 to-primary/20 text-fontcolor font-normal shadow-none",

  focus:
    "bg-white text-fontcolor font-normal shadow-none ring-4 ring-stroke/60",

  selected:
    "bg-primary text-white font-medium shadow-inner-s",
};

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

/* 預設左側圖示，背景透明。 */
export function SpinnerIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      strokeWidth="1.333"
      className="h-full w-full bg-transparent fill-none stroke-current"
      aria-hidden="true"
      focusable="false"
    >
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300].map(
        (angle) => (
          <path
            key={angle}
            d="M8 2v1.333"
            transform={`rotate(${angle} 8 8)`}
            strokeLinecap="round"
          />
        ),
      )}
    </svg>
  );
}

export function CloseIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      strokeWidth="1.333"
      className="h-full w-full bg-transparent fill-none stroke-current"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="m3.333 3.333 9.334 9.334m0-9.334-9.334 9.334"
        strokeLinecap="round"
      />
    </svg>
  );
}

/*
 * 單一分頁外觀。
 *
 * status 僅用於展示：
 * "default" | "hover" | "focus" | "selected"
 *
 * 一般使用建議由下方 Tabs 管理選取與鍵盤操作。
 */
export const Tab = forwardRef(function Tab(
  {
    children = "Tab",
    selected = false,
    disabled = false,

    showLeftIcon = false,
    leftIcon = <SpinnerIcon />,
    showText = true,

    showClose = false,
    onClose,
    closeLabel = "關閉分頁",

    onSelect,
    onClick,
    onKeyDown,
    status,

    id,
    panelId,
    tabIndex = 0,
    className = "",
    title,
    "aria-label": ariaLabel,
    ...buttonProps
  },
  ref,
) {
  const isSelected = selected || status === "selected";
  const shouldShowText =
    showText && children !== null && children !== false && children !== "";

  const state = isSelected
    ? "selected"
    : status === "hover"
      ? "hover"
      : status === "focus"
        ? "focus"
        : "default";

  return (
    <div
      role="presentation"
      className={cx(
        "inline-flex h-[36px] shrink-0 items-center justify-center",
        shouldShowText ? "gap-[4px]" : "w-[36px]",
        "rounded-4xl font-primary text-label-2",
        "transition-all duration-200 motion-reduce:transition-none",

        // 滑鼠點擊不留下焦點外框。
        "has-[:focus-visible]:ring-4",
        "has-[:focus-visible]:ring-stroke/60",

        STATES[state],
        showClose && "pr-12",
        disabled && "opacity-50",

        !disabled &&
          !isSelected &&
          !status &&
          [
            "hover:bg-white hover:bg-gradient-to-r",
            "hover:from-primary/20 hover:to-primary/20",
            "hover:shadow-none",
            "has-[:focus-visible]:bg-white",
            "has-[:focus-visible]:bg-none",
            "has-[:focus-visible]:shadow-none",
          ].join(" "),

        className,
      )}
    >
      <button
        {...buttonProps}
        ref={ref}
        id={id}
        type="button"
        role="tab"
        title={title}
        aria-label={
          ariaLabel ||
          (!shouldShowText && typeof children === "string" ? children : undefined)
        }
        disabled={disabled}
        aria-selected={isSelected}
        aria-controls={panelId}
        tabIndex={disabled ? -1 : tabIndex}
        onClick={(event) => {
          if (disabled) return;

          onClick?.(event);

          if (!event.defaultPrevented) {
            onSelect?.(event);
          }
        }}
        onKeyDown={(event) => {
          onKeyDown?.(event);

          if (
            !event.defaultPrevented &&
            !disabled &&
            event.key === "Delete" &&
            showClose &&
            onClose
          ) {
            onClose(event);
            event.preventDefault();
            event.stopPropagation();
          }
        }}
        className={cx(
          "inline-flex h-[36px] w-full items-center justify-center",
          shouldShowText ? "gap-[4px] py-2" : "w-[36px] p-0",
          "rounded-4xl border-0 bg-transparent",
          "text-inherit font-primary text-label-2",
          "focus:outline-none disabled:cursor-not-allowed",

          isSelected ? "font-medium" : "font-normal",

          showClose ? "pl-12 pr-0" : shouldShowText ? "px-8" : "px-0",
        )}
      >
        {showLeftIcon && (
          <span
            className="inline-flex h-16 w-16 shrink-0 items-center justify-center bg-transparent"
            aria-hidden="true"
          >
            {leftIcon}
          </span>
        )}

        {shouldShowText && <span className="whitespace-nowrap">{children}</span>}
      </button>

      {/* 關閉按鈕與 Tab 是同層，不嵌套 button。 */}
      {showClose && (
        <button
          type="button"
          disabled={disabled || !onClose}
          aria-label={closeLabel}
          tabIndex={-1}
          onClick={(event) => {
            event.stopPropagation();

            if (!disabled) {
              onClose?.(event);
            }
          }}
          className={cx(
            "inline-flex h-16 w-16 shrink-0 items-center justify-center",
            "rounded-full border-0 bg-transparent p-0 text-inherit",
            "transition-all duration-200 motion-reduce:transition-none",
            "enabled:hover:bg-black/10",
            "focus:outline-none disabled:cursor-not-allowed",
          )}
        >
          <CloseIcon />
        </button>
      )}
    </div>
  );
});

/*
 * 完整分頁群組。
 *
 * items:
 * [{
 *   value: "overview",          // 唯一且非空白的字串
 *   label: "總覽",
 *   content: <YourContent />,
 *   disabled: false,
 *   showLeftIcon: false,
 *   leftIcon: <YourIcon />,
 *   showClose: false,
 *   closeLabel: "關閉總覽分頁"
 * }]
 *
 * value + onValueChange：受控模式
 * defaultValue：非受控模式的初始分頁
 *
 * onClose(value, event)：由父元件移除對應的 item。
 */
const Tabs = forwardRef(function Tabs(
  {
    items = [],
    value,
    defaultValue,
    onValueChange,
    onClose,

    ariaLabel = "分頁",
    className = "",
    panelClassName = "",
  },
  ref,
) {
  const baseId = useId();
  const tabRefs = useRef(new Map());
  const pendingFocus = useRef(null);
  const [focusTick, requestFocus] = useState(0);

  const seen = new Set();

  for (const item of items) {
    if (
      typeof item.value !== "string" ||
      !item.value.trim() ||
      seen.has(item.value)
    ) {
      throw new Error(
        "每個分頁的 value 必須是唯一、非空白的字串。",
      );
    }

    seen.add(item.value);
  }

  const enabledItems = items.filter((item) => !item.disabled);

  const [internalValue, setInternalValue] = useState(
    defaultValue ?? enabledItems[0]?.value ?? null,
  );

  const requestedValue =
    value === undefined ? internalValue : value;

  const activeValue = enabledItems.some(
    (item) => item.value === requestedValue,
  )
    ? requestedValue
    : enabledItems[0]?.value ?? null;

  // 關閉分頁後，等待內容更新，再移動鍵盤焦點。
  useEffect(() => {
    const target = pendingFocus.current;
    pendingFocus.current = null;

    if (target !== null) {
      tabRefs.current.get(target)?.focus();
    }
  }, [items, activeValue, focusTick]);

  function changeValue(next, event) {
    if (next === activeValue) return;

    if (value === undefined) {
      setInternalValue(next);
    }

    onValueChange?.(next, event);
  }

  function handleKeyDown(event) {
    if (event.defaultPrevented) return;

    const button = event.target.closest('[role="tab"]');

    if (!button || !enabledItems.length) return;

    const current = enabledItems.findIndex(
      (item) => item.value === button.dataset.value,
    );

    if (current < 0) return;

    let next;

    if (event.key === "ArrowRight") {
      next = (current + 1) % enabledItems.length;
    } else if (event.key === "ArrowLeft") {
      next =
        (current - 1 + enabledItems.length) %
        enabledItems.length;
    } else if (event.key === "Home") {
      next = 0;
    } else if (event.key === "End") {
      next = enabledItems.length - 1;
    } else {
      return;
    }

    event.preventDefault();

    const nextValue = enabledItems[next].value;

    changeValue(nextValue, event);
    tabRefs.current.get(nextValue)?.focus();
  }

  function closeTab(item, event) {
    if (!onClose) return;

    const index = enabledItems.findIndex(
      (tab) => tab.value === item.value,
    );

    const next =
      enabledItems[index + 1]?.value ??
      enabledItems[index - 1]?.value ??
      null;

    onClose(item.value, event);

    // 父元件可透過 preventDefault 取消後續切換。
    if (event.defaultPrevented) return;

    if (activeValue === item.value) {
      changeValue(next, event);
      pendingFocus.current = next;
    } else {
      pendingFocus.current = activeValue;
    }

    requestFocus((tick) => tick + 1);
  }

  return (
    <>
      <div
        ref={ref}
        role="tablist"
        aria-label={ariaLabel}
        aria-orientation="horizontal"
        onKeyDown={handleKeyDown}
        className={cx(
          "flex h-[36px] items-center gap-8",
          className,
        )}
      >
        {items.map((item, index) => (
          <Tab
            key={item.value}
            ref={(node) => {
              if (node) {
                tabRefs.current.set(item.value, node);
              } else {
                tabRefs.current.delete(item.value);
              }
            }}
            id={`${baseId}-tab-${index}`}
            panelId={`${baseId}-panel-${index}`}
            data-value={item.value}
            selected={item.value === activeValue}
            disabled={Boolean(item.disabled)}
            tabIndex={item.value === activeValue ? 0 : -1}
            showLeftIcon={Boolean(item.showLeftIcon)}
            leftIcon={item.leftIcon}
            showClose={Boolean(item.showClose)}
            closeLabel={
              item.closeLabel ??
              (typeof item.label === "string"
                ? `關閉 ${item.label} 分頁`
                : "關閉分頁")
            }
            onSelect={(event) =>
              changeValue(item.value, event)
            }
            onClose={
              onClose
                ? (event) => closeTab(item, event)
                : undefined
            }
          >
            {item.label}
          </Tab>
        ))}
      </div>

      {items.map((item, index) => (
        <div
          key={item.value}
          id={`${baseId}-panel-${index}`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${index}`}
          hidden={item.value !== activeValue}
          tabIndex={0}
          className={cx(
            "mt-12 rounded-md",
            "font-primary text-body-2 text-fontcolor",
            "focus:outline-none",
            "focus-visible:ring-2 focus-visible:ring-stroke",
            item.value !== activeValue && "hidden",
            panelClassName,
          )}
        >
          {item.content}
        </div>
      ))}
    </>
  );
});

export default Tabs;
export { Tabs };

/* 可直接渲染的使用範例。 */
export function TabsExample() {
  const [items, setItems] = useState([
    {
      value: "overview",
      label: "總覽",
      content: <p>這是總覽內容。</p>,
    },
    {
      value: "details",
      label: "詳細資料",
      showLeftIcon: true,
      showClose: true,
      content: <p>這是詳細資料內容。</p>,
    },
    {
      value: "settings",
      label: "設定",
      content: <p>這是設定內容。</p>,
    },
  ]);

  return (
    <Tabs
      items={items}
      defaultValue="overview"
      ariaLabel="資訊分頁"
      onClose={(closedValue) => {
        setItems((previous) =>
          previous.filter(
            (item) => item.value !== closedValue,
          ),
        );
      }}
    />
  );
}

