import { createContext, useContext, useState, useEffect } from "react";
import { Input as BaseInput } from "../../component/ui/input";
import { Select as BaseSelect } from "../../component/ui/select";
import { Switch as BaseSwitch } from "../../component/ui/switch";
import { Slider as BaseSlider } from "../../component/ui/slider";
import { Textarea as BaseTextarea } from "../../component/ui/textarea";
import { Datepicker as BaseDatepicker } from "../../component/ui/datepicker";
import { TimePicker as BaseTimePicker } from "../../component/ui/timepicker";
import Button from "../../component/ui/button";
import { validateNode, getDefaultParamsForTool } from "../../utils/nodeValidation";

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

const PanelDisabledContext = createContext(false);

const Input = ({ required, error, errorMessage, ...props }) => {
  const disabled = useContext(PanelDisabledContext);
  const isEmpty = Boolean(
    required &&
      (props.value === undefined ||
        props.value === null ||
        String(props.value).trim() === "")
  );
  const isError = Boolean(error || isEmpty);
  const finalErrorMessage = errorMessage || (isEmpty ? "此為必填欄位，尚未填寫" : undefined);

  return (
    <BaseInput
      {...props}
      error={isError}
      errorMessage={finalErrorMessage}
      disabled={disabled || Boolean(props.disabled)}
      status={disabled ? "disabled" : undefined}
    />
  );
};

const Select = ({ required, error, errorMessage, ...props }) => {
  const disabled = useContext(PanelDisabledContext);
  const isEmpty = Boolean(
    required &&
      (props.value === undefined ||
        props.value === null ||
        String(props.value).trim() === "")
  );
  const isError = Boolean(error || isEmpty);
  const finalErrorMessage = errorMessage || (isEmpty ? "請選擇此項目" : undefined);

  return (
    <BaseSelect
      {...props}
      error={isError}
      errorMessage={finalErrorMessage}
      disabled={disabled || Boolean(props.disabled)}
      status={disabled ? "disabled" : undefined}
    />
  );
};

const Switch = (props) => {
  const disabled = useContext(PanelDisabledContext);
  return (
    <BaseSwitch
      {...props}
      disabled={disabled || Boolean(props.disabled)}
      status={disabled ? "disabled" : props.status}
    />
  );
};

const Slider = (props) => {
  const disabled = useContext(PanelDisabledContext);
  return (
    <BaseSlider
      {...props}
      disabled={disabled || Boolean(props.disabled)}
      status={disabled ? "disabled" : props.status}
    />
  );
};

const Textarea = ({ required, error, errorMessage, ...props }) => {
  const disabled = useContext(PanelDisabledContext);
  const isEmpty = Boolean(
    required &&
      (props.value === undefined ||
        props.value === null ||
        String(props.value).trim() === "")
  );
  const isError = Boolean(error || isEmpty);
  const finalErrorMessage = errorMessage || (isEmpty ? "此為必填欄位，尚未填寫" : undefined);

  return (
    <BaseTextarea
      {...props}
      error={isError}
      errorMessage={finalErrorMessage}
      disabled={disabled || Boolean(props.disabled)}
      status={disabled ? "disabled" : undefined}
    />
  );
};

const DatePicker = ({ label, required, error, errorMessage, helperText, className = "", ...props }) => {
  const disabled = useContext(PanelDisabledContext);
  const isEmpty = Boolean(
    required &&
      (props.value === undefined ||
        props.value === null ||
        String(props.value).trim() === "")
  );
  const isError = Boolean(error || isEmpty);
  const finalErrorMessage = errorMessage || (isEmpty ? "此為必填欄位，請選擇日期" : undefined);

  return (
    <div className="flex flex-col gap-4 w-full">
      {label && (
        <label className="text-caption-1 font-medium text-secondary">
          {label}
          {required && <span className="text-error ml-2">*</span>}
        </label>
      )}
      <BaseDatepicker
        {...props}
        disabled={disabled || Boolean(props.disabled)}
        error={isError}
        className={cx("!w-full", className)}
      />
      {finalErrorMessage && isError && (
        <span className="text-caption-2 text-error">{finalErrorMessage}</span>
      )}
      {helperText && !isError && (
        <span className="text-caption-2 text-description">{helperText}</span>
      )}
    </div>
  );
};

const TimePicker = ({ label, required, error, errorMessage, helperText, className = "", ...props }) => {
  const disabled = useContext(PanelDisabledContext);
  const isEmpty = Boolean(
    required &&
      (props.value === undefined ||
        props.value === null ||
        String(props.value).trim() === "")
  );
  const isError = Boolean(error || isEmpty);
  const finalErrorMessage = errorMessage || (isEmpty ? "此為必填欄位，請選擇時間" : undefined);

  return (
    <div className="flex flex-col gap-4 w-full">
      {label && (
        <label className="text-caption-1 font-medium text-secondary">
          {label}
          {required && <span className="text-error ml-2">*</span>}
        </label>
      )}
      <BaseTimePicker
        {...props}
        disabled={disabled || Boolean(props.disabled)}
        error={isError}
        className={cx("!w-full", className)}
      />
      {finalErrorMessage && isError && (
        <span className="text-caption-2 text-error">{finalErrorMessage}</span>
      )}
      {helperText && !isError && (
        <span className="text-caption-2 text-description">{helperText}</span>
      )}
    </div>
  );
};

/* =========================================================
 * 判定節點所屬的 Tool ID
 * ======================================================= */
function resolveToolId(node) {
  if (node.toolId) return node.toolId;
  const id = node.id || "";
  if (id.startsWith("trigger-") || id === "tigger" || id === "trigger") return "trigger";
  if (id === "data-fetch" || id === "action-crm" || id.includes("database")) return "database";
  if (id === "ai-sentiment" || id.includes("llm")) return "llm";
  if (id === "branch-split" || id.includes("branch")) return "branch";
  if (id === "action-slack" || id.includes("bot") || id.includes("slack")) return "bot-integration";

  const title = node.title || "";
  if (title.includes("Trigger") || title.includes("Tigger") || title.includes("觸發")) return "trigger";
  if (title.includes("條件") || title.includes("分支")) return "branch";
  if (title.includes("迴圈")) return "loop";
  if (title.includes("延遲")) return "delay";
  if (title.includes("程式碼")) return "code";
  if (title.includes("編輯欄位")) return "edit-field";
  if (title.includes("日期") || title.includes("時間")) return "datetime";
  if (title.includes("JSON")) return "json-convert";
  if (title.includes("篩選")) return "filter";
  if (title.includes("限制")) return "limit";
  if (title.includes("去重") || title.includes("重複")) return "deduplicate";
  if (title.includes("彙整") || title.includes("計算")) return "statistics";
  if (title.includes("語言模型") || title.includes("LLM")) return "llm";
  if (title.includes("代理") || title.includes("Agent")) return "ai-agent";
  if (title.includes("結構化")) return "structured-extract";
  if (title.includes("知識庫")) return "kb-qa";
  if (title.includes("向量檢索")) return "vector-search";
  if (title.includes("向量化") || title.includes("Embedding")) return "text-embedding";
  if (title.includes("圖像") || title.includes("畫圖")) return "image-gen";
  if (title.includes("語音轉文字") || title.includes("STT")) return "speech-to-text";
  if (title.includes("文字轉語音") || title.includes("TTS")) return "text-to-speech";
  if (title.includes("Webhook")) return "webhook";
  if (title.includes("HTTP")) return "http-request";
  if (title.includes("子工作流程")) return "sub-workflow";
  if (title.includes("Sheets")) return "google-sheets";
  if (title.includes("Docs")) return "google-docs";
  if (title.includes("Bot") || title.includes("Slack") || title.includes("Telegram")) return "bot-integration";
  if (title.includes("郵件") || title.includes("Email")) return "email-send";
  if (title.includes("資料庫") || title.includes("SQL")) return "database";
  if (title.includes("儲存") || title.includes("S3") || title.includes("雲端")) return "cloud-storage";

  return "trigger";
}

