/**
 * 節點驗證工具與預設值管理器 (Node Validation & Defaults Utility)
 *
 * 支援三種驗證狀態：
 * 1. error (嚴重錯誤 / 內容不合法) -> 標示紅框警示 + 錯誤 Badge
 * 2. warning (尚未填寫完整 / 必填項為空) -> 標示黃色 Badge + 提醒
 * 3. valid (內容齊全無誤) -> 保持正常卡片外觀，無錯誤訊息
 */

export const DEFAULT_NODE_PARAMS = {
  // 1. 流程控制與觸發
  trigger: {
    triggerType: "schedule",
    time: "10:00 AM",
    date: "Oct 18, 2026",
    cron: "0 10 * * *",
    timezone: "Asia/Taipei",
    active: true,
  },
  tigger: {
    triggerType: "schedule",
    time: "10:00 AM",
    date: "Oct 18, 2026",
    cron: "0 10 * * *",
    timezone: "Asia/Taipei",
    active: true,
  },
  branch: {
    field: "{{input.score}}",
    targetValue: "80",
    operator: ">=",
    enableElse: true,
    condition: "{{input.score}} >= 80",
  },
  loop: {
    arrayPath: "{{input.items}}",
    maxIterations: 100,
    breakOnError: false,
    concurrency: 3,
  },
  delay: {
    mode: "fixed",
    delaySeconds: 5,
    time: "10:00 AM",
    date: "Oct 18, 2026",
    allowEarlyWakeup: false,
  },

  // 2. 資料轉換與處理
  code: {
    timeout: 10,
    language: "javascript",
    code: "// 輸入資料於 input 物件中\nreturn {\n  ...input,\n  processedAt: new Date().toISOString()\n};",
  },
  "edit-field": {
    fieldName: "user_status",
    fieldValue: "{{input.raw_score >= 60 ? 'pass' : 'fail'}}",
    action: "set",
    forceString: false,
  },
  "edit-area": {
    fieldName: "user_status",
    fieldValue: "{{input.raw_score >= 60 ? 'pass' : 'fail'}}",
    action: "set",
    forceString: false,
  },
  datetime: {
    sourceDate: "{{input.createdAt}}",
    format: "YYYY-MM-DD HH:mm:ss",
    timezone: "Asia/Taipei",
    includeMs: false,
  },
  "json-convert": {
    convertType: "parse",
    pretty: true,
    safeMode: false,
  },

  // 3. 篩選與彙整
  filter: {
    filterKey: "status",
    expectedValue: "active",
    logic: "AND",
    caseInsensitive: true,
  },
  limit: {
    limitCount: 20,
    offset: 0,
    strategy: "first",
  },
  deduplicate: {
    uniqueKey: "email",
    keepPolicy: "first",
    strictCase: false,
  },
  statistics: {
    metricField: "amount",
    groupBy: "department",
    decimals: 2,
    aggregateFunc: "sum",
  },

  // 4. AI: 語言模型與代理
  llm: {
    model: "gemini-1.5-pro",
    maxTokens: 2048,
    systemPrompt: "你是一個專業的流程自動化分析專家，請根據上游輸入的資料進行繁體中文摘要。",
    prompt: "你是一個專業的流程自動化分析專家，請根據上游輸入的資料進行繁體中文摘要。",
    streaming: true,
    temperature: 0.7,
  },
  "ai-agent": {
    agentRole: "客服智慧分流代理",
    maxSteps: 5,
    thinkingMode: "react",
    allowTools: true,
  },
  "structured-extract": {
    schema: '{\n  "type": "object",\n  "properties": {\n    "name": { "type": "string" },\n    "email": { "type": "string" },\n    "intent": { "type": "string" }\n  },\n  "required": ["name", "email"]\n}',
    fillMissing: true,
    confidence: 80,
  },

  // 5. AI: 知識庫與檢索
  "kb-qa": {
    topK: 4,
    kbId: "product-faq",
    citeSources: true,
    enableRerank: true,
  },
  "vector-search": {
    dbType: "pinecone",
    metric: "cosine",
    minScore: 75,
  },
  "text-embedding": {
    batchSize: 32,
    embeddingModel: "text-embedding-3-small",
    autoTruncate: true,
  },

  // 6. AI: 多模態轉換
  "image-gen": {
    imageModel: "dall-e-3",
    aspectRatio: "1:1",
    prompt: "極簡現代風格的企業資料工作流程視覺圖，科技藍白色調",
    hdQuality: false,
  },
  "speech-to-text": {
    sttModel: "whisper-large-v3",
    language: "zh-TW",
    withTimestamps: true,
    denoise: true,
  },
  "text-to-speech": {
    voice: "alloy",
    audioFormat: "mp3",
    speed: 1.0,
  },

  // 7. API: 觸發與通訊協定
  webhook: {
    url: "/api/v1/webhook/events",
    path: "/api/v1/webhook/events",
    method: "POST",
    verifySignature: false,
    secretKey: "",
  },
  "http-request": {
    url: "https://api.example.com/v1/data",
    httpMethod: "GET",
    timeout: 30,
    headers: '{\n  "Authorization": "Bearer {{env.API_KEY}}",\n  "Content-Type": "application/json"\n}',
    retryOnError: true,
  },
  "sub-workflow": {
    subFlowId: "flow-clean-data",
    waitForCompletion: true,
    failParentOnSubError: false,
  },

  // 8. API: 常用應用服務
  "google-sheets": {
    spreadsheetId: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs",
    sheetId: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs",
    sheetName: "Sheet1",
    account: "corp",
    action: "append",
  },
  "google-docs": {
    docTitle: "自動化報告_{{datetime}}",
    folderId: "1Ax7G...FolderId",
    docMode: "create",
  },
  "bot-integration": {
    channel: "#cs-emergency",
    platform: "telegram",
    message: "🚀 **工作流程事件通知**\n- 項目: {{input.title}}\n- 狀態: {{input.status}}\n- 時間: {{datetime}}",
    silent: false,
  },
  "email-send": {
    recipient: "operations@company.com",
    to: "operations@company.com",
    subject: "【系統通知】流程自動執行完成報告",
    bodyType: "html",
    body: "<h2>工作流程已成功執行</h2><p>詳細結果請登入控制台檢視。</p>",
  },

  // 9. API: 資料庫與雲端
  database: {
    dbEngine: "postgres",
    sqlAction: "select",
    query: "SELECT id, title, score, created_at\nFROM customer_records\nWHERE score >= 80\nORDER BY created_at DESC\nLIMIT 50;",
    transaction: true,
  },
  "database-tool": {
    dbEngine: "postgres",
    sqlAction: "select",
    query: "SELECT id, title, score, created_at\nFROM customer_records\nWHERE score >= 80\nORDER BY created_at DESC\nLIMIT 50;",
    transaction: true,
  },
  "cloud-storage": {
    bucket: "workflow-prod-artifacts",
    provider: "s3",
    action: "upload",
  },
};

