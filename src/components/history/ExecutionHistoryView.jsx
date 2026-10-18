import { useState, useMemo } from "react";
import Button from "../ui/button";
import { Input } from "../ui/input";
import ListItem from "../ui/listitem";
import Datepicker from "../ui/datepicker";

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

/**
 * 將 Datepicker 格式 ("Oct 14, 2026") 轉為假資料匹配的標準日期 ("2026/10/14")
 */
function formatPickerToStandardDate(pickerVal) {
  if (!pickerVal) return "";
  const monthsMap = {
    Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06",
    Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12",
  };
  const parts = pickerVal.replace(",", "").trim().split(/\s+/);
  if (parts.length === 3 && monthsMap[parts[0]]) {
    return `${parts[2]}/${monthsMap[parts[0]]}/${parts[1].padStart(2, "0")}`;
  }
  return pickerVal;
}

/* =========================================================
 * 假資料：對齊 Figma 執行紀錄設計截圖之 8 筆紀錄實例
 * ======================================================= */

export const RUNS_DATA = [
  {
    id: "#1050",
    rawId: "1050",
    status: "running",
    statusText: "執行中",
    startTime: "2026/10/14  10:00:00",
    endTime: "進行中...",
    trigger: "排程觸發",
    triggerType: "cron",
    duration: "12.6 秒",
    stepsRatio: "4 / 6",
    successCount: 4,
    totalSteps: 6,
    summary: "正進行 Gemini 智能摘要推論與多管道分流中 (4/6 步驟完成)",
    steps: [
      { id: "s1", name: "日期與時間", subtitle: "排程觸發", time: "0.1 秒", status: "success", iconType: "time" },
      { id: "s2", name: "Code", subtitle: "Run Script", time: "0.6 秒", status: "success", iconType: "code" },
      { id: "s3", name: "Google Sheets", subtitle: "建立試算表", time: "1.2 秒", status: "success", iconType: "sheets" },
      { id: "s4", name: "Telegram Bot", subtitle: "發送至聊天室", time: "10.7 秒", status: "running", iconType: "telegram" },
      { id: "s5", name: "Google Docs", subtitle: "建立文件", time: "-", status: "pending", iconType: "docs" },
      { id: "s6", name: "DataBase", subtitle: "儲存至資料庫", time: "-", status: "pending", iconType: "db" },
    ],
  },
  {
    id: "#1049",
    rawId: "1049",
    status: "success",
    statusText: "成功",
    startTime: "2026/10/14  09:30:00",
    endTime: "09:30:03.200",
    trigger: "排程觸發",
    triggerType: "cron",
    duration: "3.2 秒",
    stepsRatio: "6 / 6",
    successCount: 6,
    totalSteps: 6,
    summary: "所有節點執行順暢，萃取 3 篇重大設計發佈並推播至 Slack",
    steps: [
      { id: "s1", name: "日期與時間", subtitle: "排程觸發", time: "0.1 秒", status: "success", iconType: "time" },
      { id: "s2", name: "Code", subtitle: "Run Script", time: "0.5 秒", status: "success", iconType: "code" },
      { id: "s3", name: "Google Sheets", subtitle: "建立試算表", time: "0.9 秒", status: "success", iconType: "sheets" },
      { id: "s4", name: "Telegram Bot", subtitle: "發送至聊天室", time: "0.8 秒", status: "success", iconType: "telegram" },
      { id: "s5", name: "Google Docs", subtitle: "建立文件", time: "0.4 秒", status: "success", iconType: "docs" },
      { id: "s6", name: "DataBase", subtitle: "儲存至資料庫", time: "0.5 秒", status: "success", iconType: "db" },
    ],
  },
  {
    id: "#1048",
    rawId: "1048",
    status: "error",
    statusText: "失敗",
    startTime: "2026/10/14 09:00:00",
    endTime: "09:00:08.400",
    trigger: "排程觸發",
    triggerType: "cron",
    duration: "8.4 秒",
    stepsRatio: "5 / 6",
    successCount: 5,
    totalSteps: 6,
    errorTitle: "Telegram Bot 發送失敗",
    errorDesc: "找不到指定聊天室（400）。請確認聊天室 ID，並將機器人加入聊天室後重新執行。",
    errorJson: '{\n  "ok": false,\n  "error_code": 400,\n  "description": "Bad Request: chat not found"\n}',
    summary: "第 4 步驟 Telegram Bot 發送失敗 (400 Bad Request)，其餘 5 步驟正常完成",
    steps: [
      { id: "s1", name: "日期與時間", subtitle: "排程觸發", time: "0.1 秒", status: "success", iconType: "time" },
      { id: "s2", name: "Code", subtitle: "Run Script", time: "0.6 秒", status: "success", iconType: "code" },
      { id: "s3", name: "Google Sheets", subtitle: "建立試算表", time: "1.2 秒", status: "success", iconType: "sheets" },
      { id: "s4", name: "Telegram Bot", subtitle: "發送至聊天室", time: "6.5 秒", status: "error", iconType: "telegram" },
      { id: "s5", name: "Google Docs", subtitle: "建立文件", time: "1.4 秒", status: "success", iconType: "docs" },
      { id: "s6", name: "DataBase", subtitle: "儲存至資料庫", time: "0.8 秒", status: "success", iconType: "db" },
    ],
  },
  {
    id: "#1047",
    rawId: "1047",
    status: "success",
    statusText: "成功",
    startTime: "2026/10/14  08:30:00",
    endTime: "08:30:03.600",
    trigger: "排程觸發",
    triggerType: "cron",
    duration: "3.6 秒",
    stepsRatio: "6 / 6",
    successCount: 6,
    totalSteps: 6,
    summary: "排程正常執行，成功產出 4 篇設計快訊",
    steps: [
      { id: "s1", name: "日期與時間", subtitle: "排程觸發", time: "0.1 秒", status: "success", iconType: "time" },
      { id: "s2", name: "Code", subtitle: "Run Script", time: "0.7 秒", status: "success", iconType: "code" },
      { id: "s3", name: "Google Sheets", subtitle: "建立試算表", time: "1.1 秒", status: "success", iconType: "sheets" },
      { id: "s4", name: "Telegram Bot", subtitle: "發送至聊天室", time: "0.9 秒", status: "success", iconType: "telegram" },
      { id: "s5", name: "Google Docs", subtitle: "建立文件", time: "0.4 秒", status: "success", iconType: "docs" },
      { id: "s6", name: "DataBase", subtitle: "儲存至資料庫", time: "0.4 秒", status: "success", iconType: "db" },
    ],
  },
  {
    id: "#1046",
    rawId: "1046",
    status: "success",
    statusText: "成功",
    startTime: "2026/10/14  08:12:35",
    endTime: "08:12:37.800",
    trigger: "手動測試",
    triggerType: "manual",
    duration: "2.8 秒",
    stepsRatio: "6 / 6",
    successCount: 6,
    totalSteps: 6,
    summary: "使用者 Jacqueline 手動觸發測試，全部 6 個節點驗證通過",
    steps: [
      { id: "s1", name: "手動觸發測試", subtitle: "手動指令", time: "0.1 秒", status: "success", iconType: "time" },
      { id: "s2", name: "Code", subtitle: "Run Script", time: "0.4 秒", status: "success", iconType: "code" },
      { id: "s3", name: "Google Sheets", subtitle: "建立試算表", time: "0.8 秒", status: "success", iconType: "sheets" },
      { id: "s4", name: "Telegram Bot", subtitle: "發送至聊天室", time: "0.6 秒", status: "success", iconType: "telegram" },
      { id: "s5", name: "Google Docs", subtitle: "建立文件", time: "0.4 秒", status: "success", iconType: "docs" },
      { id: "s6", name: "DataBase", subtitle: "儲存至資料庫", time: "0.5 秒", status: "success", iconType: "db" },
    ],
  },
  {
    id: "#1045",
    rawId: "1045",
    status: "success",
    statusText: "成功",
    startTime: "2026/10/14  08:00:00",
    endTime: "08:00:03.100",
    trigger: "排程觸發",
    triggerType: "cron",
    duration: "3.1 秒",
    stepsRatio: "6 / 6",
    successCount: 6,
    totalSteps: 6,
    summary: "定時排程執行成功，處理延遲 3.1 秒",
    steps: [
      { id: "s1", name: "日期與時間", subtitle: "排程觸發", time: "0.1 秒", status: "success", iconType: "time" },
      { id: "s2", name: "Code", subtitle: "Run Script", time: "0.5 秒", status: "success", iconType: "code" },
      { id: "s3", name: "Google Sheets", subtitle: "建立試算表", time: "0.9 秒", status: "success", iconType: "sheets" },
      { id: "s4", name: "Telegram Bot", subtitle: "發送至聊天室", time: "0.7 秒", status: "success", iconType: "telegram" },
      { id: "s5", name: "Google Docs", subtitle: "建立文件", time: "0.4 秒", status: "success", iconType: "docs" },
      { id: "s6", name: "DataBase", subtitle: "儲存至資料庫", time: "0.5 秒", status: "success", iconType: "db" },
    ],
  },
  {
    id: "#1044",
    rawId: "1044",
    status: "error",
    statusText: "失敗",
    startTime: "2026/10/14  07:30:00",
    endTime: "07:30:07.900",
    trigger: "排程觸發",
    triggerType: "cron",
    duration: "7.9 秒",
    stepsRatio: "5 / 6",
    successCount: 5,
    totalSteps: 6,
    errorTitle: "條件分流語法錯誤",
    errorDesc: "條件分流規則語法解析失敗，請檢查分支判定表達式。",
    errorJson: '{\n  "ok": false,\n  "error_code": 422,\n  "description": "SyntaxError: Unexpected token in condition"\n}',
    summary: "條件分流規則語法解析失敗，請檢查分支判定表達式",
    steps: [
      { id: "s1", name: "日期與時間", subtitle: "排程觸發", time: "0.1 秒", status: "success", iconType: "time" },
      { id: "s2", name: "Code", subtitle: "Run Script", time: "0.5 秒", status: "success", iconType: "code" },
      { id: "s3", name: "Google Sheets", subtitle: "建立試算表", time: "1.0 秒", status: "success", iconType: "sheets" },
      { id: "s4", name: "Telegram Bot", subtitle: "發送至聊天室", time: "5.8 秒", status: "error", iconType: "telegram" },
      { id: "s5", name: "Google Docs", subtitle: "建立文件", time: "-", status: "skipped", iconType: "docs" },
      { id: "s6", name: "DataBase", subtitle: "儲存至資料庫", time: "-", status: "skipped", iconType: "db" },
    ],
  },
  {
    id: "#1043",
    rawId: "1043",
    status: "success",
    statusText: "成功",
    startTime: "2026/10/14  07:00:00",
    endTime: "07:00:03.400",
    trigger: "排程觸發",
    triggerType: "cron",
    duration: "3.4 秒",
    stepsRatio: "6 / 6",
    successCount: 6,
    totalSteps: 6,
    summary: "晨間排程執行完畢，無異常警告",
    steps: [
      { id: "s1", name: "日期與時間", subtitle: "排程觸發", time: "0.1 秒", status: "success", iconType: "time" },
      { id: "s2", name: "Code", subtitle: "Run Script", time: "0.6 秒", status: "success", iconType: "code" },
      { id: "s3", name: "Google Sheets", subtitle: "建立試算表", time: "1.1 秒", status: "success", iconType: "sheets" },
      { id: "s4", name: "Telegram Bot", subtitle: "發送至聊天室", time: "0.8 秒", status: "success", iconType: "telegram" },
      { id: "s5", name: "Google Docs", subtitle: "建立文件", time: "0.4 秒", status: "success", iconType: "docs" },
      { id: "s6", name: "DataBase", subtitle: "儲存至資料庫", time: "0.4 秒", status: "success", iconType: "db" },
    ],
  },
];

