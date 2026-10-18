import { forwardRef, useRef, useEffect, useState } from "react";

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

const CATEGORY_STYLES = {
  trigger: {
    badge: "bg-primary/15 text-primary border-primary/20",
    iconBg: "bg-primary/10 text-primary",
    label: "觸發器",
  },
  data: {
    badge: "bg-secondary/15 text-secondary border-secondary/20",
    iconBg: "bg-secondary/10 text-secondary",
    label: "資料來源",
  },
  ai: {
    badge: "bg-indigo-50 text-indigo-600 border-indigo-200",
    iconBg: "bg-indigo-100/80 text-indigo-600",
    label: "AI 智能運算",
  },
  branch: {
    badge: "bg-warning/15 text-warning border-warning/20",
    iconBg: "bg-warning/10 text-warning",
    label: "條件分流",
  },
  action: {
    badge: "bg-success/15 text-success border-success/20",
    iconBg: "bg-success/10 text-success",
    label: "動作輸出",
  },
};

const STATUS_CONFIG = {
  success: {
    dot: "bg-success",
    text: "執行成功",
    bg: "bg-success/10 text-success",
  },
  running: {
    dot: "bg-primary animate-pulse",
    text: "處理中",
    bg: "bg-primary/10 text-primary",
  },
  idle: {
    dot: "bg-description",
    text: "待命",
    bg: "bg-bg text-description",
  },
  warning: {
    dot: "bg-warning",
    text: "需注意",
    bg: "bg-warning/10 text-warning",
  },
  error: {
    dot: "bg-error",
    text: "錯誤",
    bg: "bg-error/10 text-error",
  },
};

const CARD_PORTS = [
  {
    name: "top",
    label: "上方端點",
    className: "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2",
  },
  {
    name: "bottom",
    label: "下方端點",
    className: "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2",
  },
  {
    name: "left",
    label: "左側端點",
    className: "left-0 top-1/2 -translate-x-1/2 -translate-y-1/2",
  },
  {
    name: "right",
    label: "右側端點",
    className: "right-0 top-1/2 translate-x-1/2 -translate-y-1/2",
  },
];

