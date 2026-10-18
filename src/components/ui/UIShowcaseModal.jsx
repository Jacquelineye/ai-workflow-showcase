import { useState } from "react";
import { Input } from "./input";
import { Select } from "./select";
import { Switch } from "./switch";
import { Slider } from "./slider";
import { Textarea } from "./textarea";
import Button from "./button";
import { Body, BodyVariants } from "./bodyCell";
import { DataTable } from "./dataTable";
import { Datepicker } from "./datepicker";
import { TimePicker } from "./timepicker";

const TABS = [
  { id: "all", label: "全部展示 (All)" },
  { id: "datatable", label: "DataTable 表格 (Figma)" },
  { id: "pickers", label: "DatePicker & TimePicker 日期時間" },
  { id: "body", label: "TableCell / Body 單元格" },
  { id: "input", label: "Input 輸入框" },
  { id: "select", label: "Select 下拉選單" },
  { id: "switch", label: "Switch 開關切換" },
  { id: "slider", label: "Slider 數值滑桿" },
  { id: "textarea", label: "Textarea 多行輸入" },
  { id: "realworld", label: "節點詳情配置範例" },
];

export function UIShowcaseModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("all");

  // 互動狀態 Sandbox
  const [interactiveInput, setInteractiveInput] = useState("AI 智能分析助理");
  const [interactiveSelect, setInteractiveSelect] = useState("gemini-1.5-pro");
  const [interactiveSwitch, setInteractiveSwitch] = useState(true);
  const [interactiveSlider, setInteractiveSlider] = useState(75);
  const [interactiveTextarea, setInteractiveTextarea] = useState(
    "你是一個具備專業流程自動化能力的繁體中文助理，請根據使用者輸入的資料進行摘要與分流。",
  );
  const [interactiveDate, setInteractiveDate] = useState("Sep 15, 2026");
  const [interactiveTime, setInteractiveTime] = useState("10:30 AM");

  if (!isOpen) return null;

  const selectOptions = [
    { value: "gpt-4o", label: "OpenAI GPT-4o" },
    { value: "gemini-1.5-pro", label: "Google Gemini 1.5 Pro" },
    { value: "claude-3-5-sonnet", label: "Anthropic Claude 3.5 Sonnet" },
    { value: "deepseek-v3", label: "DeepSeek V3" },
    { value: "llama-3-70b", label: "Meta LLaMA 3 70B (停用)", disabled: true },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ui-showcase-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-16 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative flex h-[90vh] max-h-[860px] w-full max-w-[1080px] flex-col rounded-3xl border border-stroke/80 bg-white shadow-drop-l overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-stroke/60 bg-white px-20 py-12">
          <div className="flex items-center gap-10">
            <span className="flex h-32 w-32 items-center justify-center rounded-xl bg-primary/10 text-primary text-title-3">
              🎨
            </span>
            <div>
              <div className="flex items-center gap-8">
                <h2
                  id="ui-showcase-title"
                  className="m-0 font-primary text-title-3 font-medium text-fontcolor"
                >
                  36px 表單元件庫展示 (UI Components Showcase)
                </h2>
                <span className="inline-flex items-center rounded-md bg-primary/10 px-8 py-2 text-caption-2 font-semibold text-primary">
                  高度皆為 36px
                </span>
                <span className="inline-flex items-center rounded-md bg-success/10 px-8 py-2 text-caption-2 font-semibold text-success">
                  圓角 22px (rounded-4xl)
                </span>
              </div>
              <p className="m-0 mt-2 text-caption-2 text-description">
                專為右側選單各節點於右上詳情面板配置設計，支援 Default、Hover、Focus、Disabled、Error (未聚焦/聚焦)
                等所有規範狀態。
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-28 w-28 items-center justify-center rounded-full text-description hover:bg-bg hover:text-fontcolor transition-colors cursor-pointer text-title-3"
            aria-label="關閉展示視窗"
          >
            ✕
          </button>
        </div>

        {/* Tab Filter Bar */}
        <div className="flex shrink-0 items-center gap-8 border-b border-stroke/40 bg-bg/40 px-20 py-6 overflow-x-auto">
          {TABS.map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex h-32 items-center rounded-lg px-12 text-label-3 font-medium transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? "bg-primary text-white shadow-drop-s"
                    : "text-fontcolor hover:bg-white/80"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-24 space-y-32">
          {/* ❖ DataTable 表格元件展示 (Figma 原稿 1:1 完整呈現) */}
          {(activeTab === "all" || activeTab === "datatable") && (
            <section className="rounded-2xl border border-stroke/70 bg-white p-20 shadow-drop-s space-y-16">
              <div className="flex items-center justify-between border-b border-stroke/40 pb-10">
                <div className="flex items-center gap-8">
                  <h3 className="m-0 text-title-3 font-medium text-fontcolor">
                    ❖ DataTable 表格元件
                  </h3>
                  <code className="rounded bg-bg px-6 py-2 text-caption-2 font-mono text-primary">
                    22px 圓角 (rounded-4xl) / 7 Header + 6 Body
                  </code>
                </div>
                <span className="text-caption-2 text-description">
                  元件路徑：src/components/ui/dataTable.jsx
                </span>
              </div>

              <div>
                <h4 className="m-0 mb-12 text-label-3 font-medium text-description">
                  【對齊 Figma 設計稿之 8 欄位 (1 Checkbox + 7 Header) × 6 列 Body 結構，支援全選／個別行勾選與選中底色】
                </h4>
                <div className="rounded-2xl bg-bg/30 p-20 border border-stroke/40 flex flex-col items-center">
                  <div className="w-full max-w-[860px]">
                    <DataTable showLabel label="DataTable" />
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* 0. TableCell / Body 單元格 (Figma Node 2493:2514) */}
          {(activeTab === "all" || activeTab === "body") && (
            <section className="rounded-2xl border border-stroke/70 bg-white p-20 shadow-drop-s space-y-16">
              <div className="flex items-center justify-between border-b border-stroke/40 pb-10">
                <div className="flex items-center gap-8">
                  <h3 className="m-0 text-title-3 font-medium text-fontcolor">
                    0. TableCell / Body 單元格 (Figma 設計稿)
                  </h3>
                  <code className="rounded bg-bg px-6 py-2 text-caption-2 font-mono text-primary">
                    Node 2493:2514 / 12 個變體規範
                  </code>
                </div>
                <span className="text-caption-2 text-description">
                  元件路徑：src/components/ui/bodyCell.jsx
                </span>
              </div>

              <div>
                <h4 className="m-0 mb-8 text-label-3 font-medium text-description">
                  【Figma 3x4 變體完整矩陣：Default / Checkbox Yes / Checkbox No / Instance × Default / Selected / Hover】
                </h4>
                <div className="overflow-x-auto rounded-xl border border-stroke/50 bg-bg/20 p-16 flex justify-center">
                  <BodyVariants />
                </div>
              </div>
            </section>
          )}

          {/* 1. Input 元件展示 */}
          {(activeTab === "all" || activeTab === "input") && (
            <section className="rounded-2xl border border-stroke/70 bg-white p-20 shadow-drop-s space-y-16">
              <div className="flex items-center justify-between border-b border-stroke/40 pb-10">
                <div className="flex items-center gap-8">
                  <h3 className="m-0 text-title-3 font-medium text-fontcolor">
                    1. Input 輸入框
                  </h3>
                  <code className="rounded bg-bg px-6 py-2 text-caption-2 font-mono text-primary">
                    h-[36px] / 圓角 22px (rounded-4xl)
                  </code>
                </div>
                <span className="text-caption-2 text-description">
                  元件路徑：src/component/ui/input.jsx
                </span>
              </div>

              {/* 狀態矩陣 */}
              <div>
                <h4 className="m-0 mb-8 text-label-3 font-medium text-description">
                  【靜態規範狀態展示：包含 Default、Hover、Focus、Error 未聚焦、Error Hover 懸停、Error Focus 聚焦、Disabled】
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8">
                  <div className="space-y-4">
                    <span className="text-caption-2 font-medium text-secondary">
                      預設態 (Default)
                    </span>
                    <Input
                      status="default"
                      placeholder="請輸入..."
                      defaultValue="資料節點"
                    />
                  </div>

                  <div className="space-y-4">
                    <span className="text-caption-2 font-medium text-secondary">
                      懸停態 (Hover)
                    </span>
                    <Input
                      status="hover"
                      placeholder="外框加深..."
                      defaultValue="資料節點"
                    />
                  </div>

                  <div className="space-y-4">
                    <span className="text-caption-2 font-medium text-secondary">
                      聚焦態 (Focus)
                    </span>
                    <Input
                      status="focus"
                      placeholder="藍色聚焦環..."
                      defaultValue="資料節點"
                    />
                  </div>

                  <div className="space-y-4">
                    <span className="text-caption-2 font-medium text-error">
                      錯誤態 (Error)
                    </span>
                    <Input
                      status="error"
                      placeholder="格式不符..."
                      defaultValue="invalid#"
                      errorMessage="純紅框"
                    />
                  </div>

                  <div className="space-y-4">
                    <span className="text-caption-2 font-medium text-error">
                      錯誤懸停 (Err Hover)
                    </span>
                    <Input
                      status="error-hover"
                      placeholder="錯誤懸停..."
                      defaultValue="invalid#"
                      errorMessage="紅框+微光暈"
                    />
                  </div>

                  <div className="space-y-4">
                    <span className="text-caption-2 font-medium text-error">
                      錯誤聚焦 (Err Focus)
                    </span>
                    <Input
                      status="error-focus"
                      placeholder="格式不符..."
                      defaultValue="invalid#"
                      errorMessage="紅框+聚焦環"
                    />
                  </div>

                  <div className="space-y-4">
                    <span className="text-caption-2 font-medium text-secondary">
                      停用態 (Disabled)
                    </span>
                    <Input
                      status="disabled"
                      placeholder="不可編輯..."
                      defaultValue="唯讀參數"
                    />
                  </div>
                </div>
              </div>

              {/* 互動沙盒 */}
              <div className="rounded-xl bg-bg/50 p-12 border border-stroke/50">
                <div className="flex items-center justify-between mb-8">
                  <span className="text-label-3 font-medium text-fontcolor">
                    ⚡ 互動式試用 (可實際鍵入與測試 Focus/Hover)
                  </span>
                  <span className="text-caption-2 text-description font-mono">
                    當前值: "{interactiveInput}"
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <Input
                    label="一般輸入框 (支援 prefix 圖示)"
                    prefixIcon={
                      <svg viewBox="0 0 24 24" className="h-16 w-16 stroke-current fill-none stroke-2">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      </svg>
                    }
                    value={interactiveInput}
                    onChange={(e) => setInteractiveInput(e.target.value)}
                    placeholder="輸入文字搜尋或設定..."
                    helperText="輸入文字將即時反應"
                  />
                  <Input
                    label="數字輸入框 (純後置單位，支援框內滾輪微調)"
                    type="number"
                    defaultValue="30"
                    min={1}
                    max={300}
                    step={1}
                    suffixIcon={<span className="text-caption-2 font-mono">秒</span>}
                    placeholder="超時秒數"
                    helperText="💡 滑鼠懸停於框內時滾動滾輪，即可平滑增減數值"
                  />
                </div>
              </div>
            </section>
          )}

          {/* 2. Select 元件展示 */}
          {(activeTab === "all" || activeTab === "select") && (
            <section className="rounded-2xl border border-stroke/70 bg-white p-20 shadow-drop-s space-y-16">
              <div className="flex items-center justify-between border-b border-stroke/40 pb-10">
                <div className="flex items-center gap-8">
                  <h3 className="m-0 text-title-3 font-medium text-fontcolor">
                    2. Select 下拉選單
                  </h3>
                  <code className="rounded bg-bg px-6 py-2 text-caption-2 font-mono text-primary">
                    h-[36px] / 圓角 22px (rounded-4xl)
                  </code>
                </div>
                <span className="text-caption-2 text-description">
                  元件路徑：src/component/ui/select.jsx
                </span>
              </div>

              {/* 狀態矩陣 */}
              <div>
                <h4 className="m-0 mb-8 text-label-3 font-medium text-description">
                  【靜態規範狀態展示：包含 Default、Hover、Focus、Error 未聚焦、Error Hover 懸停、Error Focus 聚焦、Disabled】
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8">
                  <div className="space-y-4">
                    <span className="text-caption-2 font-medium text-secondary">
                      預設態 (Default)
                    </span>
                    <Select
                      status="default"
                      options={selectOptions}
                      defaultValue="gpt-4o"
                    />
                  </div>

                  <div className="space-y-4">
                    <span className="text-caption-2 font-medium text-secondary">
                      懸停態 (Hover)
                    </span>
                    <Select
                      status="hover"
                      options={selectOptions}
                      defaultValue="gpt-4o"
                    />
                  </div>

                  <div className="space-y-4">
                    <span className="text-caption-2 font-medium text-secondary">
                      聚焦態 (Focus)
                    </span>
                    <Select
                      status="focus"
                      options={selectOptions}
                      defaultValue="gpt-4o"
                    />
                  </div>

                  <div className="space-y-4">
                    <span className="text-caption-2 font-medium text-error">
                      錯誤態 (Error)
                    </span>
                    <Select
                      status="error"
                      options={selectOptions}
                      defaultValue=""
                      placeholder="未選必填"
                      errorMessage="純紅框"
                    />
                  </div>

                  <div className="space-y-4">
                    <span className="text-caption-2 font-medium text-error">
                      錯誤懸停 (Err Hover)
                    </span>
                    <Select
                      status="error-hover"
                      options={selectOptions}
                      defaultValue=""
                      placeholder="未選必填"
                      errorMessage="紅框+微光暈"
                    />
                  </div>

                  <div className="space-y-4">
                    <span className="text-caption-2 font-medium text-error">
                      錯誤聚焦 (Err Focus)
                    </span>
                    <Select
                      status="error-focus"
                      options={selectOptions}
                      defaultValue=""
                      placeholder="未選必填"
                      errorMessage="紅框+聚焦環"
                    />
                  </div>

                  <div className="space-y-4">
                    <span className="text-caption-2 font-medium text-secondary">
                      停用態 (Disabled)
                    </span>
                    <Select
                      status="disabled"
                      options={selectOptions}
                      defaultValue="gemini-1.5-pro"
                    />
                  </div>
                </div>
              </div>

              {/* 互動沙盒 */}
              <div className="rounded-xl bg-bg/50 p-12 border border-stroke/50">
                <div className="flex items-center justify-between mb-8">
                  <span className="text-label-3 font-medium text-fontcolor">
                    ⚡ 互動式試用 (點擊可展開浮層選單，支援鍵盤 Escape 關閉)
                  </span>
                  <span className="text-caption-2 text-description font-mono">
                    已選取: {interactiveSelect}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <Select
                    label="AI 語言模型切換"
                    options={selectOptions}
                    value={interactiveSelect}
                    onChange={(val) => setInteractiveSelect(val)}
                    helperText="選擇後自動載入該模型之超參數配置"
                  />
                  <Select
                    label="HTTP 請求方法"
                    options={[
                      { value: "GET", label: "GET (取得資料)" },
                      { value: "POST", label: "POST (新增資源)" },
                      { value: "PUT", label: "PUT (更新資源)" },
                      { value: "DELETE", label: "DELETE (刪除資源)" },
                    ]}
                    defaultValue="POST"
                    helperText="符合 RESTful API 規格之通訊請求"
                  />
                </div>
              </div>
            </section>
          )}

          {/* 3. Switch 元件展示 */}
          {(activeTab === "all" || activeTab === "switch") && (
            <section className="rounded-2xl border border-stroke/70 bg-white p-20 shadow-drop-s space-y-16">
              <div className="flex items-center justify-between border-b border-stroke/40 pb-10">
                <div className="flex items-center gap-8">
                  <h3 className="m-0 text-title-3 font-medium text-fontcolor">
                    3. Switch 開關切換
                  </h3>
                  <code className="rounded bg-bg px-6 py-2 text-caption-2 font-mono text-primary">
                    整列 h-36 / 標準開關寬 44px / 左右跳動彈力回彈效果
                  </code>
                </div>
                <span className="text-caption-2 text-description">
                  元件路徑：src/component/ui/switch.jsx
                </span>
              </div>

              {/* 狀態矩陣 */}
              <div>
                <h4 className="m-0 mb-8 text-label-3 font-medium text-description">
                  【靜態規範狀態展示】
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
                  <div className="rounded-xl border border-stroke/60 p-8 space-y-4">
                    <span className="text-caption-2 font-medium text-secondary">
                      預設關閉 (Default Off)
                    </span>
                    <Switch status="default" label="快取模式" />
                  </div>

                  <div className="rounded-xl border border-stroke/60 p-8 space-y-4">
                    <span className="text-caption-2 font-medium text-secondary">
                      選取開啟 (Checked On)
                    </span>
                    <Switch status="checked" label="即時串流" />
                  </div>

                  <div className="rounded-xl border border-stroke/60 p-8 space-y-4">
                    <span className="text-caption-2 font-medium text-secondary">
                      懸停態 (Hover)
                    </span>
                    <Switch status="hover" label="重試機制" />
                  </div>

                  <div className="rounded-xl border border-stroke/60 p-8 space-y-4">
                    <span className="text-caption-2 font-medium text-secondary">
                      聚焦態 (Focus)
                    </span>
                    <Switch status="focus" label="除錯日誌" />
                  </div>

                  <div className="rounded-xl border border-stroke/60 p-8 space-y-4">
                    <span className="text-caption-2 font-medium text-secondary">
                      停用態 (Disabled)
                    </span>
                    <Switch status="disabled" label="系統鎖定" />
                  </div>
                </div>
              </div>

              {/* 互動沙盒 */}
              <div className="rounded-xl bg-bg/50 p-12 border border-stroke/50">
                <div className="flex items-center justify-between mb-8">
                  <span className="text-label-3 font-medium text-fontcolor">
                    ⚡ 互動式試用 (整列 36px 佈局，點擊旋鈕或標籤皆可切換)
                  </span>
                  <span className="text-caption-2 text-description font-mono">
                    當前狀態: {interactiveSwitch ? "開啟 (ON)" : "關閉 (OFF)"}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="rounded-xl bg-white p-12 border border-stroke/60">
                    <Switch
                      label="串流回應 (Streaming Response)"
                      description="以即時打字機方式逐步回傳模型文字"
                      checked={interactiveSwitch}
                      onChange={setInteractiveSwitch}
                    />
                  </div>
                  <div className="rounded-xl bg-white p-12 border border-stroke/60">
                    <Switch
                      label="自動錯誤重試 (Auto Retry)"
                      description="網路逾時或 5xx 錯誤時自動重試最多 3 次"
                      defaultChecked={false}
                    />
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* 4. Slider 元件展示 */}
          {(activeTab === "all" || activeTab === "slider") && (
            <section className="rounded-2xl border border-stroke/70 bg-white p-20 shadow-drop-s space-y-16">
              <div className="flex items-center justify-between border-b border-stroke/40 pb-10">
                <div className="flex items-center gap-8">
                  <h3 className="m-0 text-title-3 font-medium text-fontcolor">
                    4. Slider 數值滑桿
                  </h3>
                  <code className="rounded bg-bg px-6 py-2 text-caption-2 font-mono text-primary">
                    軌道高度 12px / 滑動球直徑 10px
                  </code>
                </div>
                <span className="text-caption-2 text-description">
                  元件路徑：src/component/ui/slider.jsx
                </span>
              </div>

              {/* 狀態矩陣 */}
              <div>
                <h4 className="m-0 mb-8 text-label-3 font-medium text-description">
                  【靜態規範狀態展示】
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                  <div className="rounded-xl border border-stroke/60 p-8 space-y-4">
                    <span className="text-caption-2 font-medium text-secondary">
                      預設態 (Default)
                    </span>
                    <Slider
                      status="default"
                      label="溫度 (Temperature)"
                      defaultValue={70}
                      showValue
                      unit="%"
                    />
                  </div>

                  <div className="rounded-xl border border-stroke/60 p-8 space-y-4">
                    <span className="text-caption-2 font-medium text-secondary">
                      懸停態 (Hover - 旋鈕高亮)
                    </span>
                    <Slider
                      status="hover"
                      label="延遲等待 (Delay)"
                      defaultValue={40}
                      showValue
                      unit="s"
                    />
                  </div>

                  <div className="rounded-xl border border-stroke/60 p-8 space-y-4">
                    <span className="text-caption-2 font-medium text-secondary">
                      作用態 (Active - 拖曳中放大)
                    </span>
                    <Slider
                      status="active"
                      label="限制筆數 (Limit)"
                      defaultValue={85}
                      showValue
                      unit="筆"
                    />
                  </div>

                  <div className="rounded-xl border border-stroke/60 p-8 space-y-4">
                    <span className="text-caption-2 font-medium text-secondary">
                      停用態 (Disabled)
                    </span>
                    <Slider
                      status="disabled"
                      label="最大 Token 數"
                      defaultValue={50}
                      showValue
                      unit="k"
                    />
                  </div>
                </div>
              </div>

              {/* 互動沙盒 */}
              <div className="rounded-xl bg-bg/50 p-12 border border-stroke/50">
                <div className="flex items-center justify-between mb-8">
                  <span className="text-label-3 font-medium text-fontcolor">
                    ⚡ 互動式試用 (可拖曳滑桿、支援方向鍵精準調整)
                  </span>
                  <span className="text-caption-2 text-description font-mono">
                    當前值: {interactiveSlider} / 100
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="rounded-xl bg-white p-12 border border-stroke/60">
                    <Slider
                      label="創意發散度 (Temperature 0 ~ 1.0)"
                      min={0}
                      max={100}
                      step={5}
                      value={interactiveSlider}
                      onChange={setInteractiveSlider}
                      formatValue={(val) => (val / 100).toFixed(2)}
                    />
                  </div>
                  <div className="rounded-xl bg-white p-12 border border-stroke/60">
                    <Slider
                      label="延遲時間 (Delay Seconds)"
                      min={1}
                      max={60}
                      step={1}
                      defaultValue={15}
                      unit=" 秒"
                    />
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* 5. Textarea 元件展示 */}
          {(activeTab === "all" || activeTab === "textarea") && (
            <section className="rounded-2xl border border-stroke/70 bg-white p-20 shadow-drop-s space-y-16">
              <div className="flex items-center justify-between border-b border-stroke/40 pb-10">
                <div className="flex items-center gap-8">
                  <h3 className="m-0 text-title-3 font-medium text-fontcolor">
                    5. Textarea 多行文字輸入
                  </h3>
                  <code className="rounded bg-bg px-6 py-2 text-caption-2 font-mono text-primary">
                    固定初高 72px / 超量自動延伸 / 禁止手動拖拉
                  </code>
                </div>
                <span className="text-caption-2 text-description">
                  元件路徑：src/component/ui/textarea.jsx
                </span>
              </div>

              {/* 狀態矩陣 */}
              <div>
                <h4 className="m-0 mb-8 text-label-3 font-medium text-description">
                  【靜態規範狀態展示：完全參照 Input / Select 包含 Default、Hover、Focus、Error 未聚焦、Error Hover、Error Focus、Disabled】
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8">
                  <div className="space-y-4">
                    <span className="text-caption-2 font-medium text-secondary">
                      預設態 (Default)
                    </span>
                    <Textarea
                      status="default"
                      rows={2}
                      defaultValue="SELECT * FROM table;"
                    />
                  </div>

                  <div className="space-y-4">
                    <span className="text-caption-2 font-medium text-secondary">
                      懸停態 (Hover)
                    </span>
                    <Textarea
                      status="hover"
                      rows={2}
                      defaultValue="SELECT * FROM table;"
                    />
                  </div>

                  <div className="space-y-4">
                    <span className="text-caption-2 font-medium text-secondary">
                      聚焦態 (Focus)
                    </span>
                    <Textarea
                      status="focus"
                      rows={2}
                      defaultValue="SELECT * FROM table;"
                    />
                  </div>

                  <div className="space-y-4">
                    <span className="text-caption-2 font-medium text-error">
                      錯誤態 (Error)
                    </span>
                    <Textarea
                      status="error"
                      rows={2}
                      defaultValue="JSON 語法錯誤"
                      errorMessage="純紅框提示"
                    />
                  </div>

                  <div className="space-y-4">
                    <span className="text-caption-2 font-medium text-error">
                      錯誤懸停 (Err Hover)
                    </span>
                    <Textarea
                      status="error-hover"
                      rows={2}
                      defaultValue="JSON 語法錯誤"
                      errorMessage="紅框+微光暈"
                    />
                  </div>

                  <div className="space-y-4">
                    <span className="text-caption-2 font-medium text-error">
                      錯誤聚焦 (Err Focus)
                    </span>
                    <Textarea
                      status="error-focus"
                      rows={2}
                      defaultValue="JSON 語法錯誤"
                      errorMessage="紅框+聚焦環"
                    />
                  </div>

                  <div className="space-y-4">
                    <span className="text-caption-2 font-medium text-secondary">
                      停用態 (Disabled)
                    </span>
                    <Textarea
                      status="disabled"
                      rows={2}
                      defaultValue="唯讀指令內容"
                    />
                  </div>
                </div>
              </div>

              {/* 互動沙盒 */}
              <div className="rounded-xl bg-bg/50 p-12 border border-stroke/50">
                <div className="flex items-center justify-between mb-8">
                  <span className="text-label-3 font-medium text-fontcolor">
                    ⚡ 互動式試用 (提示詞編寫 / 程式碼 / SQL 查詢)
                  </span>
                </div>
                <Textarea
                  label="系統提示詞 (System Prompt Instruction)"
                  rows={3}
                  value={interactiveTextarea}
                  onChange={(e) => setInteractiveTextarea(e.target.value)}
                  placeholder="請輸入系統指令..."
                  helperText="支援變數插入語法如 {{input.text}}"
                />
              </div>
            </section>
          )}

          {/* 6. 實境節點配置範例 (Live Node Config Demo) */}
          {(activeTab === "all" || activeTab === "realworld") && (
            <section className="rounded-2xl border-2 border-primary/40 bg-white p-20 shadow-drop-s space-y-16">
              <div className="flex items-center justify-between border-b border-stroke/40 pb-10">
                <div className="flex items-center gap-8">
                  <span className="flex h-24 w-24 items-center justify-center rounded-lg bg-primary text-white text-caption-1">
                    🤖
                  </span>
                  <h3 className="m-0 text-title-3 font-medium text-fontcolor">
                    節點詳情配置實景模擬：以「語言模型 (LLM)」為例
                  </h3>
                </div>
                <span className="rounded-full bg-primary/10 px-10 py-4 text-caption-2 font-semibold text-primary">
                  高度統一 36px 表單佈局
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
                {/* 模擬右上詳情卡片 */}
                <div className="rounded-2xl border border-stroke bg-bg/30 p-16 space-y-12">
                  <div className="flex items-center justify-between border-b border-stroke/50 pb-8">
                    <div className="flex items-center gap-6">
                      <span className="text-primary font-medium text-label-3">
                        ✦ 節點屬性設定
                      </span>
                    </div>
                    <span className="text-caption-2 text-description font-mono">
                      ID: node-llm-01
                    </span>
                  </div>

                  {/* 1. 節點名稱 (Input h-36) */}
                  <Input
                    label="節點顯示名稱"
                    defaultValue="客服滿意度智慧判斷"
                    prefixIcon={
                      <svg viewBox="0 0 24 24" className="h-16 w-16 stroke-current fill-none stroke-2">
                        <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                      </svg>
                    }
                  />

                  {/* 2. 模型選擇 (Select h-36) */}
                  <Select
                    label="使用之基礎模型 (Model)"
                    options={selectOptions}
                    defaultValue="claude-3-5-sonnet"
                  />

                  {/* 3. 開關切換 (Switch) */}
                  <Switch
                    label="即時打字串流 (Stream Output)"
                    defaultChecked={true}
                  />

                  {/* 4. 數值滑桿 (Slider) */}
                  <Slider
                    label="生成發散度 (Temperature)"
                    min={0}
                    max={100}
                    step={1}
                    defaultValue={70}
                    formatValue={(v) => (v / 100).toFixed(2)}
                  />

                  {/* 5. 系統提示詞 (Textarea) */}
                  <Textarea
                    label="Prompt 提示詞樣板"
                    rows={2}
                    defaultValue="請依據 {{input.review}} 判斷情緒為 Positive 或 Negative。"
                  />
                </div>

                {/* 說明與優勢 */}
                <div className="flex flex-col justify-between rounded-2xl bg-primary/5 p-16 border border-primary/10">
                  <div className="space-y-12">
                    <h4 className="m-0 text-title-3 font-medium text-primary">
                      ✨ 36px 統一規範設計特點
                    </h4>
                    <ul className="m-0 list-disc pl-16 space-y-6 text-label-3 text-fontcolor">
                      <li>
                        <strong>高度一致性：</strong>Input、Select、Slider、Switch 均以標準 36px (h-36) 定位，在右上抽屜/浮動卡片中排版整齊俐落。
                      </li>
                      <li>
                        <strong>狀態覆蓋完整：</strong>皆包含 Default、Hover、Focus、Disabled、Error/Checked 狀態，支援靜態驗證與動態互動。
                      </li>
                      <li>
                        <strong>目錄規範：</strong>元件位於 <code>src/components/ui/</code> 並同步鏡像匯出至 <code>src/component/ui/</code>，符合您的路徑指定。
                      </li>
                      <li>
                        <strong>可立即配置 28 個節點：</strong>各節點的參數型別皆能直接對應至此 5 大元件。
                      </li>
                    </ul>
                  </div>

                  <div className="mt-16 flex items-center justify-between border-t border-primary/20 pt-12">
                    <span className="text-caption-1 text-description">
                      檢查滿意後，點擊右方按鈕即可進入畫布或確認下一步
                    </span>
                    <Button variant="primary" onClick={onClose}>
                      確認元件規範無誤
                    </Button>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* 10. DatePicker & TimePicker (Figma 原生規格) */}
          {(activeTab === "all" || activeTab === "pickers") && (
            <section className="space-y-16">
              <div className="flex items-center justify-between border-b border-stroke/60 pb-8">
                <div className="flex items-center gap-8">
                  <span className="flex h-28 w-28 items-center justify-center rounded-lg bg-primary/10 text-primary text-sm font-bold">
                    📅
                  </span>
                  <h3 className="m-0 text-title-3 font-medium text-fontcolor">
                    DatePicker & TimePicker 日期與時間選擇器
                  </h3>
                </div>
                <div className="flex items-center gap-6">
                  <span className="rounded-full bg-primary/10 px-10 py-4 text-caption-2 font-semibold text-primary">
                    高度統一 36px
                  </span>
                  <span className="rounded-full bg-success/10 px-10 py-4 text-caption-2 font-semibold text-success">
                    全圓角 22px (rounded-4xl)
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
                {/* DatePicker 展示卡片 */}
                <div className="rounded-2xl border border-stroke bg-white p-16 space-y-12 shadow-drop-s">
                  <div className="flex items-center justify-between border-b border-stroke/50 pb-8">
                    <span className="text-primary font-medium text-label-3">
                      🗓️ DatePicker 日期選擇器 (Ghost 按鈕狀態 + 月曆下拉)
                    </span>
                    <span className="text-caption-2 text-description">
                      值: {interactiveDate}
                    </span>
                  </div>
                  <div className="space-y-8">
                    <label className="text-caption-1 font-medium text-fontcolor block">
                      可輸入模式 (Editable)
                    </label>
                    <Datepicker
                      value={interactiveDate}
                      onChange={setInteractiveDate}
                      editable={true}
                    />
                  </div>
                </div>

                {/* TimePicker 展示卡片 */}
                <div className="rounded-2xl border border-stroke bg-white p-16 space-y-12 shadow-drop-s">
                  <div className="flex items-center justify-between border-b border-stroke/50 pb-8">
                    <span className="text-primary font-medium text-label-3">
                      ⏰ TimePicker 時間選擇器 (12 小時制滾輪 + AM/PM)
                    </span>
                    <span className="text-caption-2 text-description">
                      值: {interactiveTime}
                    </span>
                  </div>
                  <div className="space-y-8">
                    <label className="text-caption-1 font-medium text-fontcolor block">
                      12 小時制滾輪滾動與 AM/PM 切換
                    </label>
                    <TimePicker
                      value={interactiveTime}
                      onChange={setInteractiveTime}
                      editable={true}
                    />
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Footer */}
        <div className="flex shrink-0 items-center justify-between border-t border-stroke/60 bg-white px-24 py-12">
          <span className="text-caption-1 text-description">
            提示：您可隨時點擊頂部導航列的「🎨 UI 元件庫展示」按鈕再次開啟本視窗。
          </span>
          <div className="flex items-center gap-8">
            <Button variant="ghost" onClick={onClose}>
              關閉視窗
            </Button>
            <Button variant="primary" onClick={onClose}>
              確認並繼續
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UIShowcaseModal;