/**
 * 下拉觸發按鈕元件
 * 完全對齊日期選擇器 (Datepicker) 的膠囊邊框、陰影、焦點外環 (ring-2 ring-primary/20) 與圓形圖示徽章 (#CEDAE3 內陰影啟用效果)
 */
export function DropdownTriggerButton({
  isOpen,
  onClick,
  label,
  isFiltered = false,
  variant,
}) {
  return (
    <button
      type="button"
      aria-haspopup="listbox"
      aria-expanded={isOpen}
      onClick={onClick}
      className={cx(
        "h-[34px] pl-14 pr-8 rounded-full border bg-white shadow-drop-s font-primary text-caption-1 transition-all cursor-pointer select-none flex items-center gap-6",
        isOpen
          ? "border-primary ring-2 ring-primary/20 text-primary font-medium"
          : isFiltered
          ? "border-primary/60 text-primary font-medium hover:bg-bg/40"
          : "border-stroke text-fontcolor hover:bg-bg/40",
      )}
    >
      <span className="truncate">{label}</span>
      <span
        className={cx(
          "w-[20px] h-[20px] rounded-full flex items-center justify-center shrink-0 transition-all",
          isOpen
            ? "bg-[#CEDAE3] text-primary shadow-inner"
            : isFiltered
            ? "text-primary"
            : "text-description",
        )}
      >
        <svg
          className={cx("w-10 h-10 transition-transform duration-200", isOpen && "rotate-180")}
          viewBox="0 0 12 12"
          fill="none"
        >
          <path
            d="M2.5 4.5L6 8L9.5 4.5"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </button>
  );
}