export function getDefaultParamsForTool(toolId) {
  const defaults = DEFAULT_NODE_PARAMS[toolId];
  return defaults ? { ...defaults } : {};
}

export function validateNode(node, connections = [], allNodes = []) {
  if (!node) return { status: "valid" };

  // 1. 若節點已被使用者明確停用，保持正常無錯誤
  if (node.disabled) {
    return { status: "valid" };
  }

  // 2. 自訂顯式錯誤標記 (若有)
  if (node.error || node.hasError) {
    return {
      status: "error",
      blocking: true,
      badgeText: node.errorBadge || "內容錯誤",
      message: node.errorMessage || node.error || "此節點配置有誤，無法進行流程",
    };
  }

  if (node.warning || node.isIncomplete) {
    return {
      status: "warning",
      blocking: false,
      badgeText: "尚未填寫完整",
      message: node.warningMessage || node.warning || "節點部分欄位尚未填寫完整",
    };
  }

  // 3. 節點名稱檢查 (必填)
  const nodeName = node.name !== undefined ? node.name : node.title;
  if (nodeName !== undefined && !String(nodeName).trim()) {
    return {
      status: "error",
      blocking: true,
      badgeText: "內容錯誤",
      message: "節點名稱不可為空",
    };
  }

  const isTrigger =
    node.category === "trigger" ||
    node.toolId === "trigger" ||
    node.toolId === "tigger" ||
    node.id === "trigger-cron" ||
    Boolean(node.isTrigger);

  const toolId = node.toolId || "";
  const defaultParams = getDefaultParamsForTool(toolId);
  const params = {
    ...defaultParams,
    ...(node.params || {}),
  };

  // 4. 各工具特定欄位邏輯檢查
  // A. 定時觸發 (Cron / Once / Webhook)
  if (isTrigger || toolId === "trigger" || toolId === "tigger") {
    const triggerType = params.triggerType || "schedule";
    if (triggerType === "once") {
      if (!params.date || !String(params.date).trim()) {
        return {
          status: "warning",
          blocking: false,
          badgeText: "尚未填寫完整",
          message: "尚未選擇指定觸發日期",
        };
      }
      if (!params.time || !String(params.time).trim()) {
        return {
          status: "warning",
          blocking: false,
          badgeText: "尚未填寫完整",
          message: "尚未選擇指定觸發時間",
        };
      }
    } else if (triggerType === "schedule") {
      if (!params.cron || !String(params.cron).trim()) {
        return {
          status: "error",
          blocking: true,
          badgeText: "內容錯誤",
          message: "排程表達式不可為空",
        };
      }
      const cronParts = String(params.cron).trim().split(/\s+/);
      if (cronParts.length < 5) {
        return {
          status: "error",
          blocking: true,
          badgeText: "內容錯誤",
          message: "Cron 表達式格式無效 (需包含 5 欄位)",
        };
      }
    } else if (triggerType === "webhook") {
      if (!params.webhookPath || !String(params.webhookPath).trim()) {
        return {
          status: "warning",
          blocking: false,
          badgeText: "尚未填寫完整",
          message: "尚未設定 Webhook 接收端點",
        };
      }
    }
  }

  // 延遲等待 (Delay)
  if (toolId === "delay") {
    if (params.mode === "until_time") {
      if (!params.date || !String(params.date).trim() || !params.time || !String(params.time).trim()) {
        return {
          status: "warning",
          blocking: false,
          badgeText: "尚未填寫完整",
          message: "尚未選擇等待喚醒的日期或時間",
        };
      }
    } else if (params.delaySeconds === "" || params.delaySeconds === undefined) {
      return {
        status: "warning",
        blocking: false,
        badgeText: "尚未填寫完整",
        message: "延遲秒數不可為空",
      };
    }
  }

  // B. 網路爬蟲 / HTTP 請求 / Webhook
  if (
    toolId === "http-request" ||
    toolId === "webhook" ||
    node.iconKey === "globe" ||
    node.iconKey === "webhook"
  ) {
    const url = params.url !== undefined ? params.url : params.path;
    if (!url || !String(url).trim()) {
      return {
        status: "warning",
        blocking: false,
        badgeText: "尚未填寫完整",
        message: "請輸入目標請求網址 (URL) 或接收端點",
      };
    }
    const urlStr = String(url).trim();
    if (
      !urlStr.startsWith("http://") &&
      !urlStr.startsWith("https://") &&
      !urlStr.startsWith("/")
    ) {
      return {
        status: "error",
        blocking: true,
        badgeText: "內容錯誤",
        message: "URL 格式無效，須以 http:// 或 https:// 或 / 開頭",
      };
    }
    if (
      params.timeout !== undefined &&
      (isNaN(Number(params.timeout)) || Number(params.timeout) <= 0)
    ) {
      return {
        status: "error",
        blocking: true,
        badgeText: "內容錯誤",
        message: "超時時間必須為大於 0 的正整數",
      };
    }
  }

  // C. 電子郵件 (Email Send)
  if (toolId === "email-send" || node.iconKey === "mail") {
    const recipient = params.recipient !== undefined ? params.recipient : params.to;
    if (!recipient || !String(recipient).trim()) {
      return {
        status: "warning",
        blocking: false,
        badgeText: "尚未填寫完整",
        message: "尚未填寫收件人信箱",
      };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(String(recipient).trim())) {
      return {
        status: "error",
        blocking: true,
        badgeText: "內容錯誤",
        message: "收件人 Email 格式不正確",
      };
    }
    if (!params.subject || !String(params.subject).trim()) {
      return {
        status: "warning",
        blocking: false,
        badgeText: "尚未填寫完整",
        message: "尚未填寫郵件主旨",
      };
    }
  }

  // D. 試算表 (Google Sheets / Excel)
  if (
    toolId === "google-sheets" ||
    toolId === "excel-archive" ||
    node.iconKey === "sheets"
  ) {
    const sheetId = params.spreadsheetId !== undefined ? params.spreadsheetId : params.sheetId;
    if (!sheetId || !String(sheetId).trim()) {
      return {
        status: "warning",
        blocking: false,
        badgeText: "尚未填寫完整",
        message: "尚未指定試算表 ID 或檔案名稱",
      };
    }
    if (!params.sheetName || !String(params.sheetName).trim()) {
      return {
        status: "warning",
        blocking: false,
        badgeText: "尚未填寫完整",
        message: "尚未填寫工作表名稱",
      };
    }
  }

  // E. AI 語言模型 (LLM)
  if (toolId === "llm" || node.category === "ai" || node.iconKey === "sparkles") {
    if (!params.model) {
      return {
        status: "warning",
        blocking: false,
        badgeText: "尚未填寫完整",
        message: "尚未選取 AI 語言模型",
      };
    }
    if (
      params.temperature !== undefined &&
      (Number(params.temperature) < 0 || Number(params.temperature) > 1)
    ) {
      return {
        status: "error",
        blocking: true,
        badgeText: "內容錯誤",
        message: "溫度值必須介於 0.0 至 1.0 之間",
      };
    }
    if (!params.systemPrompt && !params.prompt) {
      return {
        status: "warning",
        blocking: false,
        badgeText: "尚未填寫完整",
        message: "Prompt 提示詞尚未填寫",
      };
    }
  }

  // F. 移除重複 (Deduplicate)
  if (toolId === "deduplicate" || node.iconKey === "copy") {
    if (!params.uniqueKey || !String(params.uniqueKey).trim()) {
      return {
        status: "warning",
        blocking: false,
        badgeText: "尚未填寫完整",
        message: "尚未設定去重依據欄位 (Unique Key)",
      };
    }
  }

  // G. 條件分流 (Branch)
  if (toolId === "branch" || node.category === "branch") {
    const hasField = Boolean(params.field && String(params.field).trim());
    const hasTarget = Boolean(params.targetValue !== undefined && String(params.targetValue).trim() !== "");
    const hasCondition = Boolean(params.condition && String(params.condition).trim());
    if (!hasCondition && (!hasField || !hasTarget)) {
      return {
        status: "warning",
        blocking: false,
        badgeText: "尚未填寫完整",
        message: "尚未設定條件判斷變數或比較值",
      };
    }
  }

  return { status: "valid" };
}
