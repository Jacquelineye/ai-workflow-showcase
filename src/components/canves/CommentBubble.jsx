import { useState, useEffect, useRef } from "react";

/**
 * Figma 風格全圓角畫布留言氣泡元件
 * 具備精確錨點定位、全圓角美感水滴 Pin、懸浮預覽、展開卡片、標記解決、回覆與刪除功能
 */
/**
 * Figma 風格全圓角畫布留言彈窗內容元件
 */
function CommentPopover({
  comment,
  isResolved,
  onResolve,
  onDelete,
  onReply,
  onClose,
  initialHighlightedId,
}) {
  const [replyText, setReplyText] = useState("");
  const [highlightedMessageId, setHighlightedMessageId] = useState(
    initialHighlightedId || null,
  );
  const [isScrolling, setIsScrolling] = useState(false);
  const messagesEndRef = useRef(null);
  const scrollTimerRef = useRef(null);

  const handleScroll = () => {
    setIsScrolling(true);
    if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    scrollTimerRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 800);
  };

  // 統一留言串列：第一位留言者與後續回覆排版完全相同
  const allMessages = [
    {
      id: `root-${comment.id}`,
      author: comment.author,
      avatar: comment.avatar,
      avatarBg: comment.avatarBg || "bg-primary",
      content: comment.content,
      createdAt: comment.createdAt,
    },
    ...(comment.replies || []).map((r) => ({
      id: r.id,
      author: r.author,
      avatar: r.avatar || r.author?.charAt(0),
      avatarBg: r.avatarBg || "bg-primary",
      content: r.content,
      createdAt: r.createdAt,
    })),
  ];

  // 新增回覆時平滑滾動至底部
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [allMessages.length]);

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    const newReplyId = `reply-${Date.now().toString(36)}`;
    // 再次送出時替換高亮為最新留言，舊留言高亮自動消失
    setHighlightedMessageId(newReplyId);
    onReply?.(comment.id, replyText.trim(), newReplyId);
    setReplyText("");
  };

  return (
    <div
      data-comment-popover="true"
      style={{
        position: "absolute",
        left: "42px",
        top: "-8px",
        cursor: "default",
      }}
      className="w-[320px] rounded-3xl bg-white/95 backdrop-blur-xl border border-stroke/80 shadow-drop-m p-16 text-left pointer-events-auto cursor-default animate-in fade-in zoom-in-95 duration-150"
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {/* 對話窗標頭：最上面僅保留待處理（左側），勾勾、刪除、叉叉（右側） */}
      <div className="flex items-center justify-between border-b border-stroke/50 pb-12">
        <div className="flex items-center">
          {isResolved ? (
            <span className="rounded-full bg-emerald-50 px-8 py-4 text-caption-1 font-medium text-emerald-600 border border-emerald-200 inline-flex items-center gap-4">
              <svg
                viewBox="0 0 24 24"
                className="w-16 h-16 stroke-current fill-none stroke-[2.5] shrink-0"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
              已解決
            </span>
          ) : (
            <span className="rounded-full bg-primary/10 px-8 py-4 text-caption-1 font-medium text-primary border border-primary/20 inline-flex items-center gap-4">
              <span className="w-16 h-16 rounded-full bg-primary shrink-0" />
              待處理
            </span>
          )}
        </div>

        {/* 標頭操作功能按鈕 (全圓角：勾勾、刪除、叉叉) */}
        <div className="flex items-center gap-4">
          {/* 切換解決狀態 (勾勾) */}
          <button
            type="button"
            title={isResolved ? "重新開啟此留言" : "標記為已解決"}
            aria-label={isResolved ? "重新開啟此留言" : "標記為已解決"}
            onClick={() => onResolve?.(comment.id)}
            className={`w-28 h-28 flex items-center justify-center rounded-full transition-colors cursor-pointer ${
              isResolved
                ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                : "text-description hover:bg-emerald-50 hover:text-emerald-600"
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              className="w-16 h-16 stroke-current fill-none stroke-2"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </button>

          {/* 刪除留言 */}
          <button
            type="button"
            title="刪除留言"
            aria-label="刪除留言"
            onClick={() => onDelete?.(comment.id)}
            className="w-28 h-28 flex items-center justify-center rounded-full text-description hover:bg-red-50 hover:text-error transition-colors cursor-pointer"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-16 h-16 stroke-current fill-none stroke-2"
            >
              <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" />
            </svg>
          </button>

          {/* 關閉對話窗 */}
          <button
            type="button"
            title="關閉"
            aria-label="關閉"
            onClick={onClose}
            className="w-28 h-28 flex items-center justify-center rounded-full text-description hover:bg-bg hover:text-fontcolor transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>
      </div>

      {/* 統一留言串列：排版完全一致，一般留言無灰底，剛送出之留言具備灰底 */}
      <div
        onScroll={handleScroll}
        className={`max-h-[260px] overflow-y-auto space-y-8 my-12 pr-4 custom-scrollbar ${
          isScrolling ? "is-scrolling" : ""
        }`}
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: isScrolling ? "#CBD5E1 transparent" : "transparent transparent",
        }}
      >
        {allMessages.map((msg) => {
          const isNewlySent = msg.id === highlightedMessageId;
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-8 rounded-2xl p-8 transition-colors duration-200 ${
                isNewlySent
                  ? "bg-bg border border-stroke/60"
                  : "bg-transparent border border-transparent"
              }`}
            >
              <span
                className={`flex h-24 w-24 shrink-0 items-center justify-center rounded-full text-white text-caption-1 font-bold shadow-xs ${
                  msg.avatarBg || "bg-primary"
                }`}
              >
                {msg.avatar || msg.author?.charAt(0)}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-6">
                  <span className="text-label-3 font-medium text-fontcolor truncate">
                    {msg.author}
                  </span>
                  <span className="text-caption-2 text-description shrink-0">
                    {msg.createdAt}
                  </span>
                </div>
                <p className="m-0 mt-4 text-caption-1 text-fontcolor leading-relaxed whitespace-pre-wrap break-words">
                  {msg.content}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* 全圓角回覆輸入框 (高度 40px) */}
      <div className="flex items-center gap-8 border-t border-stroke/40 pt-12">
        <input
          type="text"
          placeholder="回覆此留言..."
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && replyText.trim()) {
              e.preventDefault();
              handleSendReply();
            }
          }}
          className="min-w-0 flex-1 h-[36px] rounded-full border border-stroke bg-bg/30 px-16 text-caption-1 text-fontcolor placeholder:text-description/60 focus:bg-white focus:border-primary focus:outline-none transition-colors cursor-text"
        />
        <button
          type="button"
          disabled={!replyText.trim()}
          onClick={handleSendReply}
          className="h-[36px] shrink-0 rounded-full bg-primary px-16 text-caption-1 font-medium text-white hover:bg-primary/90 disabled:opacity-40 disabled:pointer-events-none transition-all shadow-sm active:scale-95 cursor-pointer flex items-center justify-center"
        >
          送出
        </button>
      </div>
    </div>
  );
}