export const TOOL_TITLES = {
  trigger: "定時觸發",
  tigger: "定時觸發",
  branch: "條件分支",
  loop: "迴圈迭代",
  delay: "延遲等待",
  code: "自訂程式碼",
  "edit-field": "編輯欄位",
  datetime: "日期時間轉換",
  "json-convert": "JSON 轉換",
  filter: "資料篩選",
  limit: "限制筆數",
  deduplicate: "移除重複項目",
  statistics: "彙整與計算",
  llm: "AI 語言模型",
  "ai-agent": "AI 智慧代理",
  "structured-extract": "結構化擷取",
  "kb-qa": "知識庫檢索",
  "vector-search": "向量檢索",
  "text-embedding": "文字向量化",
  "image-gen": "圖像生成",
  "speech-to-text": "語音轉文字",
  "text-to-speech": "文字轉語音",
  webhook: "Webhook 接收端",
  "http-request": "網路爬蟲",
  "sub-workflow": "子工作流程",
  "google-sheets": "Excel 試算表",
  "google-docs": "Google 文件",
  "bot-integration": "機器人推播",
  "email-send": "電子郵件",
  database: "資料庫寫入",
  "cloud-storage": "雲端儲存",
};

export function resolveItemTitle(node) {
  if (node.itemTitle) return node.itemTitle;
  const toolId = resolveToolId(node);
  return TOOL_TITLES[toolId] || "節點模組";
}

/* =========================================================
 * 節點詳情配置面板
 * ======================================================= */