export const WorkflowNode = forwardRef(function WorkflowNode(
  {
    id,
    title = "未命名節點",
    name = "",
    itemTitle = "",
    subtitle = "",
    category = "trigger",
    icon,
    status = "idle",
    duration = "",
    recordCount = "",
    selected = false,
    mode = "edit",
    comment,
    disabled = false,
    validation = null,
    onClick,
    onPortMouseDown,
    onPortMouseEnter,
    onPortMouseLeave,
    onPortMouseUp,
    onSizeChange,
    hoveredPort,
    isConnecting = false,
    isDraggingCard = false,
    connectedPorts = [],
    canConnect = true,
    className = "",
    style = {},
  },
  forwardedRef,
) {
  const catStyle = CATEGORY_STYLES[category] ?? CATEGORY_STYLES.trigger;
  const statusInfo = STATUS_CONFIG[status] ?? STATUS_CONFIG.idle;
  const isError = mode === "edit" && !disabled && validation?.status === "error";
  const isWarning = mode === "edit" && !disabled && validation?.status === "warning";

  const [isCardHovered, setIsCardHovered] = useState(false);
  const innerRef = useRef(null);

  // 測量卡片實際尺寸並即時回報給畫布，確保連接線端點精確無誤
  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;

    const reportSize = () => {
      if (el) {
        onSizeChange?.(id, el.offsetWidth, el.offsetHeight);
      }
    };

    reportSize();

    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver(() => {
        reportSize();
      });
      ro.observe(el);
      return () => ro.disconnect();
    }
  }, [id, onSizeChange, comment, mode, title, name, itemTitle, subtitle, isError, isWarning, validation?.message]);

  const setRefs = (node) => {
    innerRef.current = node;
    if (typeof forwardedRef === "function") {
      forwardedRef(node);
    } else if (forwardedRef) {
      forwardedRef.current = node;
    }
  };

  return (
    <div
      ref={setRefs}
      id={`node-${id}`}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onMouseEnter={() => {
        if (!isDraggingCard) setIsCardHovered(true);
      }}
      onMouseLeave={() => {
        setIsCardHovered(false);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.(e);
        }
      }}
      style={style}
      className={cx(
        "group relative select-none rounded-2xl p-16 transition-all duration-200 box-border",
        "w-[280px] cursor-inherit text-left font-primary",
        "border",
        disabled
          ? "bg-[#F8FAFC] border-dashed border-slate-300 shadow-sm"
          : isError
          ? "bg-white border-error ring-2 ring-error/30 shadow-[0_0_12px_rgba(239,68,68,0.18)]"
          : isWarning
          ? "bg-white border-warning/80 ring-1 ring-warning/30 shadow-drop-s"
          : "bg-white border-stroke/70 shadow-drop-s",
        selected
          ? disabled
            ? "border-slate-400 ring-2 ring-slate-400/80 ring-offset-2 ring-offset-bg shadow-drop-s"
            : isError
            ? "border-error ring-4 ring-error/40 ring-offset-2 ring-offset-white shadow-[0_0_16px_rgba(239,68,68,0.25)]"
            : isWarning
            ? "border-warning ring-3 ring-warning/40 ring-offset-2 ring-offset-white shadow-drop-s"
            : "border-primary ring-2 ring-primary ring-offset-2 ring-offset-bg shadow-drop-s"
          : disabled
            ? "hover:border-slate-400"
            : isError
            ? "hover:border-error hover:ring-3 hover:ring-error/40 hover:shadow-drop-m"
            : isWarning
            ? "hover:border-warning hover:ring-2 hover:ring-warning/40 hover:shadow-drop-m"
            : "hover:border-primary/60 hover:shadow-drop-s",
        className,
      )}
    >
      {/* 頂部類別標籤與狀態：badge 內容來源為項目標題 */}
      <div className="flex items-center justify-between gap-8 mb-8">
        <span
          className={cx(
            "inline-flex items-center px-8 py-2 rounded-full text-caption-1 font-medium border",
            disabled ? "bg-slate-100 text-slate-600 border-slate-200" : catStyle.badge,
          )}
        >
          {itemTitle || catStyle.label}
        </span>

        {/* 執行紀錄模式或停用狀態或驗證警示狀態 */}
        {disabled ? (
          <span className="inline-flex items-center gap-4 px-6 py-1 rounded-full text-caption-2 font-medium bg-slate-200 text-slate-700 border border-slate-300 shadow-xs">
            <span className="h-4 w-4 rounded-full bg-slate-500 shrink-0" />
            <span>已停用</span>
          </span>
        ) : mode === "history" ? (
          <span
            className={cx(
              "inline-flex items-center gap-4 px-8 py-2 rounded-full text-caption-2 font-medium",
              statusInfo.bg,
            )}
          >
            <span
              className={cx("h-6 w-6 rounded-full shrink-0", statusInfo.dot)}
            />
            <span>{statusInfo.text}</span>
          </span>
        ) : isError ? (
          <span
            title={validation.message}
            className="inline-flex items-center gap-4 px-8 py-2 rounded-full text-caption-2 font-semibold bg-error/15 text-error border border-error/30 shadow-xs animate-in fade-in duration-200"
          >
            <span className="h-6 w-6 rounded-full bg-error shrink-0 animate-ping" />
            <span>{validation.badgeText || (validation.blocking ? "無法進行流程" : "內容錯誤")}</span>
          </span>
        ) : isWarning ? (
          <span
            title={validation.message}
            className="inline-flex items-center gap-4 px-8 py-2 rounded-full text-caption-2 font-medium bg-warning/15 text-[#B45309] border border-warning/30 shadow-xs animate-in fade-in duration-200"
          >
            <span className="h-6 w-6 rounded-full bg-warning shrink-0" />
            <span>{validation.badgeText || "尚未填寫完整"}</span>
          </span>
        ) : null}
      </div>

      {/* 主體：圖示與節點名稱 */}
      <div className="flex items-start gap-12">
        <div
          className={cx(
            "flex h-40 w-40 shrink-0 items-center justify-center rounded-xl",
            disabled ? "bg-slate-200/70 text-slate-500" : catStyle.iconBg,
          )}
        >
          {icon}
        </div>

        <div className="min-w-0 flex-1">
          <h3
            className={cx(
              "m-0 truncate text-label-2 font-medium transition-colors",
              disabled
                ? "text-slate-700 group-hover:text-slate-900"
                : isError
                ? "text-fontcolor group-hover:text-error"
                : isWarning
                ? "text-fontcolor group-hover:text-warning"
                : "text-fontcolor group-hover:text-primary",
            )}
          >
            {name || title}
          </h3>
          {subtitle && (
            <p className="m-0 mt-2 line-clamp-2 text-caption-1 text-description leading-snug">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* 編輯模式下的錯誤或未填寫提示說明 */}
      {mode === "edit" && !disabled && (isError || isWarning) && validation?.message && (
        <div
          title={validation.message}
          className={cx(
            "mt-10 flex items-center gap-6 rounded-lg px-8 py-5 text-[11px] font-medium leading-tight border transition-all select-none",
            isError
              ? "bg-[#FEF2F2] border-[#FEE2E2] text-error"
              : "bg-[#FFFBEB] border-[#FEF3C7] text-[#B45309]",
          )}
        >
          <svg className="w-12 h-12 shrink-0" viewBox="0 0 16 16" fill="none">
            {isError ? (
              <>
                <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3" />
                <path d="M8 5v3.5M8 11h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </>
            ) : (
              <path
                d="M8 3.5 1.5 14h13L8 3.5ZM8 7v3.5M8 12.5h.01"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
          </svg>
          <span className="truncate">{validation.message}</span>
        </div>
      )}

      {/* 底部數據與統計（執行紀錄或註解展示） */}
      {mode === "history" && (duration || recordCount) && (
        <div className="mt-12 flex items-center justify-between border-t border-stroke/40 pt-8 text-caption-2 text-description">
          {duration && (
            <span className="flex items-center gap-4">
              <span>耗時:</span>
              <span className="font-mono font-medium text-fontcolor">
                {duration}
              </span>
            </span>
          )}
          {recordCount && (
            <span className="flex items-center gap-4">
              <span>處理:</span>
              <span className="font-mono font-medium text-primary">
                {recordCount}
              </span>
            </span>
          )}
        </div>
      )}



      {/* 4 個端點：卡片水平與垂直置中的上下左右 (情況：1.有連線 2.拖曳任何線段 3.被選取 4.hover在該卡片上) */}
      {CARD_PORTS.map((p) => {
        const isConnected = connectedPorts?.includes(p.name);
        const isVisible = canConnect
          ? isConnected ||
            isConnecting ||
            selected ||
            (isCardHovered && !isDraggingCard)
          : isConnected;
        const isHovered =
          canConnect &&
          isConnecting &&
          !isDraggingCard &&
          hoveredPort?.nodeId === id &&
          hoveredPort?.port === p.name;
        const canInteractPort = canConnect && isVisible && !isDraggingCard;
        return (
          <div
            key={p.name}
            data-port={canConnect ? p.name : undefined}
            data-node-id={id}
            title={canConnect ? `${title} - ${p.label} (按住拖曳可拉出連接線)` : undefined}
            aria-label={canConnect ? `${title} - ${p.label}` : undefined}
            className={cx(
              "absolute z-30 h-14 w-14 rounded-full border-2 border-white shadow-drop-s transition-all duration-200",
              canConnect ? "cursor-crosshair" : "cursor-inherit pointer-events-none",
              "before:absolute before:-inset-8 before:content-['']",
              p.className,
              isVisible
                ? canInteractPort
                  ? "opacity-100 pointer-events-auto scale-100"
                  : "opacity-100 pointer-events-none scale-100"
                : isDraggingCard || !canConnect
                  ? "opacity-0 pointer-events-none scale-50"
                  : "opacity-0 pointer-events-none scale-50 group-hover:opacity-100 group-hover:pointer-events-auto group-hover:scale-100",
              isHovered
                ? "!bg-success !scale-150 !ring-4 !ring-success/40 shadow-drop-m"
                : selected
                  ? disabled
                    ? "bg-slate-400 scale-110 ring-2 ring-slate-400/20"
                    : "bg-primary scale-110 ring-2 ring-primary/20"
                  : isConnected
                    ? disabled
                      ? "bg-slate-400"
                      : "bg-primary"
                    : "bg-stroke hover:bg-primary",
            )}
            onMouseDown={(e) => {
              if (!canConnect || isDraggingCard) return;
              e.stopPropagation();
              e.preventDefault();
              onPortMouseDown?.(e, id, p.name);
            }}
            onMouseEnter={() => {
              if (!canConnect || isDraggingCard) return;
              onPortMouseEnter?.(id, p.name);
            }}
            onMouseLeave={() => {
              if (!canConnect) return;
              onPortMouseLeave?.(id, p.name);
            }}
            onMouseUp={() => {
              if (!canConnect) return;
              onPortMouseUp?.(id, p.name);
            }}
          />
        );
      })}
    </div>
  );
});

export default WorkflowNode;

