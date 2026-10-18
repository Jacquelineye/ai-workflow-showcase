import { useEffect, useState, useCallback, useRef } from "react";
import Button from "../ui/button.jsx";
import { LayoutIcon } from "../../layouts/workflowLayout.jsx";

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

/**
 * 教學流程步驟定義 (3 個核心步驟)
 * 1. 拖曳新增節點 (右側工具箱 -> 畫布)
 * 2. 點擊編輯項目 (選取畫布卡片開啟右側設定)
 * 3. 連接流程節點 (拖曳端點建立連線)
 */
export const TUTORIAL_STEPS = [
  {
    id: "drag-node",
    badge: "步驟 1 / 3",
    title: "1. 拖曳新增節點",
    icon: "layers",
    description:
      "從右側工具箱挑選您需要的節點（例如 Trigger 觸發器），按住並拖曳至畫布任意位置，即可建立新的自動化步驟。",
    tip: "💡 提示：按住左鍵直接拖曳右側的項目至中間畫布，放開即可放置節點。",
    targetSelector: "#tool-item-trigger",
    fallbackSelector: '[data-tool-id="trigger"]',
    preferredPlacement: "left",
    padding: 8,
    radius: 16,
  },
  {
    id: "edit-node",
    badge: "步驟 2 / 3",
    title: "2. 點擊編輯項目",
    icon: "pen",
    description:
      "點選畫布上的任一節點卡片，即可選取該節點並展開詳細設定面板，自訂排程時間、API 網址或 AI 模型參數。",
    tip: "💡 提示：被選取的節點周圍會顯示外框，卡片下方工具列亦可快速複製或停用節點。",
    targetSelector: "#node-trigger-cron",
    fallbackSelector: '[id^="node-"]',
    preferredPlacement: "bottom",
    padding: 10,
    radius: 20,
  },
  {
    id: "connect-node",
    badge: "步驟 3 / 3",
    title: "3. 連接流程節點",
    icon: "branch",
    description:
      "將游標移至節點四周的圓形端點（上下左右），按住並拖曳拉出連接線至另一個節點，即可完成資料流串接！",
    tip: "💡 提示：每個節點皆具備上下左右 4 個連接端點，點擊連線也可以隨時選取或調整路線。",
    targetSelector: '[data-node-id="trigger-cron"][data-port="right"]',
    fallbackSelector: "#node-trigger-cron",
    preferredPlacement: "right",
    padding: 10,
    radius: 9999,
  },
];

function isSameRect(a, b) {
  if (!a && !b) return true;
  if (!a || !b) return false;
  return (
    Math.abs(a.x - b.x) < 0.5 &&
    Math.abs(a.y - b.y) < 0.5 &&
    Math.abs(a.width - b.width) < 0.5 &&
    Math.abs(a.height - b.height) < 0.5 &&
    a.radius === b.radius
  );
}

function isSamePos(a, b) {
  if (!a && !b) return true;
  if (!a || !b) return false;
  return Math.abs(a.x - b.x) < 0.5 && Math.abs(a.y - b.y) < 0.5;
}