export function NodeDetailPanel({
  node,
  validation = null,
  connections = [],
  allNodes = [],
  onClose,
  onUpdateNode,
  onSave,
  isDisabledFlow = false,
  mode = "edit",
  nodeIcons = {},
  isPreview = false,
  onSelectUnderlyingNode,
}) {
  if (!node) return null;

  const isReadOnly = Boolean(isPreview || node.isPreview);
  const toolId = resolveToolId(node);
  const itemTitle = node.itemTitle || resolveItemTitle(node);

  // 本地暫存狀態：未按下儲存前，不直接修改畫布上的 node 實體；若關閉或取消則自動丟棄草稿復原
  const [localName, setLocalName] = useState(() =>
    node.name !== undefined ? node.name : (node.title || "")
  );
  const [localParams, setLocalParams] = useState(() => ({
    ...getDefaultParamsForTool(toolId),
    ...(node.params || {}),
  }));

  useEffect(() => {
    setLocalName(node.name !== undefined ? node.name : (node.title || ""));
    setLocalParams({
      ...getDefaultParamsForTool(toolId),
      ...(node.params || {}),
    });
  }, [node.id, toolId]);

  const updateParam = (key, value) => {
    if (isReadOnly) return;
    setLocalParams((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const updateNodeName = (newName) => {
    if (isReadOnly) return;
    setLocalName(newName);
  };

  const handleSave = () => {
    if (isReadOnly) return;
    onUpdateNode?.(node.id, {
      name: localName,
      title: localName,
      params: localParams,
    });
    onSave?.(node.id, {
      name: localName,
      title: localName,
      params: localParams,
    });
    onClose?.();
  };

  const handleCancel = () => {
    // 恢復更改前內容並關閉視窗
    setLocalName(node.name !== undefined ? node.name : (node.title || ""));
    setLocalParams({ ...(node.params || {}) });
    onClose?.();
  };

  const handlePanelMouseDown = (e) => {
    if (
      e.target.closest(
        "input, select, textarea, button, label, [role='button'], [role='switch'], [role='slider'], [role='listbox'], [role='option'], a",
      )
    ) {
      e.stopPropagation();
      return;
    }

    if (onSelectUnderlyingNode && onSelectUnderlyingNode(e.clientX, e.clientY)) {
      e.stopPropagation();
      e.preventDefault();
      return;
    }

    e.stopPropagation();
  };

  const handlePanelClick = (e) => {
    if (
      e.target.closest(
        "input, select, textarea, button, label, [role='button'], [role='switch'], [role='slider'], [role='listbox'], [role='option'], a",
      )
    ) {
      e.stopPropagation();
      return;
    }

    if (onSelectUnderlyingNode && onSelectUnderlyingNode(e.clientX, e.clientY)) {
      e.stopPropagation();
      e.preventDefault();
      return;
    }

    e.stopPropagation();
  };

  // 即時計算當前編輯草稿之驗證狀態
  const liveValidation = validateNode(
    {
      ...node,
      name: localName,
      title: localName,
      params: localParams,
    },
    connections,
    allNodes
  );
  const displayValidation = liveValidation?.status !== "valid" ? liveValidation : (validation?.status !== "valid" ? validation : null);

  return (
    <aside
      data-detail-panel="true"
      className="absolute top-16 right-16 z-20 flex w-[280px] max-h-[calc(100vh-100px)] flex-col rounded-3xl border border-stroke/80 bg-white/95 p-16 shadow-drop-m backdrop-blur-md cursor-default select-text animate-in fade-in zoom-in-95 duration-150"
      style={{ cursor: "default" }}
      onMouseDown={handlePanelMouseDown}
      onClick={handlePanelClick}
    >
      {/* 標題與關閉按鈕：副標題已移除，僅保留項目標題 */}
      <div className="flex shrink-0 items-center justify-between border-b border-stroke/50 pb-10">
        <div className="flex items-center gap-8 min-w-0">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center text-primary">
            {nodeIcons[node.iconKey] || nodeIcons.database}
          </div>
          <h4 className="m-0 truncate text-label-2 font-medium text-primary">
            {itemTitle}
          </h4>
        </div>
        <button
          type="button"
          onClick={handleCancel}
          className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-full text-description hover:bg-bg hover:text-fontcolor text-label-2 cursor-pointer transition-colors"
          aria-label="取消關閉"
        >
          ✕
        </button>
      </div>

      {/* 流程停用提示 */}
      {isDisabledFlow && (
        <div className="mt-10 rounded-xl bg-slate-100 p-8 border border-slate-200 text-caption-2 text-slate-600 flex items-start gap-6">
          <span className="text-label-3 shrink-0">🚫</span>
          <div>
            <span className="font-medium text-slate-700">流程已停用</span>
            <p className="m-0 mt-2 text-slate-500 leading-normal">
              上游連線已被禁用，執行流程無法傳遞至此節點。若要恢復運行，請重新啟用上游連線。
            </p>
          </div>
        </div>
      )}

      {/* 節點驗證狀態橫幅 (錯誤 / 尚未填寫完整) */}
      {!isDisabledFlow && mode === "edit" && displayValidation?.status && displayValidation.status !== "valid" && (
        <div
          className={`mt-10 rounded-xl p-10 border text-caption-2 flex items-start gap-8 leading-relaxed transition-all shadow-xs ${
            displayValidation.status === "error"
              ? "bg-[#FEF2F2] border-[#FEE2E2] text-error"
              : "bg-[#FFFBEB] border-[#FEF3C7] text-[#B45309]"
          }`}
        >
          <span className="text-[14px] shrink-0 mt-0.5">
            {displayValidation.status === "error" ? "❌" : "⚠️"}
          </span>
          <div className="flex-1 min-w-0">
            <span className="font-semibold block text-[12px]">
              {displayValidation.status === "error"
                ? displayValidation.blocking
                  ? "無法進行流程"
                  : "內容錯誤"
                : "尚未填寫完整"}
            </span>
            <p className="m-0 mt-2 leading-normal text-[11px] opacity-90">
              {displayValidation.message}
            </p>
          </div>
        </div>
      )}

      {/* 歷史模式執行資訊 */}
      {mode === "history" && (
        <div className="mt-10 rounded-xl bg-bg/80 p-8 space-y-4 border border-stroke/50">
          <div className="flex justify-between text-caption-2">
            <span className="text-description">執行耗時</span>
            <span className="font-mono font-medium text-fontcolor">
              {node.duration || "0ms"}
            </span>
          </div>
          <div className="flex justify-between text-caption-2">
            <span className="text-description">處理狀態</span>
            <span className="font-medium text-success">
              {node.recordCount || "完成"}
            </span>
          </div>
        </div>
      )}

      {/* 滾動表單區域：設置 -mx-4 px-4 py-2 留出聚焦外環緩衝空間 */}
      <div className="mt-12 -mx-4 flex-1 overflow-y-auto px-4 py-2 custom-scrollbar">
        <PanelDisabledContext.Provider value={isReadOnly}>
          <fieldset disabled={isReadOnly} className="border-0 p-0 m-0 min-w-0">
            <div className="flex flex-col gap-12 font-primary text-left">
              {/* 基本節點名稱設定（更動節點名稱不影響項目標題） */}
              <Input
                label="節點名稱"
                required
                value={localName}
                onChange={(e) => updateNodeName(e.target.value)}
                placeholder="請輸入節點名稱..."
                errorMessage={!localName.trim() ? "請輸入節點名稱" : undefined}
              />

              {/* 節點專屬設定項目（直接展開，不包裹多餘外層 div） */}
              <NodeSpecificConfig
                toolId={toolId}
                params={localParams}
                updateParam={updateParam}
              />
            </div>
          </fieldset>
        </PanelDisabledContext.Provider>
      </div>

      {/* 底部操作按鈕：預覽/查看模式下不顯示操作按鈕，只保留右上方的叉叉；編輯模式下顯示短「取消」與長「儲存」 */}
      {!isReadOnly && (
        <div className="mt-12 flex items-center gap-8 border-t border-stroke/40 pt-10">
          <Button
            variant="outline"
            intent="secondary"
            onClick={handleCancel}
            className="!w-[72px] !shrink-0 !h-[36px] !rounded-[18px] !text-label-3"
          >
            取消
          </Button>
          <Button
            variant="filled"
            intent="primary"
            onClick={handleSave}
            className="flex-1 !h-[36px] !rounded-[18px] !text-label-3"
          >
            儲存
          </Button>
        </div>
      )}
    </aside>
  );
}

/* =========================================================
 * 28 項節點專屬表單渲染器（全部以 React Fragment 返回，直接作為單一 div 的子項目）
 * ======================================================= */
function NodeSpecificConfig({ toolId, params, updateParam }) {
  switch (toolId) {
    // ---------------------------------------------------------
    // 1. Data: 流程控制與觸發
    // ---------------------------------------------------------
    case "trigger":
    case "tigger": {
      const cronVal = params.cron !== undefined ? params.cron : "0 10 * * *";
      const isCronEmpty = !cronVal.trim();
      const triggerType = params.triggerType || "schedule";

      const handleTimeChange = (newTime) => {
        updateParam("time", newTime);
        // 若為排程模式，將選取的 AM/PM 時間自動轉換並同步至排程表達式
        if (triggerType === "schedule" && newTime) {
          const match = String(newTime).match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
          if (match) {
            let h = parseInt(match[1], 10);
            const m = parseInt(match[2], 10);
            const period = match[3].toUpperCase();
            if (period === "PM" && h < 12) h += 12;
            if (period === "AM" && h === 12) h = 0;
            updateParam("cron", `${m} ${h} * * *`);
          }
        }
      };

      return (
        <>
          <Select
            label="觸發模式"
            value={triggerType}
            onChange={(val) => updateParam("triggerType", val)}
            options={[
              { value: "schedule", label: "定時排程 (Cron)" },
              { value: "once", label: "指定單次執行 (Date & Time)" },
              { value: "webhook", label: "即時 Webhook 接收" },
              { value: "manual", label: "手動點擊觸發" },
              { value: "file_watch", label: "雲端檔案變更觸發" },
            ]}
          />

          {(triggerType === "schedule" || triggerType === "once") && (
            <>
              <DatePicker
                label={triggerType === "once" ? "指定執行日期" : "生效起始日期"}
                required
                value={params.date !== undefined ? params.date : "Oct 18, 2026"}
                onChange={(val) => updateParam("date", val)}
                placeholder="選擇日期"
                helperText={triggerType === "once" ? "工作流程於指定日期當天觸發" : "排程生效之首日"}
              />

              <TimePicker
                label={triggerType === "once" ? "指定執行時間" : "每日執行時間"}
                required
                value={params.time !== undefined ? params.time : "10:00 AM"}
                onChange={handleTimeChange}
                placeholder="選擇時間"
                helperText={triggerType === "once" ? "指定單次啟動的時間點" : "指定每日自動啟動的時間點"}
              />
            </>
          )}

          {triggerType === "schedule" && (
            <Input
              label="排程表達式 (Cron Expression)"
              required
              value={cronVal}
              onChange={(e) => updateParam("cron", e.target.value)}
              placeholder="例如 0 10 * * *"
              helperText="每天 10:00 自動執行 (已與選擇的時間同步)"
              error={isCronEmpty}
              errorMessage={isCronEmpty ? "排程表達式不可為空" : undefined}
            />
          )}

          {triggerType === "webhook" && (
            <Input
              label="Webhook 接收路徑"
              required
              value={params.webhookPath || "/webhook/trigger-events"}
              onChange={(e) => updateParam("webhookPath", e.target.value)}
              placeholder="/webhook/..."
              helperText="外部系統發送 POST 請求至此路徑觸發"
            />
          )}

          <Select
            label="執行時區"
            value={params.timezone || "Asia/Taipei"}
            onChange={(val) => updateParam("timezone", val)}
            options={[
              { value: "Asia/Taipei", label: "Asia/Taipei (UTC+8)" },
              { value: "UTC", label: "UTC 國際標準時" },
              { value: "America/New_York", label: "America/New_York (EST)" },
              { value: "Asia/Tokyo", label: "Asia/Tokyo (JST)" },
            ]}
          />

          <Switch
            label="啟用自動觸發"
            checked={params.active !== false}
            onChange={(checked) => updateParam("active", checked)}
          />
        </>
      );
    }

    case "branch": {
      const fieldVal = params.field !== undefined ? params.field : "{{input.score}}";
      const targetVal = params.targetValue !== undefined ? params.targetValue : "80";
      return (
        <>
          <Input
            label="判斷條件來源變數"
            required
            value={fieldVal}
            onChange={(e) => updateParam("field", e.target.value)}
            placeholder="{{input.field}}"
            errorMessage={!fieldVal.trim() ? "尚未填寫判斷條件來源變數" : undefined}
          />
          <Input
            label="比較目標值"
            required
            value={targetVal}
            onChange={(e) => updateParam("targetValue", e.target.value)}
            placeholder="請輸入目標比對值..."
            errorMessage={!targetVal.trim() ? "尚未填寫比較目標值" : undefined}
          />
          <Select
            label="條件運算子"
            value={params.operator || ">="}
            onChange={(val) => updateParam("operator", val)}
            options={[
              { value: ">=", label: "大於等於 (>=)" },
              { value: "<=", label: "小於等於 (<=)" },
              { value: "==", label: "等於 (==)" },
              { value: "!=", label: "不等於 (!=)" },
              { value: "contains", label: "字串包含 (contains)" },
              { value: "regex", label: "正則表達式匹配 (Regex)" },
            ]}
          />
          <Switch
            label="啟用預設備用分支 (Else)"
            checked={params.enableElse !== false}
            onChange={(checked) => updateParam("enableElse", checked)}
          />
        </>
      );
    }

    case "loop": {
      const arrayPathVal = params.arrayPath !== undefined ? params.arrayPath : "{{input.items}}";
      return (
        <>
          <Input
            label="迭代目標陣列"
            required
            value={arrayPathVal}
            onChange={(e) => updateParam("arrayPath", e.target.value)}
            placeholder="{{input.items}}"
            errorMessage={!arrayPathVal.trim() ? "尚未填寫迭代目標陣列" : undefined}
          />
          <Input
            type="number"
            label="最大迭代次數上限"
            required
            value={params.maxIterations !== undefined ? params.maxIterations : 100}
            onChange={(e) => updateParam("maxIterations", e.target.value === "" ? "" : Number(e.target.value))}
            suffixIcon={<span className="text-caption-2 font-mono">次</span>}
            min={1}
            max={5000}
            errorMessage={!params.maxIterations ? "最大迭代次數不可為空" : undefined}
          />
          <Switch
            label="遇單筆失敗立即中斷"
            checked={params.breakOnError || false}
            onChange={(checked) => updateParam("breakOnError", checked)}
          />
          <Slider
            label="並發執行數"
            showValue
            value={params.concurrency || 3}
            onChange={(val) => updateParam("concurrency", val)}
            min={1}
            max={10}
            step={1}
            formatValue={(v) => `${v} 並發`}
          />
        </>
      );
    }

    case "delay":
      return (
        <>
          <Select
            label="計時模式"
            value={params.mode || "fixed"}
            onChange={(val) => updateParam("mode", val)}
            options={[
              { value: "fixed", label: "固定等待時長" },
              { value: "random", label: "隨機抖動 (Jitter)" },
              { value: "until_time", label: "等待至指定時間戳" },
            ]}
          />
          {params.mode === "until_time" ? (
            <>
              <DatePicker
                label="等待至指定日期"
                required
                value={params.date !== undefined ? params.date : "Oct 18, 2026"}
                onChange={(val) => updateParam("date", val)}
                placeholder="選擇喚醒日期"
              />
              <TimePicker
                label="等待至指定時間"
                required
                value={params.time !== undefined ? params.time : "10:00 AM"}
                onChange={(val) => updateParam("time", val)}
                placeholder="選擇喚醒時間"
              />
            </>
          ) : (
            <Input
              type="number"
              label="等待延遲時長"
              required
              value={params.delaySeconds !== undefined ? params.delaySeconds : 5}
              onChange={(e) => updateParam("delaySeconds", e.target.value === "" ? "" : Number(e.target.value))}
              suffixIcon={<span className="text-caption-2 font-mono">秒</span>}
              min={1}
              max={3600}
              helperText="支援在輸入框內以滾輪微調時間"
              errorMessage={params.delaySeconds === "" || params.delaySeconds === undefined ? "延遲時長不可為空" : undefined}
            />
          )}
          <Switch
            label="允許外部 Webhook 提早喚醒"
            checked={params.allowEarlyWakeup || false}
            onChange={(checked) => updateParam("allowEarlyWakeup", checked)}
          />
        </>
      );

    // ---------------------------------------------------------
    // 2. Data: 資料轉換與處理
    // ---------------------------------------------------------
    case "code": {
      const codeVal =
        params.code !== undefined
          ? params.code
          : "// 輸入資料於 input 物件中\nreturn {\n  ...input,\n  processedAt: new Date().toISOString()\n};";
      return (
        <>
          <Input
            type="number"
            label="執行超時限制"
            required
            value={params.timeout !== undefined ? params.timeout : 10}
            onChange={(e) => updateParam("timeout", e.target.value === "" ? "" : Number(e.target.value))}
            suffixIcon={<span className="text-caption-2 font-mono">秒</span>}
            min={1}
            max={60}
            errorMessage={!params.timeout ? "超時限制不可為空" : undefined}
          />
          <Select
            label="執行環境語言"
            value={params.language || "javascript"}
            onChange={(val) => updateParam("language", val)}
            options={[
              { value: "javascript", label: "JavaScript (Node 20)" },
              { value: "python", label: "Python 3.11" },
            ]}
          />
          <Textarea
            label="自訂腳本程式碼"
            required
            value={codeVal}
            onChange={(e) => updateParam("code", e.target.value)}
            placeholder="請輸入自訂邏輯程式碼..."
            errorMessage={!codeVal.trim() ? "自訂腳本程式碼不可為空" : undefined}
          />
        </>
      );
    }

    case "edit-field":
    case "edit-area": {
      const fieldNameVal = params.fieldName !== undefined ? params.fieldName : "user_status";
      const fieldValueVal =
        params.fieldValue !== undefined ? params.fieldValue : "{{input.raw_score >= 60 ? 'pass' : 'fail'}}";
      return (
        <>
          <Input
            label="目標欄位名稱"
            required
            value={fieldNameVal}
            onChange={(e) => updateParam("fieldName", e.target.value)}
            placeholder="例如 tags 或 status"
            errorMessage={!fieldNameVal.trim() ? "目標欄位名稱不可為空" : undefined}
          />
          <Input
            label="填入數值或表達式"
            required
            value={fieldValueVal}
            onChange={(e) => updateParam("fieldValue", e.target.value)}
            placeholder="支援字串或 {{變數}} 語法"
            errorMessage={!fieldValueVal.trim() ? "填入數值或表達式不可為空" : undefined}
          />
          <Select
            label="操作模式"
            value={params.action || "set"}
            onChange={(val) => updateParam("action", val)}
            options={[
              { value: "set", label: "覆寫或新增欄位 (Set)" },
              { value: "delete", label: "刪除欄位 (Remove)" },
              { value: "rename", label: "欄位重新命名 (Rename)" },
            ]}
          />
          <Switch
            label="強制型別轉換為字串"
            checked={params.forceString || false}
            onChange={(checked) => updateParam("forceString", checked)}
          />
        </>
      );
    }

    case "datetime": {
      const sourceDateVal = params.sourceDate !== undefined ? params.sourceDate : "{{input.createdAt}}";
      return (
        <>
          <Input
            label="日期來源欄位"
            required
            value={sourceDateVal}
            onChange={(e) => updateParam("sourceDate", e.target.value)}
            placeholder="{{input.timestamp}}"
            errorMessage={!sourceDateVal.trim() ? "日期來源欄位不可為空" : undefined}
          />
          <Select
            label="目標輸出格式"
            value={params.format || "YYYY-MM-DD HH:mm:ss"}
            onChange={(val) => updateParam("format", val)}
            options={[
              { value: "YYYY-MM-DD HH:mm:ss", label: "YYYY-MM-DD HH:mm:ss" },
              { value: "YYYY/MM/DD", label: "YYYY/MM/DD" },
              { value: "ISO_8601", label: "ISO 8601 國際格式" },
              { value: "TIMESTAMP", label: "Unix 時間戳 (毫秒)" },
            ]}
          />
          <Select
            label="轉換目標時區"
            value={params.timezone || "Asia/Taipei"}
            onChange={(val) => updateParam("timezone", val)}
            options={[
              { value: "Asia/Taipei", label: "台北時間 (UTC+8)" },
              { value: "UTC", label: "UTC 國際標準" },
              { value: "Asia/Tokyo", label: "東京時間 (UTC+9)" },
            ]}
          />
          <Switch
            label="輸出保留毫秒"
            checked={params.includeMs || false}
            onChange={(checked) => updateParam("includeMs", checked)}
          />
        </>
      );
    }

    case "json-convert":
      return (
        <>
          <Select
            label="轉換類型"
            value={params.convertType || "parse"}
            onChange={(val) => updateParam("convertType", val)}
            options={[
              { value: "parse", label: "JSON 字串 轉 物件 (JSON.parse)" },
              { value: "stringify", label: "物件 轉 JSON 字串 (JSON.stringify)" },
              { value: "csv_to_json", label: "CSV 表格 轉 JSON 陣列" },
              { value: "json_to_csv", label: "JSON 陣列 轉 CSV 表格" },
            ]}
          />
          <Switch
            label="格式美化縮排 (Pretty Print)"
            checked={params.pretty !== false}
            onChange={(checked) => updateParam("pretty", checked)}
          />
          <Switch
            label="容錯模式 (忽略語法錯誤)"
            checked={params.safeMode || false}
            onChange={(checked) => updateParam("safeMode", checked)}
          />
        </>
      );

    // ---------------------------------------------------------
    // 3. Data: 篩選與彙整
    // ---------------------------------------------------------
    case "filter": {
      const filterKeyVal = params.filterKey !== undefined ? params.filterKey : "status";
      const expectedVal = params.expectedValue !== undefined ? params.expectedValue : "active";
      return (
        <>
          <Input
            label="過濾鍵值欄位"
            required
            value={filterKeyVal}
            onChange={(e) => updateParam("filterKey", e.target.value)}
            placeholder="例如 status 或 category"
            errorMessage={!filterKeyVal.trim() ? "過濾鍵值欄位不可為空" : undefined}
          />
          <Input
            label="目標期望比對值"
            required
            value={expectedVal}
            onChange={(e) => updateParam("expectedValue", e.target.value)}
            placeholder="例如 active 或 completed"
            errorMessage={!expectedVal.trim() ? "目標期望比對值不可為空" : undefined}
          />
          <Select
            label="篩選規則邏輯"
            value={params.logic || "AND"}
            onChange={(val) => updateParam("logic", val)}
            options={[
              { value: "AND", label: "符合全部條件 (AND)" },
              { value: "OR", label: "符合任一條件 (OR)" },
            ]}
          />
          <Switch
            label="忽略英文字母大小寫"
            checked={params.caseInsensitive !== false}
            onChange={(checked) => updateParam("caseInsensitive", checked)}
          />
        </>
      );
    }

    case "limit":
      return (
        <>
          <Input
            type="number"
            label="限制擷取筆數"
            required
            value={params.limitCount !== undefined ? params.limitCount : 20}
            onChange={(e) => updateParam("limitCount", e.target.value === "" ? "" : Number(e.target.value))}
            suffixIcon={<span className="text-caption-2 font-mono">筆</span>}
            min={1}
            max={5000}
            errorMessage={!params.limitCount ? "限制擷取筆數不可為空" : undefined}
          />
          <Input
            type="number"
            label="跳過起始偏移量 (Offset)"
            value={params.offset !== undefined ? params.offset : 0}
            onChange={(e) => updateParam("offset", e.target.value === "" ? "" : Number(e.target.value))}
            suffixIcon={<span className="text-caption-2 font-mono">筆</span>}
            min={0}
          />
          <Select
            label="擷取策略"
            value={params.strategy || "first"}
            onChange={(val) => updateParam("strategy", val)}
            options={[
              { value: "first", label: "取最前面 N 筆" },
              { value: "last", label: "取最後面 N 筆" },
              { value: "random", label: "隨機均勻抽樣" },
            ]}
          />
        </>
      );

    case "deduplicate": {
      const uniqueKeyVal = params.uniqueKey !== undefined ? params.uniqueKey : "email";
      return (
        <>
          <Input
            label="去重唯一識別鍵 (Key)"
            required
            value={uniqueKeyVal}
            onChange={(e) => updateParam("uniqueKey", e.target.value)}
            placeholder="例如 id 或 email"
            errorMessage={!uniqueKeyVal.trim() ? "去重唯一識別鍵不可為空" : undefined}
          />
          <Select
            label="重複資料保留策略"
            value={params.keepPolicy || "first"}
            onChange={(val) => updateParam("keepPolicy", val)}
            options={[
              { value: "first", label: "保留最先出現之資料紀錄" },
              { value: "last", label: "保留最後出現之最新資料紀錄" },
              { value: "remove_all", label: "全部剔除不保留" },
            ]}
          />
          <Switch
            label="嚴格區分大小寫"
            checked={params.strictCase || false}
            onChange={(checked) => updateParam("strictCase", checked)}
          />
        </>
      );
    }

    case "statistics": {
      const metricFieldVal = params.metricField !== undefined ? params.metricField : "amount";
      return (
        <>
          <Input
            label="計算目標數值欄位"
            required
            value={metricFieldVal}
            onChange={(e) => updateParam("metricField", e.target.value)}
            placeholder="例如 amount 或 duration"
            errorMessage={!metricFieldVal.trim() ? "計算目標數值欄位不可為空" : undefined}
          />
          <Input
            label="分組欄位 (Group By)"
            value={params.groupBy !== undefined ? params.groupBy : "department"}
            onChange={(e) => updateParam("groupBy", e.target.value)}
            placeholder="例如 department 或 region"
          />
          <Input
            type="number"
            label="小數點四捨五入位數"
            value={params.decimals !== undefined ? params.decimals : 2}
            onChange={(e) => updateParam("decimals", e.target.value === "" ? "" : Number(e.target.value))}
            suffixIcon={<span className="text-caption-2 font-mono">位</span>}
            min={0}
            max={6}
          />
          <Select
            label="聚合運算函式"
            value={params.aggregateFunc || "sum"}
            onChange={(val) => updateParam("aggregateFunc", val)}
            options={[
              { value: "sum", label: "加總總額 (SUM)" },
              { value: "avg", label: "平均值 (AVG)" },
              { value: "max", label: "最大值 (MAX)" },
              { value: "min", label: "最小值 (MIN)" },
              { value: "count", label: "資料筆數 (COUNT)" },
            ]}
          />
        </>
      );
    }

    // ---------------------------------------------------------
    // 4. AI: 語言模型與代理
    // ---------------------------------------------------------
    case "llm": {
      const promptVal =
        params.systemPrompt !== undefined
          ? params.systemPrompt
          : (params.prompt !== undefined
              ? params.prompt
              : "你是一個專業的流程自動化分析專家，請根據上游輸入的資料進行繁體中文摘要。");
      return (
        <>
          <Input
            type="number"
            label="最大生成 Token"
            value={params.maxTokens !== undefined ? params.maxTokens : 2048}
            onChange={(e) => updateParam("maxTokens", e.target.value === "" ? "" : Number(e.target.value))}
            suffixIcon={<span className="text-caption-2 font-mono">tokens</span>}
            min={128}
            max={8192}
          />
          <Select
            label="模型供應商與版本"
            value={params.model || "gemini-1.5-pro"}
            onChange={(val) => updateParam("model", val)}
            options={[
              { value: "gemini-1.5-pro", label: "Google Gemini 1.5 Pro" },
              { value: "gpt-4o", label: "OpenAI GPT-4o" },
              { value: "claude-3-5-sonnet", label: "Anthropic Claude 3.5 Sonnet" },
              { value: "deepseek-v3", label: "DeepSeek V3" },
            ]}
          />
          <Textarea
            label="系統提示詞 (System Prompt)"
            required
            value={promptVal}
            onChange={(e) => {
              updateParam("systemPrompt", e.target.value);
              updateParam("prompt", e.target.value);
            }}
            placeholder="定義模型角色與回覆規則..."
            errorMessage={!promptVal.trim() ? "系統提示詞不可為空" : undefined}
          />
          <Switch
            label="串流傳輸回應 (Streaming)"
            checked={params.streaming !== false}
            onChange={(checked) => updateParam("streaming", checked)}
          />
          <Slider
            label="創意度 (Temperature)"
            showValue
            value={params.temperature ?? 0.7}
            onChange={(val) => updateParam("temperature", val)}
            min={0}
            max={1}
            step={0.1}
            formatValue={(v) => `${v}`}
          />
        </>
      );
    }

    case "ai-agent": {
      const agentRoleVal = params.agentRole !== undefined ? params.agentRole : "客服智慧分流代理";
      return (
        <>
          <Input
            label="代理名稱與角色"
            required
            value={agentRoleVal}
            onChange={(e) => updateParam("agentRole", e.target.value)}
            placeholder="例如 輿情監測代理"
            errorMessage={!agentRoleVal.trim() ? "代理名稱與角色不可為空" : undefined}
          />
          <Input
            type="number"
            label="最大探索步驟數"
            value={params.maxSteps !== undefined ? params.maxSteps : 5}
            onChange={(e) => updateParam("maxSteps", e.target.value === "" ? "" : Number(e.target.value))}
            suffixIcon={<span className="text-caption-2 font-mono">步</span>}
            min={1}
            max={20}
          />
          <Select
            label="自主思考模式"
            value={params.thinkingMode || "react"}
            onChange={(val) => updateParam("thinkingMode", val)}
            options={[
              { value: "react", label: "ReAct (思考 + 動作迭代)" },
              { value: "plan_and_solve", label: "Plan & Solve (先規劃再執行)" },
              { value: "direct", label: "直接推論回答" },
            ]}
          />
          <Switch
            label="允許調用外部工具與 API"
            checked={params.allowTools !== false}
            onChange={(checked) => updateParam("allowTools", checked)}
          />
        </>
      );
    }

    case "structured-extract": {
      const schemaVal =
        params.schema !== undefined
          ? params.schema
          : '{\n  "type": "object",\n  "properties": {\n    "name": { "type": "string" },\n    "email": { "type": "string" },\n    "intent": { "type": "string" }\n  },\n  "required": ["name", "email"]\n}';
      return (
        <>
          <Textarea
            label="目標 JSON Schema 定義"
            required
            value={schemaVal}
            onChange={(e) => updateParam("schema", e.target.value)}
            placeholder="輸入 JSON Schema 規範..."
            errorMessage={!schemaVal.trim() ? "目標 JSON Schema 定義不可為空" : undefined}
          />
          <Switch
            label="自動填充缺漏欄位為 null"
            checked={params.fillMissing !== false}
            onChange={(checked) => updateParam("fillMissing", checked)}
          />
          <Slider
            label="置信度門檻 (Confidence)"
            showValue
            value={params.confidence ?? 80}
            onChange={(val) => updateParam("confidence", val)}
            min={10}
            max={100}
            step={5}
            formatValue={(v) => `${v}%`}
          />
        </>
      );
    }

    // ---------------------------------------------------------
    // 5. AI: 知識庫與檢索
    // ---------------------------------------------------------
    case "kb-qa":
      return (
        <>
          <Input
            type="number"
            label="檢索最相關片段數 (Top-K)"
            value={params.topK || 4}
            onChange={(e) => updateParam("topK", Number(e.target.value))}
            suffixIcon={<span className="text-caption-2 font-mono">篇</span>}
            min={1}
            max={20}
          />
          <Select
            label="關聯知識庫"
            value={params.kbId || "product-faq"}
            onChange={(val) => updateParam("kbId", val)}
            options={[
              { value: "product-faq", label: "產品常見問題知識庫 (FAQ)" },
              { value: "api-docs", label: "系統開發規格書庫" },
              { value: "hr-policy", label: "企業內部規章手冊" },
            ]}
          />
          <Switch
            label="回覆附帶原文引用出處"
            checked={params.citeSources !== false}
            onChange={(checked) => updateParam("citeSources", checked)}
          />
          <Switch
            label="啟用語義重排序 (Rerank)"
            checked={params.enableRerank !== false}
            onChange={(checked) => updateParam("enableRerank", checked)}
          />
        </>
      );

    case "vector-search":
      return (
        <>
          <Select
            label="向量資料庫連線"
            value={params.dbType || "pinecone"}
            onChange={(val) => updateParam("dbType", val)}
            options={[
              { value: "pinecone", label: "Pinecone (雲端託管)" },
              { value: "qdrant", label: "Qdrant Cluster" },
              { value: "milvus", label: "Milvus 專屬實例" },
            ]}
          />
          <Select
            label="相似度演算法"
            value={params.metric || "cosine"}
            onChange={(val) => updateParam("metric", val)}
            options={[
              { value: "cosine", label: "餘弦相似度 (Cosine)" },
              { value: "euclidean", label: "歐幾里得距離 (L2)" },
              { value: "dot_product", label: "內積 (Dot Product)" },
            ]}
          />
          <Slider
            label="最低相似度門檻 (Min Score)"
            showValue
            value={params.minScore ?? 75}
            onChange={(val) => updateParam("minScore", val)}
            min={50}
            max={99}
            step={1}
            formatValue={(v) => `${v}%`}
          />
        </>
      );

    case "text-embedding":
      return (
        <>
          <Input
            type="number"
            label="批次處理大小 (Batch Size)"
            value={params.batchSize || 32}
            onChange={(e) => updateParam("batchSize", Number(e.target.value))}
            suffixIcon={<span className="text-caption-2 font-mono">筆/批</span>}
            min={1}
            max={256}
          />
          <Select
            label="向量嵌入模型"
            value={params.embeddingModel || "text-embedding-3-small"}
            onChange={(val) => updateParam("embeddingModel", val)}
            options={[
              { value: "text-embedding-3-small", label: "OpenAI text-embedding-3-small (1536維)" },
              { value: "text-embedding-3-large", label: "OpenAI text-embedding-3-large (3072維)" },
              { value: "bge-m3", label: "BGE-M3 (多語言高精度)" },
            ]}
          />
          <Switch
            label="自動截斷超長文字"
            checked={params.autoTruncate !== false}
            onChange={(checked) => updateParam("autoTruncate", checked)}
          />
        </>
      );

    // ---------------------------------------------------------
    // 6. AI: 多模態轉換
    // ---------------------------------------------------------
    case "image-gen": {
      const promptVal =
        params.prompt !== undefined ? params.prompt : "極簡現代風格的企業資料工作流程視覺圖，科技藍白色調";
      return (
        <>
          <Select
            label="圖像生成模型"
            value={params.imageModel || "dall-e-3"}
            onChange={(val) => updateParam("imageModel", val)}
            options={[
              { value: "dall-e-3", label: "OpenAI DALL·E 3" },
              { value: "imagen-3", label: "Google Imagen 3" },
              { value: "flux-schnell", label: "FLUX.1 Schnell" },
            ]}
          />
          <Select
            label="生成畫面比例"
            value={params.aspectRatio || "1:1"}
            onChange={(val) => updateParam("aspectRatio", val)}
            options={[
              { value: "1:1", label: "1:1 (正方形 1024x1024)" },
              { value: "16:9", label: "16:9 (橫式 1792x1024)" },
              { value: "9:16", label: "9:16 (直式 1024x1792)" },
            ]}
          />
          <Textarea
            label="繪圖提示詞 (Prompt)"
            required
            value={promptVal}
            onChange={(e) => updateParam("prompt", e.target.value)}
            placeholder="請輸入圖像風格與內容描述..."
            errorMessage={!promptVal.trim() ? "繪圖提示詞不可為空" : undefined}
          />
          <Switch
            label="啟用高清增強模式 (HD Quality)"
            checked={params.hdQuality || false}
            onChange={(checked) => updateParam("hdQuality", checked)}
          />
        </>
      );
    }

    case "speech-to-text":
      return (
        <>
          <Select
            label="語音辨識模型"
            value={params.sttModel || "whisper-large-v3"}
            onChange={(val) => updateParam("sttModel", val)}
            options={[
              { value: "whisper-large-v3", label: "OpenAI Whisper Large v3" },
              { value: "google-stt", label: "Google Cloud Speech-to-Text" },
            ]}
          />
          <Select
            label="音訊語言"
            value={params.language || "zh-TW"}
            onChange={(val) => updateParam("language", val)}
            options={[
              { value: "auto", label: "自動偵測語言" },
              { value: "zh-TW", label: "繁體中文 (台灣)" },
              { value: "en-US", label: "英語 (美國)" },
              { value: "ja-JP", label: "日語 (日本)" },
            ]}
          />
          <Switch
            label="輸出逐句時間戳 (Timestamps)"
            checked={params.withTimestamps !== false}
            onChange={(checked) => updateParam("withTimestamps", checked)}
          />
          <Switch
            label="自動降噪濾波"
            checked={params.denoise !== false}
            onChange={(checked) => updateParam("denoise", checked)}
          />
        </>
      );

    case "text-to-speech":
      return (
        <>
          <Select
            label="合成語音音色"
            value={params.voice || "alloy"}
            onChange={(val) => updateParam("voice", val)}
            options={[
              { value: "alloy", label: "Alloy (溫和自然)" },
              { value: "echo", label: "Echo (沉穩男聲)" },
              { value: "shimmer", label: "Shimmer (親切女聲)" },
            ]}
          />
          <Select
            label="輸出音訊格式"
            value={params.audioFormat || "mp3"}
            onChange={(val) => updateParam("audioFormat", val)}
            options={[
              { value: "mp3", label: "MP3 (通用輕量)" },
              { value: "wav", label: "WAV (無損音質)" },
              { value: "aac", label: "AAC (行動端專用)" },
            ]}
          />
          <Slider
            label="語速倍率 (Speed)"
            showValue
            value={params.speed ?? 1.0}
            onChange={(val) => updateParam("speed", val)}
            min={0.5}
            max={2.0}
            step={0.1}
            formatValue={(v) => `${v}x`}
          />
        </>
      );

    // ---------------------------------------------------------
    // 7. API: 觸發與通訊協定
    // ---------------------------------------------------------
    case "webhook": {
      const webhookEndpoint =
        params.url !== undefined
          ? params.url
          : (params.path !== undefined ? params.path : "/api/v1/webhook/events");
      const isWebhookEmpty = !webhookEndpoint.trim();
      return (
        <>
          <Input
            label="接收端點 (URL / Path)"
            required
            value={webhookEndpoint}
            onChange={(e) => {
              updateParam("url", e.target.value);
              updateParam("path", e.target.value);
            }}
            placeholder="/api/v1/webhook 或 https://api.example.com/webhook"
            helperText="系統將自動分配完整 HTTPS URL"
            error={isWebhookEmpty}
            errorMessage={isWebhookEmpty ? "請輸入 Webhook 目標網址或端點" : undefined}
          />
          {params.verifySignature && (
            <Input
              label="密鑰金鑰 (Secret Key)"
              required
              value={params.secretKey !== undefined ? params.secretKey : ""}
              onChange={(e) => updateParam("secretKey", e.target.value)}
              placeholder="輸入安全簽名金鑰..."
              errorMessage={!params.secretKey?.trim() ? "已啟用簽名校驗，請輸入密鑰金鑰" : undefined}
            />
          )}
          <Select
            label="監聽 HTTP 方法"
            value={params.method || "POST"}
            onChange={(val) => updateParam("method", val)}
            options={[
              { value: "POST", label: "POST (推薦資料推播)" },
              { value: "GET", label: "GET (查詢請求)" },
              { value: "PUT", label: "PUT (更新請求)" },
            ]}
          />
          <Switch
            label="啟用密鑰簽名校驗 (HMAC)"
            checked={params.verifySignature || false}
            onChange={(checked) => updateParam("verifySignature", checked)}
          />
        </>
      );
    }

    case "http-request": {
      const requestUrl = params.url !== undefined ? params.url : "https://api.example.com/v1/data";
      const isUrlEmpty = !requestUrl.trim();
      const isUrlInvalid = !isUrlEmpty && !requestUrl.startsWith("http://") && !requestUrl.startsWith("https://");
      return (
        <>
          <Input
            label="API 請求網址 (URL)"
            required
            value={requestUrl}
            onChange={(e) => updateParam("url", e.target.value)}
            placeholder="https://api.example.com/endpoint"
            error={isUrlEmpty || isUrlInvalid}
            errorMessage={
              isUrlEmpty
                ? "請輸入目標請求網址 (URL)"
                : isUrlInvalid
                  ? "URL 格式無效，須以 http:// 或 https:// 開頭"
                  : undefined
            }
          />
          <Input
            type="number"
            label="超時等待限制"
            value={params.timeout !== undefined ? params.timeout : 30}
            onChange={(e) => updateParam("timeout", e.target.value === "" ? "" : Number(e.target.value))}
            suffixIcon={<span className="text-caption-2 font-mono">秒</span>}
            min={1}
            max={300}
          />
          <Select
            label="HTTP 方法"
            value={params.httpMethod || "GET"}
            onChange={(val) => updateParam("httpMethod", val)}
            options={[
              { value: "GET", label: "GET (取得資料)" },
              { value: "POST", label: "POST (建立資源)" },
              { value: "PUT", label: "PUT (更新資源)" },
              { value: "DELETE", label: "DELETE (刪除資源)" },
            ]}
          />
          <Textarea
            label="請求標頭 (Headers JSON)"
            value={
              params.headers !== undefined
                ? params.headers
                : '{\n  "Authorization": "Bearer {{env.API_KEY}}",\n  "Content-Type": "application/json"\n}'
            }
            onChange={(e) => updateParam("headers", e.target.value)}
          />
          <Switch
            label="遇伺服器錯誤 (5xx) 自動重試"
            checked={params.retryOnError !== false}
            onChange={(checked) => updateParam("retryOnError", checked)}
          />
        </>
      );
    }

    case "sub-workflow":
      return (
        <>
          <Select
            label="選擇調用之子工作流程"
            value={params.subFlowId || "flow-clean-data"}
            onChange={(val) => updateParam("subFlowId", val)}
            options={[
              { value: "flow-clean-data", label: "資料清洗標準化流程" },
              { value: "flow-send-report", label: "營運日報彙總分發流程" },
              { value: "flow-audit", label: "合規稽核自動審查流程" },
            ]}
          />
          <Switch
            label="等待子工作流程執行完成"
            checked={params.waitForCompletion !== false}
            onChange={(checked) => updateParam("waitForCompletion", checked)}
          />
          <Switch
            label="子流程失敗時中止主流程"
            checked={params.failParentOnSubError || false}
            onChange={(checked) => updateParam("failParentOnSubError", checked)}
          />
        </>
      );

    // ---------------------------------------------------------
    // 8. API: 常用應用服務
    // ---------------------------------------------------------
    case "google-sheets": {
      const currentSheetId =
        params.spreadsheetId !== undefined
          ? params.spreadsheetId
          : (params.sheetId !== undefined ? params.sheetId : "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs");
      const currentSheetName = params.sheetName !== undefined ? params.sheetName : "Sheet1";
      return (
        <>
          <Input
            label="試算表 ID (Spreadsheet ID)"
            required
            value={currentSheetId}
            onChange={(e) => {
              updateParam("spreadsheetId", e.target.value);
              updateParam("sheetId", e.target.value);
            }}
            placeholder="輸入試算表網址中的長代碼或檔案名稱..."
            errorMessage={!currentSheetId.trim() ? "尚未指定試算表 ID 或檔案名稱" : undefined}
          />
          <Input
            label="工作表分頁名稱"
            required
            value={currentSheetName}
            onChange={(e) => updateParam("sheetName", e.target.value)}
            placeholder="工作表名稱..."
            errorMessage={!currentSheetName.trim() ? "尚未填寫工作表名稱" : undefined}
          />
          <Select
            label="Google 連線帳戶"
            value={params.account || "corp"}
            onChange={(val) => updateParam("account", val)}
            options={[
              { value: "corp", label: "企業專用 (admin@company.com)" },
              { value: "service", label: "Google Service Account" },
            ]}
          />
          <Select
            label="執行操作"
            value={params.action || "append"}
            onChange={(val) => updateParam("action", val)}
            options={[
              { value: "append", label: "新增列資料 (Append Row)" },
              { value: "read", label: "讀取範圍資料 (Read Range)" },
              { value: "update", label: "更新指定儲存格 (Update Cell)" },
            ]}
          />
        </>
      );
    }

    case "google-docs": {
      const docTitleVal = params.docTitle !== undefined ? params.docTitle : "自動化報告_{{datetime}}";
      return (
        <>
          <Input
            label="目標文件標題"
            required
            value={docTitleVal}
            onChange={(e) => updateParam("docTitle", e.target.value)}
            placeholder="請輸入文件標題..."
            errorMessage={!docTitleVal.trim() ? "目標文件標題不可為空" : undefined}
          />
          <Input
            label="儲存至 Google 雲端硬碟資料夾 ID"
            value={params.folderId !== undefined ? params.folderId : "1Ax7G...FolderId"}
            onChange={(e) => updateParam("folderId", e.target.value)}
            placeholder="資料夾 ID..."
          />
          <Select
            label="文件處理模式"
            value={params.docMode || "create"}
            onChange={(val) => updateParam("docMode", val)}
            options={[
              { value: "create", label: "根據範本建立新文件" },
              { value: "append", label: "在文件尾端追加段落" },
              { value: "replace", label: "批次替換文件變數標籤" },
            ]}
          />
        </>
      );
    }

    case "bot-integration": {
      const channelVal = params.channel !== undefined ? params.channel : "#cs-emergency";
      const messageVal =
        params.message !== undefined
          ? params.message
          : "🚀 **工作流程事件通知**\n- 項目: {{input.title}}\n- 狀態: {{input.status}}\n- 時間: {{datetime}}";
      return (
        <>
          <Input
            label="接收頻道 / 群組 ID"
            required
            value={channelVal}
            onChange={(e) => updateParam("channel", e.target.value)}
            placeholder="例如 -10019283749 或 #general"
            errorMessage={!channelVal.trim() ? "接收頻道 / 群組 ID 不可為空" : undefined}
          />
          <Select
            label="通訊機器人平台"
            value={params.platform || "telegram"}
            onChange={(val) => updateParam("platform", val)}
            options={[
              { value: "telegram", label: "Telegram Bot" },
              { value: "slack", label: "Slack Incoming Webhook" },
              { value: "discord", label: "Discord Bot" },
            ]}
          />
          <Textarea
            label="推播訊息內容 (Markdown)"
            required
            value={messageVal}
            onChange={(e) => updateParam("message", e.target.value)}
            placeholder="輸入要發送的通知文字..."
            errorMessage={!messageVal.trim() ? "推播訊息內容不可為空" : undefined}
          />
          <Switch
            label="發送靜音訊息 (無提示音)"
            checked={params.silent || false}
            onChange={(checked) => updateParam("silent", checked)}
          />
        </>
      );
    }

    case "email-send": {
      const emailRecipient =
        params.recipient !== undefined
          ? params.recipient
          : (params.to !== undefined ? params.to : "operations@company.com");
      const emailSubject =
        params.subject !== undefined ? params.subject : "【系統通知】流程自動執行完成報告";
      const isRecipientEmpty = !emailRecipient.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isRecipientInvalid = !isRecipientEmpty && !emailRegex.test(emailRecipient.trim());
      const isSubjectEmpty = !emailSubject.trim();
      return (
        <>
          <Input
            label="收件人信箱 (To)"
            required
            value={emailRecipient}
            onChange={(e) => {
              updateParam("recipient", e.target.value);
              updateParam("to", e.target.value);
            }}
            placeholder="recipient@example.com"
            error={isRecipientEmpty || isRecipientInvalid}
            errorMessage={
              isRecipientEmpty
                ? "收件人信箱尚未填寫"
                : isRecipientInvalid
                  ? "收件人 Email 格式不正確"
                  : undefined
            }
          />
          <Input
            label="信件主旨 (Subject)"
            required
            value={emailSubject}
            onChange={(e) => updateParam("subject", e.target.value)}
            placeholder="請輸入郵件主旨..."
            error={isSubjectEmpty}
            errorMessage={isSubjectEmpty ? "尚未填寫信件主旨" : undefined}
          />
          <Select
            label="內容排版格式"
            value={params.bodyType || "html"}
            onChange={(val) => updateParam("bodyType", val)}
            options={[
              { value: "html", label: "HTML 豐富排版" },
              { value: "plain", label: "純文字 (Plain Text)" },
            ]}
          />
          <Textarea
            label="信件內容"
            value={
              params.body !== undefined
                ? params.body
                : "<h2>工作流程已成功執行</h2><p>詳細結果請登入控制台檢視。</p>"
            }
            onChange={(e) => updateParam("body", e.target.value)}
          />
        </>
      );
    }

    // ---------------------------------------------------------
    // 9. API: 資料庫與雲端
    // ---------------------------------------------------------
    case "database":
    case "database-tool": {
      const queryVal =
        params.query !== undefined
          ? params.query
          : "SELECT id, title, score, created_at\nFROM customer_records\nWHERE score >= 80\nORDER BY created_at DESC\nLIMIT 50;";
      return (
        <>
          <Select
            label="資料庫類型"
            value={params.dbEngine || "postgres"}
            onChange={(val) => updateParam("dbEngine", val)}
            options={[
              { value: "postgres", label: "PostgreSQL" },
              { value: "mysql", label: "MySQL 8.0" },
              { value: "mongodb", label: "MongoDB" },
              { value: "redis", label: "Redis" },
            ]}
          />
          <Select
            label="執行操作"
            value={params.sqlAction || "select"}
            onChange={(val) => updateParam("sqlAction", val)}
            options={[
              { value: "select", label: "查詢資料 (SELECT)" },
              { value: "insert", label: "新增紀錄 (INSERT)" },
              { value: "update", label: "更新紀錄 (UPDATE)" },
              { value: "delete", label: "刪除紀錄 (DELETE)" },
            ]}
          />
          <Textarea
            label="SQL 語法指令"
            required
            value={queryVal}
            onChange={(e) => updateParam("query", e.target.value)}
            placeholder="請輸入 SQL 語法..."
            errorMessage={!queryVal.trim() ? "SQL 語法指令不可為空" : undefined}
          />
          <Switch
            label="啟用交易安全鎖定 (Transaction)"
            checked={params.transaction !== false}
            onChange={(checked) => updateParam("transaction", checked)}
          />
        </>
      );
    }

    case "cloud-storage": {
      const bucketVal =
        params.bucket !== undefined ? params.bucket : "workflow-prod-artifacts";
      return (
        <>
          <Input
            label="儲存貯體名稱 (Bucket)"
            required
            value={bucketVal}
            onChange={(e) => updateParam("bucket", e.target.value)}
            placeholder="my-bucket-name"
            errorMessage={!bucketVal.trim() ? "儲存貯體名稱不可為空" : undefined}
          />
          <Select
            label="雲端儲存服務商"
            value={params.provider || "s3"}
            onChange={(val) => updateParam("provider", val)}
            options={[
              { value: "s3", label: "Amazon S3" },
              { value: "gcs", label: "Google Cloud Storage" },
              { value: "r2", label: "Cloudflare R2" },
            ]}
          />
          <Select
            label="物件操作"
            value={params.storageAction || "put"}
            onChange={(val) => updateParam("storageAction", val)}
            options={[
              { value: "put", label: "上傳檔案 (Put Object)" },
              { value: "get", label: "下載檔案 (Get Object)" },
              { value: "signed_url", label: "產生暫時預簽名下載連結" },
            ]}
          />
          <Switch
            label="設定公開可讀取權限 (Public Read)"
            checked={params.isPublic || false}
            onChange={(checked) => updateParam("isPublic", checked)}
          />
        </>
      );
    }

    default:
      return (
        <>
          <Input
            label="備註描述"
            value={params.notes || ""}
            onChange={(e) => updateParam("notes", e.target.value)}
            placeholder="自訂此節點設定說明..."
          />
          <Switch
            label="啟用此節點"
            checked={params.enabled !== false}
            onChange={(checked) => updateParam("enabled", checked)}
          />
        </>
      );
  }
}

export default NodeDetailPanel;