/**
 * Figma 風格全圓角畫布留言氣泡元件
 * 具備精確錨點定位、全圓角美感水滴 Pin、懸浮預覽、展開卡片、標記解決、回覆與刪除功能
 */
export function CommentBubble({
  comment,
  zoom = 100,
  isSelected,
  onToggleSelect,
  onMoveEnd,
  onResolve,
  onDelete,
  onReply,
  onClose,
  initialHighlightedId,
}) {
  const isResolved = !!comment.resolved;
  const [isDragging, setIsDragging] = useState(false);
  const [isDropping, setIsDropping] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const startMouseRef = useRef({ x: 0, y: 0 });
  const hasDraggedRef = useRef(false);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const zoomScaleRef = useRef((zoom || 100) / 100);

  useEffect(() => {
    zoomScaleRef.current = (zoom || 100) / 100;
  }, [zoom]);

  const handlePinMouseDown = (e) => {
    if (e.button !== 0) return;
    e.stopPropagation();

    startMouseRef.current = { x: e.clientX, y: e.clientY };
    hasDraggedRef.current = false;
    dragOffsetRef.current = { x: 0, y: 0 };
    setDragOffset({ x: 0, y: 0 });

    const handleMouseMove = (moveEvent) => {
      const scale = zoomScaleRef.current || 1;
      const dx = Math.round((moveEvent.clientX - startMouseRef.current.x) / scale);
      const dy = Math.round((moveEvent.clientY - startMouseRef.current.y) / scale);

      if (!hasDraggedRef.current && (Math.abs(dx) > 3 || Math.abs(dy) > 3)) {
        hasDraggedRef.current = true;
        setIsDragging(true);
      }

      if (hasDraggedRef.current) {
        dragOffsetRef.current = { x: dx, y: dy };
        setDragOffset({ x: dx, y: dy });
      }
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);

      if (hasDraggedRef.current) {
        const finalX = comment.x + dragOffsetRef.current.x;
        const finalY = comment.y + dragOffsetRef.current.y;
        setDragOffset({ x: 0, y: 0 });
        dragOffsetRef.current = { x: 0, y: 0 };
        setIsDragging(false);
        setIsDropping(true);
        setTimeout(() => setIsDropping(false), 600);
        onMoveEnd?.(comment.id, finalX, finalY);
      } else {
        setIsDragging(false);
        onToggleSelect?.(comment.id);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const currentX = comment.x + dragOffset.x;
  const currentY = comment.y + dragOffset.y;

  return (
    <div
      data-comment-pin={comment.id}
      style={{
        position: "absolute",
        left: `${currentX}px`,
        top: `${currentY}px`,
        transform: "translate(-3px, -40px)",
        zIndex: isDragging ? 60 : isSelected ? 48 : 25,
      }}
      className="pointer-events-auto select-none"
    >
      {/* 留言 Pin 按鈕 (左鍵按住可拖曳移動，放開時具備彈跳與光環衝擊波特效) */}
      <div className="relative group flex items-center justify-center">
        {/* 放泡泡時的衝擊波光環擴散特效 */}
        {isDropping && (
          <span
            className="pointer-events-none absolute -inset-6 rounded-full border-2 border-primary animate-drop-ripple"
          />
        )}

        <button
          type="button"
          aria-label={`查看 ${comment.author} 的留言`}
          onMouseDown={handlePinMouseDown}
          className={`relative flex items-center justify-center transition-transform select-none rounded-full ${
            isDragging
              ? "scale-125 cursor-grabbing drop-shadow-2xl z-50 duration-75"
              : isDropping
                ? "animate-bubble-drop cursor-grab drop-shadow-xl duration-150"
                : isSelected
                  ? "scale-110 drop-shadow-xl cursor-grab duration-200"
                  : "hover:scale-110 hover:drop-shadow-lg cursor-grab duration-200"
          }`}
        >
          {/* 全圓角水滴對話氣泡 SVG */}
          <svg
            width="38"
            height="42"
            viewBox="0 0 38 42"
            fill="none"
            className="filter drop-shadow-md transition-all duration-200"
          >
            <path
              d="M19 2C9.61 2 2 9.61 2 19c0 3.86 1.28 7.42 3.46 10.28L2.3 39.2c-.36.82.44 1.62 1.25 1.26l8.85-3.93C14.47 37.45 16.68 38 19 38c9.39 0 17-7.61 17-17S28.39 2 19 2Z"
              className={
                isResolved
                  ? "fill-emerald-500 stroke-white stroke-[2.5]"
                  : "fill-primary stroke-white stroke-[2.5]"
              }
              strokeLinejoin="round"
            />
          </svg>

          {/* 氣泡內部狀態：已解決為白色勾選圖示，未解決為作者頭文字 (幾何中心精準置中) */}
          <div
            className="absolute pointer-events-none flex items-center justify-center"
            style={{
              top: 0,
              left: 0,
              width: "38px",
              height: "38px",
            }}
          >
            {isResolved ? (
              <svg
                viewBox="0 0 24 24"
                className="w-16 h-16 stroke-white fill-none stroke-[3]"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            ) : (
              <span className="text-label-3 font-bold text-white leading-none tracking-tight flex items-center justify-center text-center select-none font-primary">
                {comment.avatar || comment.author?.charAt(0) || "💬"}
              </span>
            )}
          </div>
        </button>
      </div>

      {/* 展開之留言詳細對話窗 (全圓角 rounded-3xl，滑鼠進入時恢復為箭頭) */}
      {isSelected && (
        <CommentPopover
          comment={comment}
          isResolved={isResolved}
          onResolve={onResolve}
          onDelete={onDelete}
          onReply={onReply}
          onClose={onClose}
          initialHighlightedId={initialHighlightedId}
        />
      )}
    </div>
  );
}

/**
 * Figma 風格全圓角草稿留言輸入氣泡元件
 */
export function CommentDraftBubble({
  draft,
  onChange,
  onSubmit,
  onCancel,
}) {
  return (
    <div
      style={{
        position: "absolute",
        left: `${draft.x}px`,
        top: `${draft.y}px`,
        transform: "translate(-3px, -40px)",
        zIndex: 50,
      }}
      className="pointer-events-auto select-none"
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {/* 草稿全圓角 Pin (帶呼吸微動效，＋號幾何中心精準置中) */}
      <div className="relative flex items-center justify-center">
        <svg
          width="38"
          height="42"
          viewBox="0 0 38 42"
          fill="none"
          className="filter drop-shadow-md animate-pulse"
        >
          <path
            d="M19 2C9.61 2 2 9.61 2 19c0 3.86 1.28 7.42 3.46 10.28L2.3 39.2c-.36.82.44 1.62 1.25 1.26l8.85-3.93C14.47 37.45 16.68 38 19 38c9.39 0 17-7.61 17-17S28.39 2 19 2Z"
            className="fill-primary stroke-white stroke-[2.5]"
            strokeLinejoin="round"
          />
        </svg>
        <div
          className="absolute pointer-events-none flex items-center justify-center"
          style={{
            top: 0,
            left: 0,
            width: "38px",
            height: "38px",
          }}
        >
          <svg
            viewBox="0 0 24 24"
            className="w-16 h-16 stroke-white stroke-[2.8] fill-none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
        </div>
      </div>

      {/* 草稿輸入卡片 (全圓角 rounded-3xl，滑鼠進入時恢復為箭頭) */}
      <div
        data-comment-composer="true"
        style={{
          position: "absolute",
          left: "42px",
          top: "-8px",
          cursor: "default",
        }}
        className="w-[320px] rounded-3xl bg-white/95 backdrop-blur-xl border border-stroke/80 shadow-drop-m p-16 text-left pointer-events-auto cursor-default animate-in fade-in zoom-in-95 duration-150"
      >
        <div className="flex items-center justify-between border-b border-stroke/50 pb-10">
          <div className="flex items-center gap-8">
            <span className="flex h-24 w-24 items-center justify-center rounded-full bg-primary text-white text-caption-1 font-bold shadow-sm">
              你
            </span>
            <span className="text-label-2 font-medium text-fontcolor">
              新增畫布留言
            </span>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="w-24 h-24 flex items-center justify-center rounded-full text-description hover:bg-bg hover:text-fontcolor text-caption-1 transition-colors cursor-pointer"
            title="取消 (Esc)"
          >
            ✕
          </button>
        </div>

        <textarea
          autoFocus
          rows={3}
          value={draft.text || ""}
          onChange={(e) => onChange?.(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSubmit?.();
            } else if (e.key === "Escape") {
              e.preventDefault();
              onCancel?.();
            }
          }}
          placeholder="在此輸入留言內容... (Enter 送出, Shift+Enter 換行)"
          className="mt-12 w-full resize-none rounded-2xl border border-stroke/80 bg-bg/20 p-12 text-caption-1 text-fontcolor placeholder:text-description/60 focus:bg-white focus:border-primary focus:outline-none transition-colors cursor-text"
        />

        <div className="mt-12 flex items-center justify-between">
          <span className="text-caption-2 text-description font-normal">
            按 Esc 取消
          </span>
          <div className="flex items-center gap-8">
            <button
              type="button"
              onClick={onCancel}
              className="h-[36px] rounded-full px-16 text-caption-1 text-description hover:bg-bg transition-colors cursor-pointer flex items-center justify-center"
            >
              取消
            </button>
            <button
              type="button"
              disabled={!draft.text?.trim()}
              onClick={onSubmit}
              className="h-[36px] rounded-full bg-primary px-16 text-caption-1 font-medium text-white hover:bg-primary/90 disabled:opacity-40 disabled:pointer-events-none transition-all shadow-sm active:scale-95 cursor-pointer flex items-center justify-center"
            >
              發佈留言
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommentBubble;

