import { forwardRef, useEffect, useId, useState, useRef } from "react";

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

/* 關閉叉叉圖示 (24x24 viewBox, 1.5 stroke) */
function CloseIcon({ className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cx("h-16 w-16 bg-transparent", className)}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

/**
 * Drawer 抽屜 / 側欄面板元件
 *
 * 設計規範：
 * - 圓角：固定 22px (rounded-4xl / rounded-[22px])
 * - 背景：bg-white
 * - 邊框：border border-stroke
 * - 陰影：shadow-drop-s
 * - 內距：預設 p-16 (16px)
 * - 支援面板模式 (panel，預設) 與浮動覆蓋模式 (overlay)
 */
export const Drawer = forwardRef(function Drawer(
  {
    as: Component = "aside",
    children,
    className = "",
    title,
    description,
    showClose = false,
    showDivider = false,
    onClose,
    closeAriaLabel = "關閉面板",
    variant = "panel", // "panel" (版面側欄) | "overlay" (彈出抽屜)
    isOpen = true,
    placement = "right", // "right" | "left"
    header,
    footer,
    style,
    "data-component": dataComponent = "Drawer",
    "aria-label": ariaLabel,
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const titleId = `${generatedId}-drawer-title`;
  const descId = `${generatedId}-drawer-desc`;

  // 管理 Overlay 抽屜進出場動畫生命週期 (進場 slideIn 320ms, 退場 slideOut 320ms 柔和慢速滑出)
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isClosing, setIsClosing] = useState(false);
  const closeTimerRef = useRef(null);

  useEffect(() => {
    if (variant !== "overlay") return;

    if (isOpen) {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
      setShouldRender(true);
      setIsClosing(false);
    } else if (shouldRender) {
      if (!closeTimerRef.current) {
        setIsClosing(true);
        closeTimerRef.current = setTimeout(() => {
          setShouldRender(false);
          setIsClosing(false);
          closeTimerRef.current = null;
        }, 320);
      }
    }
  }, [isOpen, variant, shouldRender]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  // 處理 ESC 鍵關閉 (僅在 overlay 模式且開啟且未正在關閉時生效)
  useEffect(() => {
    if (variant !== "overlay" || !isOpen || isClosing) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [variant, isOpen, isClosing, onClose]);

  if (variant === "overlay" && !shouldRender) {
    return null;
  }

  const baseClasses = cx(
    "box-border flex min-h-0 flex-col gap-16",
    "rounded-[22px] rounded-4xl bg-white p-16",
    "border border-stroke shadow-drop-s",
    "font-primary text-fontcolor text-left select-none",
  );

  const content = (
    <Component
      {...props}
      ref={ref}
      onClick={(e) => {
        e.stopPropagation();
        props.onClick?.(e);
      }}
      data-component={dataComponent}
      aria-label={ariaLabel || (typeof title === "string" ? title : undefined)}
      aria-labelledby={title ? titleId : undefined}
      aria-describedby={description ? descId : undefined}
      style={style}
      className={cx(
        baseClasses,
        variant === "overlay" && [
          "fixed top-[16px] bottom-[16px] z-50 shadow-drop-l max-h-[calc(100vh-32px)]",
          isClosing
            ? placement === "right"
              ? "right-[16px] animate-drawer-out-right pointer-events-none"
              : "left-[16px] animate-drawer-out-left pointer-events-none"
            : placement === "right"
              ? "right-[16px] animate-drawer-in-right"
              : "left-[16px] animate-drawer-in-left",
        ],
        className,
      )}
    >
      {/* 標題與標頭區塊 */}
      {(header || title || showClose) && (
        <header
          className={cx(
            "flex shrink-0 items-center justify-between gap-8",
            showDivider && "pb-12 border-b border-stroke",
          )}
        >
          {header ? (
            header
          ) : (
            <div className="flex min-w-0 flex-1 flex-col">
              {title && (
                <h2
                  id={titleId}
                  className="m-0 truncate font-primary text-[17px] font-semibold leading-[22px] text-fontcolor"
                >
                  {title}
                </h2>
              )}
              {description && (
                <p
                  id={descId}
                  className="m-0 text-caption-2 text-description leading-normal"
                >
                  {description}
                </p>
              )}
            </div>
          )}

          {showClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label={closeAriaLabel}
              className={cx(
                "box-border inline-flex h-[36px] w-[36px] shrink-0 items-center justify-center",
                "rounded-full bg-transparent text-primary",
                "border-0 cursor-pointer transition-colors duration-150",
                "hover:bg-primary/10 active:bg-primary/20",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
              )}
            >
              <CloseIcon />
            </button>
          )}
        </header>
      )}

      {/* 內容主體 */}
      {children}

      {/* 底部功能區 (可選) */}
      {footer && (
        <footer className="mt-auto flex shrink-0 items-center justify-end gap-8 pt-8 border-t border-stroke/60">
          {footer}
        </footer>
      )}
    </Component>
  );

  // Overlay 浮層抽屜模式：渲染半透明背景遮罩
  if (variant === "overlay") {
    return (
      <div
        role="presentation"
        onClick={isClosing ? undefined : onClose}
        className={cx(
          "fixed inset-0 z-40 bg-black/40 backdrop-blur-[3px] transition-opacity",
          isClosing
            ? "animate-drawer-backdrop-out pointer-events-none"
            : "animate-drawer-backdrop",
        )}
      >
        {content}
      </div>
    );
  }

  return content;
});

export default Drawer;