export function ExecutionHistoryView({
  selectedRunId = "#1048",
  onSelectRun,
  showTitle = false,
  showSubtitle = false,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [triggerFilter, setTriggerFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("Oct 14, 2026");
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [triggerDropdownOpen, setTriggerDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // 篩選資料
  const filteredRuns = useMemo(() => {
    return RUNS_DATA.filter((run) => {
      if (searchTerm.trim()) {
        const query = searchTerm.trim().toLowerCase();
        const matchId = run.id.toLowerCase().includes(query);
        const matchSummary = run.summary.toLowerCase().includes(query);
        if (!matchId && !matchSummary) return false;
      }
      if (statusFilter !== "all" && run.status !== statusFilter) {
        return false;
      }
      if (triggerFilter !== "all" && run.triggerType !== triggerFilter) {
        return false;
      }
      if (dateFilter && dateFilter !== "all") {
        const targetDate = formatPickerToStandardDate(dateFilter);
        if (targetDate && !run.startTime.startsWith(targetDate)) {
          return false;
        }
      }
      return true;
    });
  }, [searchTerm, statusFilter, triggerFilter, dateFilter]);

  const handleExport = () => {
    alert("已成功匯出執行紀錄 CSV 檔案！");
  };

  return (
    <div className="h-full w-full flex flex-col justify-between gap-16 select-none text-left">
      <div className="flex flex-col gap-12 shrink-0">
        
        {/* 標題與副標已依需求移除 (若需啟用可透過 showTitle / showSubtitle prop 開啟) */}
        {(showTitle || showSubtitle) && (
          <div className="flex items-start justify-between shrink-0">
            <div>
              {showTitle && (
                <h1 className="text-[26px] font-bold text-fontcolor tracking-tight leading-none m-0">
                  執行紀錄
                </h1>
              )}
              {showSubtitle && (
                <p className="mt-6 text-caption-1 text-description m-0">
                  追蹤每一次流程執行，檢視節點狀態與執行結果。
                </p>
              )}
            </div>
            <Button
              variant="outline"
              intent="secondary"
              showLeftIcon
              leftIcon={
                <svg className="w-14 h-14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 14v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4" />
                  <polyline points="16 7 12 3 8 7" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              }
              onClick={handleExport}
              className="!h-[34px] !rounded-full !px-14 text-caption-1 text-fontcolor border-stroke hover:bg-bg/40 transition-all cursor-pointer font-medium"
            >
              匯出
            </Button>
          </div>
        )}

        {/* 1. 精簡版 4 大指標卡片 (高度縮減，不佔過多高度) */}
        <div className="grid grid-cols-4 gap-12 shrink-0">
          {/* 今日執行 */}
          <div className="rounded-xl bg-[#F8FAFC] border border-stroke/40 px-12 py-8 flex flex-col justify-between">
            <span className="text-[11px] font-medium text-description leading-none">今日執行</span>
            <div className="mt-2 flex items-baseline gap-4">
              <span className="text-[20px] font-bold text-fontcolor leading-none">12</span>
              <span className="text-[11px] text-description leading-none">次執行</span>
            </div>
          </div>

          {/* 執行成功 */}
          <div className="rounded-xl bg-[#F8FAFC] border border-stroke/40 px-12 py-8 flex flex-col justify-between">
            <span className="text-[11px] font-medium text-description leading-none">執行成功</span>
            <div className="mt-2 flex items-baseline gap-4">
              <span className="text-[20px] font-bold text-[#369379] leading-none">9</span>
              <span className="text-[11px] text-description leading-none">次</span>
            </div>
          </div>

          {/* 執行失敗 */}
          <div className="rounded-xl bg-[#F8FAFC] border border-stroke/40 px-12 py-8 flex flex-col justify-between">
            <span className="text-[11px] font-medium text-description leading-none">執行失敗</span>
            <div className="mt-2 flex items-baseline gap-4">
              <span className="text-[20px] font-bold text-[#C74949] leading-none">2</span>
              <span className="text-[11px] text-description leading-none">次需留意</span>
            </div>
          </div>

          {/* 執行中 */}
          <div className="rounded-xl bg-[#F8FAFC] border border-stroke/40 px-12 py-8 flex flex-col justify-between">
            <span className="text-[11px] font-medium text-description leading-none">執行中</span>
            <div className="mt-2 flex items-baseline gap-4">
              <span className="text-[20px] font-bold text-[#5D84A2] leading-none">1</span>
              <span className="text-[11px] text-description leading-none">次</span>
            </div>
          </div>
        </div>


        {/* 3. 搜尋與篩選列 */}
        <div className="flex items-center justify-between gap-12 shrink-0">
          <div className="flex items-center gap-10">
            {/* 搜尋 */}
            <div className="w-[190px]">
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="搜尋執行編號"
                className="!h-[34px] !rounded-4xl text-caption-1 border-stroke shadow-none"
              />
            </div>

            {/* 所有狀態 下拉 (使用 DropdownTriggerButton 完全對齊 Datepicker 樣式) */}
            <div className="relative">
              <DropdownTriggerButton
                isOpen={statusDropdownOpen}
                isFiltered={statusFilter !== "all"}
                onClick={() => {
                  setStatusDropdownOpen((prev) => !prev);
                  setTriggerDropdownOpen(false);
                }}
                label={
                  statusFilter === "all"
                    ? "所有狀態"
                    : statusFilter === "running"
                    ? "執行中"
                    : statusFilter === "success"
                    ? "成功"
                    : "失敗"
                }
              />

              {statusDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40 cursor-default"
                    onClick={() => setStatusDropdownOpen(false)}
                  />
                  <div className="absolute top-[40px] left-0 z-50 min-w-[130px] rounded-[22px] border border-stroke bg-white p-6 shadow-drop-l animate-in fade-in duration-100">
                    <ul role="listbox" aria-label="狀態篩選" className="m-0 list-none p-0 flex flex-col gap-2">
                      {[
                        { id: "all", label: "所有狀態" },
                        { id: "running", label: "執行中" },
                        { id: "success", label: "成功" },
                        { id: "error", label: "失敗" },
                      ].map((item) => (
                        <ListItem
                          key={item.id}
                          role="option"
                          selected={statusFilter === item.id}
                          onClick={() => {
                            setStatusFilter(item.id);
                            setStatusDropdownOpen(false);
                          }}
                          className="!h-[32px] !min-h-[32px] !px-12 !rounded-full !text-caption-1 cursor-pointer"
                        >
                          {item.label}
                        </ListItem>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </div>

            {/* 所有觸發方式 下拉 (使用 DropdownTriggerButton 完全對齊 Datepicker 樣式) */}
            <div className="relative">
              <DropdownTriggerButton
                isOpen={triggerDropdownOpen}
                isFiltered={triggerFilter !== "all"}
                onClick={() => {
                  setTriggerDropdownOpen((prev) => !prev);
                  setStatusDropdownOpen(false);
                }}
                label={
                  triggerFilter === "all"
                    ? "所有觸發方式"
                    : triggerFilter === "cron"
                    ? "排程觸發"
                    : "手動測試"
                }
              />

              {triggerDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40 cursor-default"
                    onClick={() => setTriggerDropdownOpen(false)}
                  />
                  <div className="absolute top-[40px] left-0 z-50 min-w-[140px] rounded-[22px] border border-stroke bg-white p-6 shadow-drop-l animate-in fade-in duration-100">
                    <ul role="listbox" aria-label="觸發方式篩選" className="m-0 list-none p-0 flex flex-col gap-2">
                      {[
                        { id: "all", label: "所有觸發方式" },
                        { id: "cron", label: "排程觸發" },
                        { id: "manual", label: "手動測試" },
                      ].map((item) => (
                        <ListItem
                          key={item.id}
                          role="option"
                          selected={triggerFilter === item.id}
                          onClick={() => {
                            setTriggerFilter(item.id);
                            setTriggerDropdownOpen(false);
                          }}
                          className="!h-[32px] !min-h-[32px] !px-12 !rounded-full !text-caption-1 cursor-pointer"
                        >
                          {item.label}
                        </ListItem>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </div>

            {/* 📅 日期選擇器 */}
            <Datepicker
              value={dateFilter}
              onChange={(val) => setDateFilter(val)}
              editable={false}
              placeholder="選擇日期"
              className="!w-[150px]"
            />
          </div>

          {/* 重新整理 */}
          <button
            type="button"
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("all");
              setTriggerFilter("all");
              setDateFilter("Oct 14, 2026");
            }}
            className="text-caption-1 text-description hover:text-primary transition-colors cursor-pointer select-none"
          >
            重新整理
          </button>
        </div>

        {/* 4. 表格容器：高度 hug 內容 (h-fit)，支援內部縱向滾動 */}
        <div className="h-fit max-h-[380px] shrink-0 rounded-2xl border border-stroke/60 bg-white flex flex-col overflow-hidden">
          <div className="overflow-y-auto w-full">
            <table className="w-full border-collapse text-left text-body-3">
              {/* 表頭 (固定置頂) */}
              <thead className="sticky top-0 z-10 bg-[#F8FAFC] shadow-[inset_0_-1px_0_#CBD5E1]">
                <tr className="h-[38px] text-[12px] font-medium text-secondary">
                  <th className="px-14 py-6 text-left whitespace-nowrap select-none font-medium">執行編號</th>
                  <th className="px-14 py-6 text-left whitespace-nowrap select-none font-medium">狀態</th>
                  <th className="px-14 py-6 text-left whitespace-nowrap select-none font-medium">
                    <span className="inline-flex items-center gap-4">
                      開始時間
                      <span className="text-[11px] leading-none">↓</span>
                    </span>
                  </th>
                  <th className="px-14 py-6 text-left whitespace-nowrap select-none font-medium">觸發方式</th>
                  <th className="px-14 py-6 text-left whitespace-nowrap select-none font-medium">執行時間</th>
                  <th className="px-14 py-6 text-left whitespace-nowrap select-none font-medium">成功節點</th>
                </tr>
              </thead>

              {/* 資料列 (8 筆資料，支援內部滾動) */}
              <tbody>
                {filteredRuns.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-14 py-36 text-center text-description text-caption-1">
                      查無符合篩選條件的執行紀錄
                    </td>
                  </tr>
                ) : (
                  filteredRuns.map((run) => {
                    const isSelected = selectedRunId === run.id;

                    return (
                      <tr
                        key={run.id}
                        onClick={() => onSelectRun?.(run.id)}
                        className={cx(
                          "h-[40px] transition-colors duration-150 border-b border-stroke/50 last:border-b-0 cursor-pointer text-caption-1",
                          isSelected
                            ? "bg-[#EFF3F6]/80 border-l-[3px] border-l-primary"
                            : "bg-white hover:bg-[#F0F1F2]",
                        )}
                      >
                        {/* 1. 執行編號 */}
                        <td className="px-14 py-6 font-medium">
                          <span className={isSelected ? "text-primary font-semibold" : "text-fontcolor"}>
                            {run.id}
                          </span>
                        </td>

                        {/* 2. 狀態徽章 */}
                        <td className="px-14 py-6">
                          {run.status === "running" && (
                            <span className="inline-flex items-center px-6 py-0.5 rounded-full text-[11px] font-medium bg-[#5D84A2]/10 text-[#5D84A2]">
                              執行中
                            </span>
                          )}
                          {run.status === "success" && (
                            <span className="inline-flex items-center px-6 py-0.5 rounded-full text-[11px] font-medium bg-[#369379]/15 text-[#369379]">
                              成功
                            </span>
                          )}
                          {run.status === "error" && (
                            <span className="inline-flex items-center px-6 py-0.5 rounded-full text-[11px] font-medium bg-[#C74949]/15 text-[#C74949]">
                              失敗
                            </span>
                          )}
                        </td>

                        {/* 3. 開始時間 */}
                        <td className="px-14 py-6 text-fontcolor whitespace-nowrap">
                          {run.startTime}
                        </td>

                        {/* 4. 觸發方式 */}
                        <td className="px-14 py-6 text-fontcolor whitespace-nowrap">
                          <div className="flex items-center gap-4">
                            {run.triggerType === "cron" ? (
                              <svg className="w-12 h-12 text-fontcolor shrink-0" viewBox="0 0 16 16" fill="none">
                                <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3" />
                                <path d="M8 5v3.5l2 1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                              </svg>
                            ) : (
                              <svg className="w-12 h-12 text-fontcolor shrink-0" viewBox="0 0 16 16" fill="none">
                                <path d="M5 3.5v9l7-4.5-7-4.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
                              </svg>
                            )}
                            <span>{run.trigger}</span>
                          </div>
                        </td>

                        {/* 5. 執行時間 */}
                        <td className="px-14 py-6 text-fontcolor whitespace-nowrap">
                          {run.duration}
                        </td>

                        {/* 6. 成功節點 */}
                        <td className="px-14 py-6 text-fontcolor whitespace-nowrap">
                          {run.stepsRatio}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 5. 分頁列 (shrink-0，底部增加內距預留與下方 footer 的 gap) */}
        <div className="flex items-center justify-between text-caption-2 text-description shrink-0 pb-2">
          <span>
            {filteredRuns.length <= 1
              ? `顯示第 ${filteredRuns.length} 筆，共 ${filteredRuns.length} 筆紀錄`
              : `顯示第 1-${Math.min(filteredRuns.length, 8)} 筆，共 ${filteredRuns.length} 筆紀錄`}
          </span>

          <div className="flex items-center gap-4">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(1)}
              className="w-24 h-24 rounded-full text-description hover:bg-bg hover:text-fontcolor disabled:opacity-30 flex items-center justify-center text-xs transition-colors cursor-pointer"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage(1)}
              className={cx(
                "w-24 h-24 rounded-full flex items-center justify-center text-[11px] font-semibold transition-colors cursor-pointer",
                currentPage === 1 ? "bg-primary text-white" : "text-fontcolor hover:bg-bg",
              )}
            >
              1
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage(2)}
              className={cx(
                "w-24 h-24 rounded-full flex items-center justify-center text-[11px] font-semibold transition-colors cursor-pointer",
                currentPage === 2 ? "bg-primary text-white" : "text-fontcolor hover:bg-bg",
              )}
            >
              2
            </button>
            <button
              type="button"
              disabled={currentPage === 2}
              onClick={() => setCurrentPage(2)}
              className="w-24 h-24 rounded-full text-description hover:bg-bg hover:text-fontcolor disabled:opacity-30 flex items-center justify-center text-xs transition-colors cursor-pointer"
            >
              ›
            </button>
          </div>
        </div>

      </div>

      {/* 6. 底部保留天數與更新時間註腳 (固定在卡片最下方 mt-auto) */}
      <div className="mt-auto flex items-center justify-between text-[11px] text-description pt-12 border-t border-stroke/40 shrink-0">
        <span>執行紀錄保留 30 天 · 時區 Asia/Taipei (UTC+8)</span>
        <span>最後更新於 2026/10/14 10:00:12.6</span>
      </div>
    </div>
  );
}

export default ExecutionHistoryView;