export default function SpotlightTutorial({
  isOpen,
  onClose,
  currentStep = 0,
  onStepChange,
  onFocusNode,
}) {
  const [targetRect, setTargetRect] = useState(null);
  const [cardPos, setCardPos] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  const targetRectRef = useRef(targetRect);
  targetRectRef.current = targetRect;

  const cardPosRef = useRef(cardPos);
  cardPosRef.current = cardPos;

  const step = TUTORIAL_STEPS[currentStep] || TUTORIAL_STEPS[0];

  // 計算目標元件的位置與大小 (精準鎖定，無任何跨屏飛行動畫)
  const updateTargetRect = useCallback(() => {
    if (!isOpen) return;

    // 若在步驟 2 或 3，主動選取目標節點，讓端點可視化
    if (currentStep === 1 || currentStep === 2) {
      onFocusNode?.("trigger-cron");
    }

    let el = document.querySelector(step.targetSelector);
    if (!el && step.fallbackSelector) {
      el = document.querySelector(step.fallbackSelector);
    }

    if (el) {
      const r = el.getBoundingClientRect();
      const pad = step.padding || 8;
      const rect = {
        x: Math.round(Math.max(0, r.left - pad)),
        y: Math.round(Math.max(0, r.top - pad)),
        width: Math.round(r.width + pad * 2),
        height: Math.round(r.height + pad * 2),
        radius: step.radius || 16,
      };

      if (!isSameRect(targetRectRef.current, rect)) {
        setTargetRect(rect);
      }

      // 計算氣泡卡片位置
      const cardWidth = 340;
      const cardHeight = cardRef.current?.offsetHeight || 230;
      let x = 0;
      let y = 0;

      switch (step.preferredPlacement) {
        case "left":
          x = rect.x - cardWidth - 16;
          y = rect.y + rect.height / 2 - cardHeight / 2;
          break;
        case "right":
          x = rect.x + rect.width + 16;
          y = rect.y + rect.height / 2 - cardHeight / 2;
          break;
        case "top":
          x = rect.x + rect.width / 2 - cardWidth / 2;
          y = rect.y - cardHeight - 16;
          break;
        case "bottom":
        default:
          x = rect.x + rect.width / 2 - cardWidth / 2;
          y = rect.y + rect.height + 16;
          break;
      }

      // 視窗邊界夾取 (Clamping)，確保彈窗永遠在可視畫面中
      const padding = 16;
      const clampX = Math.round(
        Math.max(padding, Math.min(window.innerWidth - cardWidth - padding, x))
      );
      const clampY = Math.round(
        Math.max(padding, Math.min(window.innerHeight - cardHeight - padding, y))
      );

      const nextPos = { x: clampX, y: clampY };
      if (!isSamePos(cardPosRef.current, nextPos)) {
        setCardPos(nextPos);
      }
    } else {
      // 找不到目標時居中備援
      const cardWidth = 340;
      const cardHeight = 230;
      const centerPos = {
        x: Math.round(Math.max(16, (window.innerWidth - cardWidth) / 2)),
        y: Math.round(Math.max(16, (window.innerHeight - cardHeight) / 2)),
      };
      if (!isSamePos(cardPosRef.current, centerPos)) {
        setCardPos(centerPos);
      }
      if (targetRectRef.current !== null) {
        setTargetRect(null);
      }
    }
  }, [isOpen, currentStep, step, onFocusNode]);

  // 高幀率即時同步鎖定目標位置，防止畫面捲動或視窗調整時邊框脫節
  useEffect(() => {
    if (!isOpen) return;

    updateTargetRect();

    let animId = null;
    const loop = () => {
      updateTargetRect();
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [isOpen, currentStep, updateTargetRect]);

  // 鍵盤快捷鍵：ESC 關閉、方向鍵切換步驟
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose?.();
      } else if (e.key === "ArrowRight") {
        if (currentStep < TUTORIAL_STEPS.length - 1) {
          onStepChange?.(currentStep + 1);
        } else {
          onClose?.();
        }
      } else if (e.key === "ArrowLeft") {
        if (currentStep > 0) {
          onStepChange?.(currentStep - 1);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentStep, onStepChange, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="操作教學導覽"
      className="fixed inset-0 z-50 select-none animate-in fade-in duration-150"
    >
      {/* 聚光燈 SVG 遮罩 (全螢幕暗化 + 鏤空高亮目標，無跨屏移動過渡) */}
      <svg
        className="fixed inset-0 h-full w-full pointer-events-none"
        style={{ zIndex: 51 }}
      >
        <defs>
          <mask id="tutorial-spotlight-mask">
            {/* 白色覆蓋所有區域 */}
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {/* 黑色鏤空高亮目標 (直接鎖定座標，不使用 CSS 過渡) */}
            {targetRect && (
              <rect
                x={targetRect.x}
                y={targetRect.y}
                width={targetRect.width}
                height={targetRect.height}
                rx={targetRect.radius}
                ry={targetRect.radius}
                fill="black"
              />
            )}
          </mask>
        </defs>
        {/* 半透明黑色遮罩 */}
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(0, 0, 0, 0.45)"
          mask="url(#tutorial-spotlight-mask)"
          className="pointer-events-auto"
          onClick={onClose}
        />
      </svg>

      {/* 目標周圍呼吸高亮框：使用 key={currentStep}，換步時直接切換淡入，不跨屏滑動 */}
      {targetRect && (
        <div
          key={`beacon-${currentStep}`}
          aria-hidden="true"
          className="fixed pointer-events-none border-2 border-primary ring-4 ring-primary/25 shadow-drop-m animate-in fade-in duration-150"
          style={{
            zIndex: 52,
            left: `${targetRect.x}px`,
            top: `${targetRect.y}px`,
            width: `${targetRect.width}px`,
            height: `${targetRect.height}px`,
            borderRadius: `${targetRect.radius}px`,
          }}
        />
      )}

      {/* 教學氣泡引導卡片：換步時直接在目標旁淡入，不跨螢幕平移 */}
      <div
        key={`card-${currentStep}`}
        ref={cardRef}
        role="region"
        aria-live="polite"
        className="fixed w-[340px] rounded-[22px] rounded-4xl bg-white p-20 shadow-drop-l border border-stroke text-left font-primary flex flex-col gap-12 animate-in fade-in duration-150"
        style={{
          zIndex: 53,
          left: `${cardPos.x}px`,
          top: `${cardPos.y}px`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 標頭：步驟 Badge 與 36px*36px 關閉按鈕 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="inline-flex items-center gap-4 px-8 py-2 rounded-full bg-primary/10 text-primary text-caption-1 font-semibold tracking-wide">
              {step.badge}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="略過教學導覽"
            className="flex h-[36px] w-[36px] min-h-[36px] min-w-[36px] items-center justify-center rounded-full text-description hover:bg-bg hover:text-fontcolor transition-colors cursor-pointer shrink-0"
          >
            <LayoutIcon name="close" className="!h-16 !w-16" />
          </button>
        </div>

        {/* 標題與詳細說明 */}
        <div className="flex flex-col gap-6">
          <h3 className="m-0 text-label-1 font-semibold text-fontcolor flex items-center gap-6">
            {step.title}
          </h3>
          <p className="m-0 text-caption-1 text-description leading-relaxed">
            {step.description}
          </p>

          {/* 實用提示小卡 */}
          {step.tip && (
            <div className="rounded-xl bg-bg/80 p-8 text-caption-2 text-fontcolor/80 leading-normal border border-stroke/60">
              {step.tip}
            </div>
          )}
        </div>

        {/* 底部導覽列：略過 + 3 進度點 + 上一步/下一步 */}
        <div className="flex items-center justify-between pt-8 border-t border-stroke/60 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="text-caption-1 text-description hover:text-fontcolor font-medium transition-colors cursor-pointer py-4 px-2"
          >
            略過
          </button>

          {/* 3 個進度圓點 */}
          <div className="flex items-center gap-6">
            {TUTORIAL_STEPS.map((_, idx) => (
              <button
                key={idx}
                type="button"
                aria-label={`切換至第 ${idx + 1} 步`}
                onClick={() => onStepChange?.(idx)}
                className={cx(
                  "h-6 rounded-full transition-all duration-200 cursor-pointer p-0 border-0",
                  idx === currentStep
                    ? "w-16 bg-primary"
                    : "w-6 bg-stroke hover:bg-description/50"
                )}
              />
            ))}
          </div>

          {/* 操作按鈕組 */}
          <div className="flex items-center gap-6">
            {currentStep > 0 && (
              <Button
                variant="ghost"
                onClick={() => onStepChange?.(currentStep - 1)}
                className="!h-[32px] !px-12 text-caption-1"
              >
                上一步
              </Button>
            )}
            <Button
              variant="filled"
              intent="primary"
              onClick={() => {
                if (currentStep < TUTORIAL_STEPS.length - 1) {
                  onStepChange?.(currentStep + 1);
                } else {
                  onClose?.();
                }
              }}
              className="!h-[32px] !px-14 text-caption-1 font-medium shadow-drop-s"
            >
              {currentStep === TUTORIAL_STEPS.length - 1 ? "完成教學" : "下一步"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
