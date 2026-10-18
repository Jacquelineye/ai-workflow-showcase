import React, { useState } from "react";
import { Datepicker } from "./datepicker";
import { TimePicker } from "./timepicker";
import Button from "./button";

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function PickersShowcaseModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("sandbox"); // "sandbox" | "matrix" | "specs"

  // 沙盒即時互動狀態
  const [sandboxDate, setSandboxDate] = useState("Sep 15, 2026");
  const [sandboxTime, setSandboxTime] = useState("10:30 AM");
  const [isEditable, setIsEditable] = useState(true);

  if (!isOpen) return null;

  const figmaVariants = [
    { title: "變體 1", subtitle: "收合 · 支援輸入", active: false, editable: true },
    { title: "變體 2", subtitle: "展開面板 · 支援輸入", active: true, editable: true },
    { title: "變體 3", subtitle: "收合 · 按鈕選取", active: false, editable: false },
    { title: "變體 4", subtitle: "展開面板 · 按鈕選取", active: true, editable: false },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pickers-showcase-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-16 backdrop-blur-sm animate-in fade-in duration-150 select-none"
      onClick={onClose}
    >
      <div
        className="relative flex h-[90vh] max-h-[860px] w-full max-w-[1240px] flex-col rounded-3xl border border-stroke/80 bg-white shadow-drop-l overflow-hidden text-left font-primary"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-stroke/60 bg-white px-24 py-16">
          <div className="flex items-center gap-12">
            <span className="flex h-36 w-36 items-center justify-center rounded-2xl bg-primary/10 text-primary text-xl shadow-xs">
              📅
            </span>
            <div>
              <div className="flex items-center gap-8 flex-wrap">
                <h2
                  id="pickers-showcase-title"
                  className="m-0 font-primary text-title-3 font-semibold text-fontcolor"
                >
                  DatePicker & TimePicker 元件展示
                </h2>
                <span className="inline-flex items-center rounded-full bg-primary/10 px-10 py-2 text-caption-2 font-semibold text-primary">
                  高度皆為 36px
                </span>
                <span className="inline-flex items-center rounded-full bg-[#10B981]/10 px-10 py-2 text-caption-2 font-semibold text-[#10B981]">
                  圓角 22px (rounded-4xl)
                </span>
                <span className="inline-flex items-center rounded-full bg-[#8B5CF6]/10 px-10 py-2 text-caption-2 font-semibold text-[#8B5CF6]">
                  1:1 Figma 忠實轉換
                </span>
              </div>
              <p className="m-0 mt-4 text-caption-1 text-description">
                已將 Figma 生成之原生樣式轉換為專案當前 Tailwind 設計系統元件，支援自控/受控、可輸入與純按鈕等所有變體。
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-32 w-32 items-center justify-center rounded-full text-description hover:bg-bg hover:text-fontcolor transition-colors cursor-pointer text-title-3"
            aria-label="關閉展示視窗"
          >
            ✕
          </button>
        </div>

        {/* 2. Tab 切換列 */}
        <div className="flex shrink-0 items-center gap-8 border-b border-stroke/40 bg-bg/40 px-24 py-8">
          <button
            type="button"
            onClick={() => setActiveTab("sandbox")}
            className={cx(
              "flex h-[32px] items-center rounded-lg px-12 text-label-3 font-medium transition-all cursor-pointer whitespace-nowrap",
              activeTab === "sandbox"
                ? "bg-primary text-white shadow-drop-s"
                : "text-fontcolor hover:bg-white/80",
            )}
          >
            ⚡ 即時互動沙盒 (Live Playground)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("matrix")}
            className={cx(
              "flex h-[32px] items-center rounded-lg px-12 text-label-3 font-medium transition-all cursor-pointer whitespace-nowrap",
              activeTab === "matrix"
                ? "bg-primary text-white shadow-drop-s"
                : "text-fontcolor hover:bg-white/80",
            )}
          >
            🎨 Figma 4 大 Desktop 變體矩陣 (Variants Matrix)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("specs")}
            className={cx(
              "flex h-[32px] items-center rounded-lg px-12 text-label-3 font-medium transition-all cursor-pointer whitespace-nowrap",
              activeTab === "specs"
                ? "bg-primary text-white shadow-drop-s"
                : "text-fontcolor hover:bg-white/80",
            )}
          >
            📐 元件規格與屬性對齊 (API Specs)
          </button>
        </div>

        {/* 3. 內容主體 */}
        <div className="flex-1 min-h-0 overflow-y-auto p-24 custom-scrollbar">
          {/* A. 即時互動沙盒 */}
          {activeTab === "sandbox" && (
            <div className="space-y-24 max-w-[960px] mx-auto">
              {/* 控制列 */}
              <div className="flex items-center justify-between p-16 rounded-2xl bg-[#F8FAFC] border border-stroke/50">
                <div className="flex items-center gap-12">
                  <span className="text-body-3 font-medium text-fontcolor">輸入框模式切換：</span>
                  <div className="flex items-center bg-white p-2 rounded-full border border-stroke/60">
                    <button
                      type="button"
                      onClick={() => setIsEditable(true)}
                      className={cx(
                        "px-12 py-4 rounded-full text-caption-1 font-medium transition-all cursor-pointer",
                        isEditable ? "bg-primary text-white shadow-xs" : "text-description hover:text-fontcolor",
                      )}
                    >
                      可直接文字輸入 (Editable)
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditable(false)}
                      className={cx(
                        "px-12 py-4 rounded-full text-caption-1 font-medium transition-all cursor-pointer",
                        !isEditable ? "bg-primary text-white shadow-xs" : "text-description hover:text-fontcolor",
                      )}
                    >
                      純按鈕點擊 (Non-editable)
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <Button
                    variant="outline"
                    intent="secondary"
                    onClick={() => {
                      setSandboxDate("Sep 15, 2026");
                      setSandboxTime("10:30 AM");
                    }}
                    className="!h-[32px] !rounded-full !px-12 text-caption-1"
                  >
                    重設預設值
                  </Button>
                </div>
              </div>

              {/* 實體操作展示卡 */}
              <div className="p-24 rounded-3xl border border-stroke bg-white shadow-drop-s space-y-20">
                <div>
                  <h3 className="text-title-3 font-semibold text-fontcolor m-0">
                    即時選取測試區
                  </h3>
                  <p className="text-caption-1 text-description mt-2 m-0">
                    點擊右側日曆或時鐘圖示即可展開浮層選擇面板，支援滾輪滾動數字、點擊選取日曆與 AM/PM 切換。
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-32 py-12">
                  {/* DatePicker 實例 */}
                  <div className="space-y-10">
                    <div className="flex items-center justify-between">
                      <label className="text-caption-1 font-semibold text-fontcolor">
                        選擇日期 (Datepicker)
                      </label>
                      <span className="text-caption-2 font-mono text-primary bg-primary/10 px-8 py-1.5 rounded-full">
                        寬度 198px · 面板 288px
                      </span>
                    </div>
                    <Datepicker
                      editable={isEditable}
                      value={sandboxDate}
                      onChange={(newVal) => setSandboxDate(newVal)}
                      placeholder="請選擇日期..."
                      style={{ width: "100%" }}
                    />
                    <div className="text-caption-2 font-mono text-description">
                      當前值：<span className="text-fontcolor font-medium">{sandboxDate}</span>
                    </div>
                  </div>

                  {/* TimePicker 實例 */}
                  <div className="space-y-10">
                    <div className="flex items-center justify-between">
                      <label className="text-caption-1 font-semibold text-fontcolor">
                        選擇時間 (TimePicker)
                      </label>
                      <span className="text-caption-2 font-mono text-primary bg-primary/10 px-8 py-1.5 rounded-full">
                        寬度 198px · 面板 198px
                      </span>
                    </div>
                    <TimePicker
                      editable={isEditable}
                      value={sandboxTime}
                      onChange={(newVal) => setSandboxTime(newVal)}
                      placeholder="請選擇時間..."
                      style={{ width: "100%" }}
                    />
                    <div className="text-caption-2 font-mono text-description">
                      當前值：<span className="text-fontcolor font-medium">{sandboxTime}</span>
                    </div>
                  </div>
                </div>

                {/* 整合預覽 Banner */}
                <div className="rounded-2xl bg-[#F8FAFC] border border-stroke/60 p-16 flex items-center justify-between">
                  <div className="flex items-center gap-12">
                    <span className="w-10 h-10 rounded-full bg-[#10B981] animate-pulse shrink-0" />
                    <div>
                      <span className="text-caption-2 text-description block">工作流程排程觸發器時間戳記預覽</span>
                      <span className="text-body-2 font-semibold text-fontcolor font-mono">
                        {sandboxDate} · {sandboxTime} (Asia/Taipei UTC+8)
                      </span>
                    </div>
                  </div>
                  <span className="px-10 py-4 rounded-full bg-[#10B981]/10 text-[#10B981] text-caption-2 font-mono font-medium">
                    Valid Cron Format
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* B. Figma 4 大變體矩陣展示 */}
          {activeTab === "matrix" && (
            <div className="space-y-36">
              {/* Datepicker 4 大變體 */}
              <div className="space-y-16">
                <div className="flex items-center justify-between border-b border-stroke/40 pb-8">
                  <div>
                    <h3 className="text-title-3 font-semibold text-fontcolor m-0">
                      1. Datepicker 4 大 Desktop 變體 (288px)
                    </h3>
                    <p className="text-caption-1 text-description mt-2 m-0">
                      涵蓋預設收合、展開面板、純按鈕樣式與輸入框樣式
                    </p>
                  </div>
                  <span className="text-caption-2 font-mono text-primary bg-primary/10 px-10 py-3 rounded-full">
                    Figma Desktop Variants
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-16 min-h-[440px] items-start overflow-x-auto pb-16">
                  {figmaVariants.map((variant, idx) => (
                    <div
                      key={idx}
                      className="p-16 rounded-2xl bg-[#F8FAFC] border border-stroke/50 flex flex-col items-center space-y-12"
                    >
                      <div className="w-full text-left">
                        <span className="text-caption-1 font-semibold text-fontcolor block">
                          {variant.title}
                        </span>
                        <span className="text-caption-2 text-description block">
                          {variant.subtitle}
                        </span>
                      </div>

                      <Datepicker
                        active={variant.active}
                        editable={variant.editable}
                        defaultValue={variant.active ? "Sep 15, 2026" : ""}
                        selectedIndex={variant.active ? 15 : null}
                        style={{ width: "100%" }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* TimePicker 4 大變體 */}
              <div className="space-y-16">
                <div className="flex items-center justify-between border-b border-stroke/40 pb-8">
                  <div>
                    <h3 className="text-title-3 font-semibold text-fontcolor m-0">
                      2. TimePicker 4 大 Desktop 變體 (198px)
                    </h3>
                    <p className="text-caption-1 text-description mt-2 m-0">
                      涵蓋預設收合、展開面板、純按鈕樣式與輸入框樣式
                    </p>
                  </div>
                  <span className="text-caption-2 font-mono text-primary bg-primary/10 px-10 py-3 rounded-full">
                    Figma Desktop Variants
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-16 min-h-[400px] items-start overflow-x-auto pb-16">
                  {figmaVariants.map((variant, idx) => (
                    <div
                      key={idx}
                      className="p-16 rounded-2xl bg-[#F8FAFC] border border-stroke/50 flex flex-col items-center space-y-12"
                    >
                      <div className="w-full text-left">
                        <span className="text-caption-1 font-semibold text-fontcolor block">
                          {variant.title}
                        </span>
                        <span className="text-caption-2 text-description block">
                          {variant.subtitle}
                        </span>
                      </div>

                      <TimePicker
                        active={variant.active}
                        editable={variant.editable}
                        defaultValue={variant.active ? "10:30 AM" : ""}
                        hour={10}
                        minute={30}
                        period="AM"
                        style={{ width: "100%" }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* C. 規格說明 */}
          {activeTab === "specs" && (
            <div className="space-y-20 max-w-[880px] mx-auto text-caption-1 leading-relaxed">
              <div className="p-20 rounded-2xl bg-[#F8FAFC] border border-stroke space-y-12">
                <h3 className="text-title-3 font-semibold text-fontcolor m-0">
                  📐 設計系統規格換算表
                </h3>
                <div className="grid grid-cols-2 gap-16 text-caption-1">
                  <div className="p-12 rounded-xl bg-white border border-stroke/40 space-y-4">
                    <span className="font-semibold text-primary block">Figma 原生代碼</span>
                    <ul className="m-0 pl-16 space-y-2 text-description">
                      <li><code>colors.primary: #5D84A2</code></li>
                      <li><code>colors.text: #52525B</code></li>
                      <li><code>border: #D1D5DB</code></li>
                      <li><code>borderRadius: 22</code></li>
                      <li><code>height: 36px</code></li>
                    </ul>
                  </div>
                  <div className="p-12 rounded-xl bg-white border border-stroke/40 space-y-4">
                    <span className="font-semibold text-[#10B981] block">當前 Tailwind 元件</span>
                    <ul className="m-0 pl-16 space-y-2 text-fontcolor">
                      <li><code>text-primary / bg-primary</code></li>
                      <li><code>text-fontcolor</code></li>
                      <li><code>border-stroke (#CBD5E1)</code></li>
                      <li><code>rounded-[22px] (rounded-4xl)</code></li>
                      <li><code>h-[36px] (統一 36px 表單高度)</code></li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="p-20 rounded-2xl bg-white border border-stroke space-y-8">
                <h4 className="text-body-2 font-semibold text-fontcolor m-0">
                  使用範例 Code
                </h4>
                <pre className="m-0 font-mono text-[12px] bg-[#F8FAFC] p-12 rounded-xl border border-stroke/50 overflow-x-auto text-fontcolor leading-relaxed">
{`import { Datepicker, TimePicker } from "./components/ui";

function MyComponent() {
  const [date, setDate] = useState("Sep 15, 2026");
  const [time, setTime] = useState("10:30 AM");

  return (
    <div className="flex items-center gap-16">
      {/* 日期選擇器 */}
      <Datepicker
        value={date}
        onChange={setDate}
        editable={true}
      />

      {/* 時間選擇器 */}
      <TimePicker
        value={time}
        onChange={setTime}
        editable={true}
      />
    </div>
  );
}`}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* 4. Footer */}
        <div className="flex shrink-0 items-center justify-between border-t border-stroke/60 bg-white px-24 py-12">
          <span className="text-caption-2 text-description">
            提示：可隨時於畫布右下角點擊「📅 Date & Time Picker」再次喚起此展示視窗。
          </span>
          <Button
            variant="filled"
            intent="primary"
            onClick={onClose}
            className="!h-[36px] !rounded-full !px-20 text-caption-1 font-medium"
          >
            關閉視窗
          </Button>
        </div>
      </div>
    </div>
  );
}

export default PickersShowcaseModal;

