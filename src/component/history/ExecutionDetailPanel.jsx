import { useState } from "react";
import Button from "../ui/button";

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

/* 步驟專用圖示 */
function StepIcon({ type }) {
  if (type === "time") {
    return (
      <div className="w-28 h-28 rounded-full bg-[#5D84A2] text-white flex items-center justify-center shrink-0">
        <svg className="w-14 h-14" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3" />
          <path d="M8 5v3.5l2 1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      </div>
    );
  }
  if (type === "code") {
    return (
      <div className="w-28 h-28 rounded-full bg-[#3F3F46] text-white flex items-center justify-center shrink-0">
        <svg className="w-14 h-14" viewBox="0 0 16 16" fill="none">
          <path d="m5.5 5-3 3 3 3M10.5 5l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    );
  }
  if (type === "sheets") {
    return (
      <div className="w-28 h-28 rounded-full bg-[#10B981] text-white flex items-center justify-center shrink-0">
        <svg className="w-14 h-14" viewBox="0 0 16 16" fill="none">
          <rect x="3.5" y="2.5" width="9" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
          <path d="M6 6h4M6 8.5h4M6 11h2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </div>
    );
  }
  if (type === "telegram") {
    return (
      <div className="w-28 h-28 rounded-full bg-[#0EA5E9] text-white flex items-center justify-center shrink-0">
        <svg className="w-14 h-14" viewBox="0 0 16 16" fill="none">
          <path d="m13.5 2.5-11 4.5 4 1.5 1.5 4 2-2.5 3.5 2.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
        </svg>
      </div>
    );
  }
  if (type === "docs") {
    return (
      <div className="w-28 h-28 rounded-full bg-[#3B82F6] text-white flex items-center justify-center shrink-0">
        <svg className="w-14 h-14" viewBox="0 0 16 16" fill="none">
          <rect x="3.5" y="2.5" width="9" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
          <path d="M6 5.5h4M6 8h4M6 10.5h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </div>
    );
  }
  // db
  return (
    <div className="w-28 h-28 rounded-full bg-[#71717A] text-white flex items-center justify-center shrink-0">
      <svg className="w-14 h-14" viewBox="0 0 16 16" fill="none">
        <ellipse cx="8" cy="4.5" rx="5" ry="2" stroke="currentColor" strokeWidth="1.2" />
        <path d="M3 4.5v7c0 1.1 2.2 2 5 2s5-.9 5-2v-7M3 8c0 1.1 2.2 2 5 2s5-.9 5-2" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    </div>
  );
}

function highlightJson(jsonStr) {
  if (!jsonStr) return "";
  const safeStr = jsonStr
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  return safeStr.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    (match) => {
      let cls = "text-[#7C3AED]"; // number
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = "text-[#2563EB] font-medium"; // key
        } else {
          cls = "text-[#059669]"; // string
        }
      } else if (/true|false/.test(match)) {
        cls = "text-[#D97706] font-medium"; // boolean
      } else if (/null/.test(match)) {
        cls = "text-[#94A3B8] italic"; // null
      }
      return `<span class="${cls}">${match}</span>`;
    }
  );
}

function getExecutionJson(run, filter = "all") {
  const fullData = {
    execution_id: run.id,
    timestamp: run.startTime,
    duration: run.duration,
    status: run.status,
    trigger: {
      type: run.triggerType || "cron",
      label: run.trigger || "排程觸發",
      schedule: "0 9 * * *",
      timezone: "Asia/Taipei (UTC+8)",
    },
    inputs: {
      rss_feeds: [
        "https://uxdesign.cc/feed",
        "https://sidebar.io/feed",
        "https://medium.com/topic/design",
      ],
      keywords: ["AI", "UI/UX", "Product Design"],
      language: "zh-TW",
      max_articles: 15,
    },
    outputs: {
      total_extracted: 15,
      ai_model: "Gemini 1.5 Pro",
      summaries_generated: 15,
      destinations: {
        google_sheets: {
          status: "success",
          rows_appended: 15,
          sheet_id: "sheet_2026_daily_digest",
        },
        google_docs: {
          status: "success",
          document_id: "doc_digest_20261014",
          title: "2026-10-14 每日最新設計文章摘要",
        },
        database: {
          status: "success",
          table: "daily_articles",
          affected_rows: 15,
        },
        telegram_bot: {
          status: run.status === "error" ? "failed" : "success",
          error_code: run.status === "error" ? 400 : null,
          message: run.status === "error" ? "Bad Request: chat not found" : "sent",
        },
      },
    },
    metrics: {
      memory_usage_mb: 142.5,
      cpu_time_ms: run.duration ? parseFloat(run.duration) * 1000 : 8400,
      tokens_consumed: 4280,
    },
  };

  if (filter === "inputs") {
    return JSON.stringify({ trigger: fullData.trigger, inputs: fullData.inputs }, null, 2);
  }
  if (filter === "outputs") {
    return JSON.stringify({ outputs: fullData.outputs, metrics: fullData.metrics }, null, 2);
  }
  return JSON.stringify(fullData, null, 2);
}

/**
 * 紀錄詳情面板 (右側獨立白底圓角卡片)
 * 1:1 還原 Figma 設計稿
 */
export function ExecutionDetailPanel({
  run,
  onClose,
  onBackToEdit,
  onRunWorkflow,
  className = "",
}) {
  const [activeTab, setActiveTab] = useState("nodes"); // "nodes" | "data"
  const [jsonFilter, setJsonFilter] = useState("all"); // "all" | "inputs" | "outputs"
  const [copied, setCopied] = useState(false);

  const handleCopyJson = () => {
    if (run) {
      navigator.clipboard?.writeText(getExecutionJson(run, jsonFilter));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!run) return null;

  return (
    <div
      data-component="ExecutionDetailPanel"
      className={cx(
        "flex flex-col h-full w-full rounded-4xl bg-white border border-stroke shadow-drop-s overflow-hidden select-none",
        className,
      )}
    >
      {/* 1. 頂部標題 (已依需求移除關閉按鈕) */}
      <div className="flex items-center justify-between px-20 py-16 border-b border-stroke/40 shrink-0">
        <h2 className="text-title-3 font-semibold text-fontcolor m-0">
          紀錄詳情
        </h2>
      </div>

      {/* 2. 可捲動內容主體 */}
      <div className="flex-1 min-h-0 overflow-y-auto px-20 py-16 space-y-16">
        
        {/* A. 編號與狀態標籤 */}
        <div className="flex items-center gap-10">
          <span className="text-[26px] font-bold text-fontcolor tracking-tight leading-none">
            {run.id}
          </span>
          {run.status === "error" && (
            <span className="px-8 py-1 rounded-full text-caption-2 font-medium bg-[#FEF2F2] text-[#EF4444] border border-[#FEE2E2]">
              失敗
            </span>
          )}
          {run.status === "success" && (
            <span className="px-8 py-1 rounded-full text-caption-2 font-medium bg-[#ECFDF5] text-[#10B981] border border-[#D1FAE5]">
              成功
            </span>
          )}
          {run.status === "running" && (
            <span className="px-8 py-1 rounded-full text-caption-2 font-medium bg-blue-50 text-blue-600 border border-blue-200">
              執行中
            </span>
          )}
        </div>

        {/* B. 2x2 時間資訊區塊 */}
        <div className="rounded-2xl bg-[#F8FAFC] p-16 border border-stroke/40 space-y-12">
          <div className="grid grid-cols-2 gap-12">
            <div>
              <span className="text-caption-2 text-description block">開始時間</span>
              <span className="text-body-3 text-fontcolor font-medium mt-4 block">
                {run.startTime || "2026/10/14 09:00:00"}
              </span>
            </div>
            <div>
              <span className="text-caption-2 text-description block">結束時間</span>
              <span className="text-body-3 text-fontcolor font-medium mt-4 block">
                {run.endTime || "09:00:08.400"}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-12">
            <div>
              <span className="text-caption-2 text-description block">觸發方式</span>
              <span className="text-body-3 text-fontcolor font-medium mt-4 block">
                {run.trigger || "排程觸發"}
              </span>
            </div>
            <div>
              <span className="text-caption-2 text-description block">執行時間</span>
              <span className="text-body-3 text-fontcolor font-medium mt-4 block">
                {run.duration || "8.4 秒"}
              </span>
            </div>
          </div>
        </div>

        {/* C. 錯誤醒目警示卡片 */}
        {run.status === "error" && (
          <div className="rounded-2xl bg-[#FEF2F2] border border-[#FEE2E2] p-16 space-y-6">
            <span className="text-body-3 font-semibold text-[#EF4444] block">
              {run.errorTitle || "Telegram Bot 發送失敗"}
            </span>
            <p className="text-caption-1 text-fontcolor leading-relaxed m-0">
              {run.errorDesc || "找不到指定聊天室（400）。請確認聊天室 ID，並將機器人加入聊天室後重新執行。"}
            </p>
          </div>
        )}

        {/* D. 分頁按鈕：節點紀錄 / 執行資料 */}
        <div className="flex items-center gap-8 pt-2">
          <button
            type="button"
            onClick={() => setActiveTab("nodes")}
            className={cx(
              "h-[36px] px-16 inline-flex items-center justify-center rounded-full text-caption-1 font-semibold transition-all cursor-pointer select-none",
              activeTab === "nodes"
                ? "bg-[#5D84A2] text-white shadow-xs"
                : "text-description hover:text-fontcolor hover:bg-bg/40",
            )}
          >
            節點紀錄
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("data")}
            className={cx(
              "h-[36px] px-16 inline-flex items-center justify-center rounded-full text-caption-1 font-semibold transition-all cursor-pointer select-none",
              activeTab === "data"
                ? "bg-[#5D84A2] text-white shadow-xs"
                : "text-description hover:text-fontcolor hover:bg-bg/40",
            )}
          >
            執行資料
          </button>
        </div>

        {/* 節點紀錄 Tab 內容 */}
        {activeTab === "nodes" && (
          <div className="space-y-16 animate-in fade-in duration-150">
            {/* E. 節點摘要列 */}
            <div className="flex items-center justify-between text-caption-2 text-description pt-2">
              <span>
                {run.totalSteps || 6} 個節點 · {run.successCount || 5} 成功 / {(run.totalSteps || 6) - (run.successCount || 5)} 失敗
              </span>
              <span>分支平行執行</span>
            </div>

            {/* F. 6 大節點步驟清單 (完全對齊附圖) */}
            <div className="space-y-4">
              {(run.steps || []).map((step) => {
                const isError = step.status === "error";

                return (
                  <div
                    key={step.id}
                    className={cx(
                      "flex items-center justify-between p-8 rounded-xl transition-colors",
                      isError
                        ? "bg-[#FEF2F2] border border-[#FEE2E2]"
                        : "hover:bg-[#F8FAFC]",
                    )}
                  >
                    {/* 節點圖示與標題 */}
                    <div className="flex items-center gap-10">
                      <StepIcon type={step.iconType} />
                      <div>
                        <span className="text-body-3 font-medium text-fontcolor block leading-tight">
                          {step.name}
                        </span>
                        <span className="text-caption-2 text-description block mt-2">
                          {step.subtitle}
                        </span>
                      </div>
                    </div>

                    {/* 耗時與狀態圖示 */}
                    <div className="flex items-center gap-8">
                      <span className="text-caption-2 font-mono text-description">
                        {step.time}
                      </span>
                      {step.status === "success" && (
                        <span className="text-[#10B981] font-bold text-caption-1">✓</span>
                      )}
                      {step.status === "error" && (
                        <span className="text-[#EF4444] font-bold text-caption-1">✕</span>
                      )}
                      {step.status === "running" && (
                        <span className="text-[#5D84A2] font-bold text-caption-2 animate-pulse">●</span>
                      )}
                      {step.status === "pending" && (
                        <span className="text-description text-caption-2">-</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* G. 錯誤回應 JSON 區塊 */}
            {run.status === "error" && (
              <div className="rounded-2xl bg-[#F8FAFC] border border-stroke/40 p-12 space-y-4">
                <span className="text-caption-2 text-description block">
                  Telegram Bot - 錯誤回應
                </span>
                <pre className="m-0 font-mono text-[11px] text-fontcolor whitespace-pre-wrap leading-relaxed">
                  {run.errorJson || '{\n  "ok": false, "error_code": 400,\n  "description": "Bad Request: chat not found"\n}'}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* 執行資料 Tab 內容 */}
        {activeTab === "data" && (
          <div className="space-y-16 animate-in fade-in duration-150 text-left">
            {/* 頂部數據流概要列 (對齊節點紀錄的資訊列) */}
            <div className="flex items-center justify-between text-caption-2 text-description pt-2">
              <span>4 項輸入參數 · 4 個輸出管道</span>
              <span className="font-mono">Payload: 12.8 KB</span>
            </div>

            {/* 1. 精緻 3 大效能指標卡片 */}
            <div className="grid grid-cols-3 gap-8">
              {/* 傳輸資料 */}
              <div className="rounded-xl bg-[#F8FAFC] border border-stroke/40 px-10 py-8 flex flex-col justify-between hover:bg-white hover:border-stroke/80 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-description leading-none">傳輸資料</span>
                  <div className="w-18 h-18 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                    <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                  </div>
                </div>
                <div className="mt-6 flex items-baseline gap-3">
                  <span className="text-[18px] font-bold text-fontcolor font-mono leading-none">384</span>
                  <span className="text-[11px] text-description leading-none">KB</span>
                </div>
              </div>

              {/* 處理項目 */}
              <div className="rounded-xl bg-[#F8FAFC] border border-stroke/40 px-10 py-8 flex flex-col justify-between hover:bg-white hover:border-stroke/80 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-description leading-none">處理項目</span>
                  <div className="w-18 h-18 rounded-md bg-[#10B981]/10 text-[#10B981] flex items-center justify-center">
                    <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                    </svg>
                  </div>
                </div>
                <div className="mt-6 flex items-baseline gap-3">
                  <span className="text-[18px] font-bold text-[#369379] font-mono leading-none">15</span>
                  <span className="text-[11px] text-description leading-none">篇</span>
                </div>
              </div>

              {/* AI Tokens */}
              <div className="rounded-xl bg-[#F8FAFC] border border-stroke/40 px-10 py-8 flex flex-col justify-between hover:bg-white hover:border-stroke/80 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-description leading-none">AI Tokens</span>
                  <div className="w-18 h-18 rounded-md bg-[#8B5CF6]/10 text-[#8B5CF6] flex items-center justify-center">
                    <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3Z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-6 flex items-baseline gap-3">
                  <span className="text-[18px] font-bold text-[#7C3AED] font-mono leading-none">4,280</span>
                  <span className="text-[11px] text-description leading-none">Tokens</span>
                </div>
              </div>
            </div>

            {/* 2. 輸入參數 (Inputs) */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-caption-1 font-semibold text-fontcolor">
                  輸入資料 (Inputs)
                </span>
                <span className="text-[10px] font-medium text-primary bg-primary/10 px-8 py-2 rounded-full font-mono">
                  排程觸發器
                </span>
              </div>

              <div className="rounded-2xl bg-[#F8FAFC] border border-stroke/40 divide-y divide-stroke/30 overflow-hidden text-caption-2">
                {/* trigger.cron */}
                <div className="px-12 py-8 flex items-center justify-between gap-8 hover:bg-white/60 transition-colors">
                  <span className="font-mono text-[11px] text-primary bg-primary/5 px-6 py-1.5 rounded-md border border-primary/20 font-medium">
                    trigger.cron
                  </span>
                  <div className="flex items-center gap-6">
                    <span className="font-mono text-fontcolor font-medium">0 9 * * *</span>
                    <span className="text-[10px] text-description bg-white px-6 py-1 rounded-full border border-stroke/40">
                      每日 09:00
                    </span>
                  </div>
                </div>

                {/* workflow.timezone */}
                <div className="px-12 py-8 flex items-center justify-between gap-8 hover:bg-white/60 transition-colors">
                  <span className="font-mono text-[11px] text-primary bg-primary/5 px-6 py-1.5 rounded-md border border-primary/20 font-medium">
                    workflow.timezone
                  </span>
                  <span className="font-mono text-fontcolor font-medium">Asia/Taipei (UTC+8)</span>
                </div>

                {/* sources.feeds */}
                <div className="px-12 py-8 flex items-center justify-between gap-8 hover:bg-white/60 transition-colors">
                  <span className="font-mono text-[11px] text-primary bg-primary/5 px-6 py-1.5 rounded-md border border-primary/20 font-medium">
                    sources.feeds
                  </span>
                  <div className="flex items-center gap-4 flex-wrap justify-end">
                    <span className="text-[10px] text-fontcolor bg-white px-6 py-1 rounded-full border border-stroke/40 font-mono">
                      uxdesign.cc
                    </span>
                    <span className="text-[10px] text-fontcolor bg-white px-6 py-1 rounded-full border border-stroke/40 font-mono">
                      sidebar.io
                    </span>
                    <span className="text-[10px] text-description bg-white px-6 py-1 rounded-full border border-stroke/30">
                      +13 來源
                    </span>
                  </div>
                </div>

                {/* ai.model */}
                <div className="px-12 py-8 flex items-center justify-between gap-8 hover:bg-white/60 transition-colors">
                  <span className="font-mono text-[11px] text-primary bg-primary/5 px-6 py-1.5 rounded-md border border-primary/20 font-medium">
                    ai.model
                  </span>
                  <div className="flex items-center gap-6">
                    <span className="flex items-center gap-4 text-caption-2 font-medium text-fontcolor bg-white px-8 py-1.5 rounded-full border border-stroke/40">
                      <svg className="w-10 h-10 text-[#8B5CF6]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3Z" />
                      </svg>
                      Gemini 1.5 Pro
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. 各節點輸出結果 (Outputs) - 完美復刻節點紀錄行格式 */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-caption-1 font-semibold text-fontcolor">
                  節點輸出 (Outputs)
                </span>
                <span className="text-caption-2 text-description">
                  4 個目標管道
                </span>
              </div>

              <div className="space-y-4">
                {/* Google Sheets */}
                <div className="flex items-center justify-between p-8 rounded-xl hover:bg-[#F8FAFC] transition-colors">
                  <div className="flex items-center gap-10">
                    <StepIcon type="sheets" />
                    <div>
                      <span className="text-body-3 font-medium text-fontcolor block leading-tight">
                        Google Sheets
                      </span>
                      <span className="text-caption-2 text-description block mt-2">
                        工作表追加 · sheet_2026_daily_digest
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <span className="text-caption-2 font-mono text-description">
                      +15 列已寫入
                    </span>
                    <span className="text-[#10B981] font-bold text-caption-1">✓</span>
                  </div>
                </div>

                {/* Google Docs */}
                <div className="flex items-center justify-between p-8 rounded-xl hover:bg-[#F8FAFC] transition-colors">
                  <div className="flex items-center gap-10">
                    <StepIcon type="docs" />
                    <div>
                      <span className="text-body-3 font-medium text-fontcolor block leading-tight">
                        Google Docs
                      </span>
                      <span className="text-caption-2 text-description block mt-2">
                        生成文件 · 2026-10-14 文章日報
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <span className="text-caption-2 font-mono text-description">
                      日報已發佈
                    </span>
                    <span className="text-[#10B981] font-bold text-caption-1">✓</span>
                  </div>
                </div>

                {/* DataBase */}
                <div className="flex items-center justify-between p-8 rounded-xl hover:bg-[#F8FAFC] transition-colors">
                  <div className="flex items-center gap-10">
                    <StepIcon type="db" />
                    <div>
                      <span className="text-body-3 font-medium text-fontcolor block leading-tight">
                        DataBase (PostgreSQL)
                      </span>
                      <span className="text-caption-2 text-description block mt-2">
                        資料庫存檔 · daily_articles
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <span className="text-caption-2 font-mono text-description">
                      15 筆已歸檔
                    </span>
                    <span className="text-[#10B981] font-bold text-caption-1">✓</span>
                  </div>
                </div>

                {/* Telegram Bot */}
                <div className={cx(
                  "flex items-center justify-between p-8 rounded-xl transition-colors",
                  run.status === "error"
                    ? "bg-[#FEF2F2] border border-[#FEE2E2]"
                    : "hover:bg-[#F8FAFC]",
                )}>
                  <div className="flex items-center gap-10">
                    <StepIcon type="telegram" />
                    <div>
                      <span className="text-body-3 font-medium text-fontcolor block leading-tight">
                        Telegram Bot
                      </span>
                      <span className="text-caption-2 text-description block mt-2">
                        {run.status === "error"
                          ? "找不到聊天室 · 400 Bad Request"
                          : "推播訊息 · @design_daily_channel"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    {run.status === "error" ? (
                      <>
                        <span className="text-caption-2 font-mono text-[#EF4444] font-medium">
                          發送失敗
                        </span>
                        <span className="text-[#EF4444] font-bold text-caption-1">✕</span>
                      </>
                    ) : (
                      <>
                        <span className="text-caption-2 font-mono text-description">
                          已成功送達
                        </span>
                        <span className="text-[#10B981] font-bold text-caption-1">✓</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 4. 原始 JSON 檢視器與複製按鈕 */}
            <div className="rounded-2xl bg-[#F8FAFC] border border-stroke/40 p-12 space-y-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <span className="text-caption-1 font-semibold text-fontcolor">
                    原始 Payload
                  </span>
                  {/* 篩選標籤 (全部 / Inputs / Outputs) */}
                  <div className="flex items-center bg-white p-2 rounded-full border border-stroke/40">
                    <button
                      type="button"
                      onClick={() => setJsonFilter("all")}
                      className={cx(
                        "px-6 py-1 rounded-full text-[10px] font-medium transition-all cursor-pointer",
                        jsonFilter === "all"
                          ? "bg-[#5D84A2] text-white shadow-xs"
                          : "text-description hover:text-fontcolor"
                      )}
                    >
                      全部
                    </button>
                    <button
                      type="button"
                      onClick={() => setJsonFilter("inputs")}
                      className={cx(
                        "px-6 py-1 rounded-full text-[10px] font-medium transition-all cursor-pointer",
                        jsonFilter === "inputs"
                          ? "bg-[#5D84A2] text-white shadow-xs"
                          : "text-description hover:text-fontcolor"
                      )}
                    >
                      Inputs
                    </button>
                    <button
                      type="button"
                      onClick={() => setJsonFilter("outputs")}
                      className={cx(
                        "px-6 py-1 rounded-full text-[10px] font-medium transition-all cursor-pointer",
                        jsonFilter === "outputs"
                          ? "bg-[#5D84A2] text-white shadow-xs"
                          : "text-description hover:text-fontcolor"
                      )}
                    >
                      Outputs
                    </button>
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={handleCopyJson}
                  className={cx(
                    "!h-[36px] !rounded-full !px-12 !text-caption-1 font-medium select-none shadow-xs transition-colors",
                    copied
                      ? "!border-[#10B981] !text-[#10B981] !bg-[#10B981]/5"
                      : "!border-stroke !bg-white !text-fontcolor hover:!bg-bg/40",
                  )}
                  leadingIcon={
                    copied ? (
                      <span className="text-[#10B981] font-bold text-[13px]">✓</span>
                    ) : (
                      <svg className="w-12 h-12 text-description" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                    )
                  }
                >
                  {copied ? "已複製" : "複製 JSON"}
                </Button>
              </div>

              <div className="relative rounded-xl border border-stroke/40 bg-white overflow-hidden shadow-[inset_0_1px_3px_rgba(0,0,0,0.02)]">
                <pre
                  className="m-0 font-mono text-[11px] text-fontcolor p-12 overflow-x-auto leading-relaxed max-h-[180px] overflow-y-auto custom-scrollbar select-text"
                  dangerouslySetInnerHTML={{ __html: highlightJson(getExecutionJson(run, jsonFilter)) }}
                />
              </div>
            </div>
          </div>
        )}

      </div>

      {/* 3. 底部固定按鈕 (返回編輯修正 / 重新執行) */}
      <div className="px-20 py-16 border-t border-stroke/40 shrink-0 flex items-center gap-10 bg-white">
        <button
          type="button"
          onClick={onBackToEdit}
          className="flex-1 h-[36px] rounded-full border border-primary text-primary hover:bg-primary/5 text-caption-1 font-medium transition-colors cursor-pointer select-none"
        >
          返回編輯修正
        </button>
        <button
          type="button"
          onClick={() => {
            onRunWorkflow?.();
            alert(`⚡ 已重新排程執行歷程 ${run.id}！`);
          }}
          className="flex-1 h-[36px] rounded-full bg-[#5D84A2] text-white hover:bg-[#5D84A2]/90 text-caption-1 font-medium transition-colors cursor-pointer select-none shadow-xs"
        >
          重新執行
        </button>
      </div>
    </div>
  );
}

export default ExecutionDetailPanel;
