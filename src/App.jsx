import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import WorkflowLayout from "./layouts/workflowLayout.jsx";
import WorkflowNode from "./components/canves/WorkflowNode.jsx";
import CommentBubble, { CommentDraftBubble } from "./components/canves/CommentBubble.jsx";
import Button from "./components/ui/button.jsx";
import NodeDetailPanel, { TOOL_TITLES, resolveItemTitle } from "./components/detail/NodeDetailPanel.jsx";
import ExecutionHistoryView, { RUNS_DATA } from "./components/history/ExecutionHistoryView.jsx";
import ExecutionDetailPanel from "./components/history/ExecutionDetailPanel.jsx";
import { validateNode, getDefaultParamsForTool } from "./utils/nodeValidation.js";

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

/* 節點圖示庫 */
const NODE_ICONS = {
  calendar: (
    <svg viewBox="0 0 24 24" className="h-20 w-20 stroke-current fill-none stroke-2">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" />
    </svg>
  ),
  database: (
    <svg viewBox="0 0 24 24" className="h-20 w-20 stroke-current fill-none stroke-2">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
    </svg>
  ),
  ai: (
    <svg viewBox="0 0 24 24" className="h-20 w-20 stroke-current fill-none stroke-2">
      <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3Z" />
    </svg>
  ),
  branch: (
    <svg viewBox="0 0 24 24" className="h-20 w-20 stroke-current fill-none stroke-2">
      <circle cx="6" cy="18" r="3" />
      <circle cx="6" cy="6" r="3" />
      <circle cx="18" cy="6" r="3" />
      <path d="M6 9v6M18 9a9 9 0 0 1-9 9" />
    </svg>
  ),
  alert: (
    <svg viewBox="0 0 24 24" className="h-20 w-20 stroke-current fill-none stroke-2">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  archive: (
    <svg viewBox="0 0 24 24" className="h-20 w-20 stroke-current fill-none stroke-2">
      <rect x="2" y="3" width="20" height="5" rx="1" />
      <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8M10 12h4" />
    </svg>
  ),
  code: (
    <svg viewBox="0 0 24 24" className="h-20 w-20 stroke-current fill-none stroke-2">
      <path d="m8 6-6 6 6 6m8-12 6 6-6 6M14 4l-4 16" />
    </svg>
  ),
  filter: (
    <svg viewBox="0 0 24 24" className="h-20 w-20 stroke-current fill-none stroke-2">
      <path d="M3 4h18l-7 8v7l-4 2v-9L3 4Z" />
    </svg>
  ),
  ban: (
    <svg viewBox="0 0 24 24" className="h-20 w-20 stroke-current fill-none stroke-2">
      <circle cx="12" cy="12" r="9" />
      <path d="m6 6 12 12" />
    </svg>
  ),
  copy: (
    <svg viewBox="0 0 24 24" className="h-20 w-20 stroke-current fill-none stroke-2">
      <rect x="8" y="8" width="13" height="13" rx="2" />
      <path d="M16 8V3H3v13h5" />
    </svg>
  ),
  collection: (
    <svg viewBox="0 0 24 24" className="h-20 w-20 stroke-current fill-none stroke-2">
      <path d="m12 3 9 5v9l-9 5-9-5V8l9-5Zm0 10v9M3 8l9 5 9-5M8 5l9 5" />
    </svg>
  ),
  statistics: (
    <svg viewBox="0 0 24 24" className="h-20 w-20 stroke-current fill-none stroke-2">
      <path d="M20 4H5l8 8-8 8h15M3 4v16" />
    </svg>
  ),
  pen: (
    <svg viewBox="0 0 24 24" className="h-20 w-20 stroke-current fill-none stroke-2">
      <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  ),
  robot: (
    <svg viewBox="0 0 24 24" className="h-20 w-20 stroke-current fill-none stroke-2">
      <rect x="4" y="7" width="16" height="13" rx="3" />
      <path d="M12 3v4M1 11v5m22-5v5M8 16h8" />
      <circle cx="8" cy="12" r="1" />
      <circle cx="16" cy="12" r="1" />
    </svg>
  ),
  link: (
    <svg viewBox="0 0 24 24" className="h-20 w-20 stroke-current fill-none stroke-2">
      <path d="m9 15 6-6m-7 4-2 2a4 4 0 0 0 6 6l3-3m1-7 2-2a4 4 0 0 0-6-6L9 6" />
    </svg>
  ),
  trigger: (
    <svg viewBox="0 0 24 24" className="h-20 w-20 stroke-current fill-none stroke-2">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  loop: (
    <svg viewBox="0 0 24 24" className="h-20 w-20 stroke-current fill-none stroke-2">
      <path d="m17 2 4 4-4 4" />
      <path d="M3 11v-1a4 4 0 0 1 4-4h14M7 22l-4-4 4-4" />
      <path d="M21 13v1a4 4 0 0 1-4 4H3" />
    </svg>
  ),
  delay: (
    <svg viewBox="0 0 24 24" className="h-20 w-20 stroke-current fill-none stroke-2">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  json: (
    <svg viewBox="0 0 24 24" className="h-20 w-20 stroke-current fill-none stroke-2">
      <path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5a2 2 0 0 0 2 2h1M16 3h1a2 2 0 0 1 2 2v5a2 2 0 0 0 2 2 2 2 0 0 0-2 2v5a2 2 0 0 1-2 2h-1" />
    </svg>
  ),
  sparkles: (
    <svg viewBox="0 0 24 24" className="h-20 w-20 stroke-current fill-none stroke-2">
      <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3Z" />
      <path d="M5 3v4M3 5h4M19 17v4M17 19h4" />
    </svg>
  ),
  structure: (
    <svg viewBox="0 0 24 24" className="h-20 w-20 stroke-current fill-none stroke-2">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
    </svg>
  ),
  book: (
    <svg viewBox="0 0 24 24" className="h-20 w-20 stroke-current fill-none stroke-2">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  ),
  search: (
    <svg viewBox="0 0 24 24" className="h-20 w-20 stroke-current fill-none stroke-2">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
      <path d="m11 8 2 3-2 3" />
    </svg>
  ),
  embedding: (
    <svg viewBox="0 0 24 24" className="h-20 w-20 stroke-current fill-none stroke-2">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M7 8h10M7 12h6M7 16h8" />
    </svg>
  ),
  image: (
    <svg viewBox="0 0 24 24" className="h-20 w-20 stroke-current fill-none stroke-2">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  ),
  mic: (
    <svg viewBox="0 0 24 24" className="h-20 w-20 stroke-current fill-none stroke-2">
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v3M8 22h8" />
    </svg>
  ),
  speaker: (
    <svg viewBox="0 0 24 24" className="h-20 w-20 stroke-current fill-none stroke-2">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  ),
  webhook: (
    <svg viewBox="0 0 24 24" className="h-20 w-20 stroke-current fill-none stroke-2">
      <path d="M18 16.98h-5.99c-1.1 0-1.95.94-2.48 1.9A4 4 0 0 1 2 17c.01-.7.2-1.4.57-2" />
      <path d="m6 17 3.13-5.78c.53-.97.1-2.18-.5-3.1a4 4 0 1 1 6.89-4.06l3.19 5.74c.6 1.08 1.83 1.63 3.01 1.2A4 4 0 1 1 18 16.98Z" />
    </svg>
  ),
  globe: (
    <svg viewBox="0 0 24 24" className="h-20 w-20 stroke-current fill-none stroke-2">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  subworkflow: (
    <svg viewBox="0 0 24 24" className="h-20 w-20 stroke-current fill-none stroke-2">
      <circle cx="18" cy="18" r="3" />
      <circle cx="6" cy="6" r="3" />
      <path d="M6 9v12M15 15l-6-6" />
      <circle cx="18" cy="6" r="3" />
      <path d="M18 9v6" />
    </svg>
  ),
  sheets: (
    <svg viewBox="0 0 24 24" className="h-20 w-20 stroke-current fill-none stroke-2">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M3 15h18M9 3v18" />
    </svg>
  ),
  docs: (
    <svg viewBox="0 0 24 24" className="h-20 w-20 stroke-current fill-none stroke-2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  botchat: (
    <svg viewBox="0 0 24 24" className="h-20 w-20 stroke-current fill-none stroke-2">
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  ),
  mail: (
    <svg viewBox="0 0 24 24" className="h-20 w-20 stroke-current fill-none stroke-2">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-10 7L2 7" />
    </svg>
  ),
  cloud: (
    <svg viewBox="0 0 24 24" className="h-20 w-20 stroke-current fill-none stroke-2">
      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
    </svg>
  ),
  api: (
    <svg viewBox="0 0 24 24" className="h-20 w-20 stroke-current fill-none stroke-2">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  ),
};

/* 判斷是否為畫面上固定起頭之觸發節點 (只有此初始固定的節點不可刪除，其餘再次拖曳出來的觸發節點皆可刪除) */
export function isTriggerNode(node) {
  if (!node) return false;
  return Boolean(
    node.isFixed ||
    node.isRootTrigger ||
    node.id === "trigger-cron"
  );
}

/* 預設節點清單：每日設計文章爬蟲與 AI 摘要整理自動化流程 */
const INITIAL_NODES = [
  {
    id: "trigger-cron",
    isFixed: true,
    isRootTrigger: true,
    toolId: "tigger",
    itemTitle: "定時觸發",
    name: "每日上午 10:00 定時啟動",
    title: "每日上午 10:00 定時啟動",
    subtitle: "Cron: 0 10 * * * (每天 10:00 自動執行)",
    category: "trigger",
    iconKey: "trigger",
    status: "success",
    duration: "5ms",
    recordCount: "排程中",
    hasInput: false,
    outputCount: 1,
    x: 80,
    y: 240,
    params: {
      cron: "0 10 * * *",
      time: "10:00 AM",
      date: "Oct 18, 2026",
      timezone: "Asia/Taipei",
      triggerType: "schedule",
      active: true,
    },
  },
  {
    id: "crawler-http",
    toolId: "http-request",
    itemTitle: "網路爬蟲",
    name: "抓取最新設計文章",
    title: "抓取最新設計文章",
    subtitle: "爬取 Medium、Behance 與 Designer News 設計專題",
    category: "data",
    iconKey: "globe",
    status: "success",
    duration: "340ms",
    recordCount: "48 篇文章",
    hasInput: true,
    outputCount: 1,
    x: 440,
    y: 240,
    params: {
      url: "https://api.designernews.co/v2/stories?sort=recent",
      method: "GET",
      headers: "User-Agent: DesignCrawler/1.0\nAccept: application/json",
      timeout: 10000,
    },
  },
  {
    id: "dedup-articles",
    toolId: "deduplicate",
    itemTitle: "移除重複項目",
    name: "移除重複文章動作",
    title: "移除重複文章動作",
    subtitle: "以文章 URL 與標題比對，避免重複紀錄文章",
    category: "data",
    iconKey: "copy",
    status: "success",
    duration: "18ms",
    recordCount: "過濾 12 筆重複",
    hasInput: true,
    outputCount: 1,
    x: 800,
    y: 240,
    params: {
      uniqueKey: "article_url",
      keepPolicy: "first",
      strictCase: false,
    },
  },
  {
    id: "ai-analysis",
    toolId: "llm",
    itemTitle: "AI 語言模型",
    name: "AI 整理與分析重點內容",
    title: "AI 整理與分析重點內容",
    subtitle: "提煉設計趨勢、核心觀點與繁體中文重點摘要",
    category: "ai",
    iconKey: "sparkles",
    status: "success",
    duration: "620ms",
    recordCount: "摘要分析完成",
    hasInput: true,
    outputCount: 2,
    x: 1160,
    y: 240,
    params: {
      model: "gemini-1.5-pro",
      temperature: 0.3,
      maxTokens: 4096,
      streaming: true,
      systemPrompt: "你是一位資深 UI/UX 設計總監，請詳細閱讀上游抓取的設計文章清單，提煉每篇文章之核心亮點、設計趨勢與 3 點繁體中文精選重點。",
    },
  },
  {
    id: "email-send",
    toolId: "email-send",
    itemTitle: "電子郵件",
    name: "發送摘要至我的郵件",
    title: "發送摘要至我的郵件",
    subtitle: "發送今日精選設計重點摘要報告至個人信箱",
    category: "action",
    iconKey: "mail",
    status: "success",
    duration: "120ms",
    recordCount: "已寄送",
    hasInput: true,
    outputCount: 0,
    x: 1520,
    y: 130,
    params: {
      recipient: "my_email@design.io",
      subject: "",
      format: "html",
    },
  },
  {
    id: "excel-archive",
    toolId: "google-sheets",
    itemTitle: "Excel 試算表",
    name: "整理至 Excel 進行表格式紀錄",
    title: "整理至 Excel 進行表格式紀錄",
    subtitle: "追加日期、文章標題、來源、重點摘要與連結至表格",
    category: "action",
    iconKey: "sheets",
    status: "success",
    duration: "190ms",
    recordCount: "36 筆追加成功",
    hasInput: true,
    outputCount: 0,
    x: 1520,
    y: 350,
    params: {
      spreadsheetId: "daily_design_articles_2026.xlsx",
      sheetName: "設計文章歸檔紀錄",
      range: "A:F",
      operation: "append",
    },
  },
];

/* 節點連接定義（支援上下左右四個端點） */
const INITIAL_CONNECTIONS = [
  {
    id: "c1",
    from: "trigger-cron",
    fromPort: "right",
    to: "crawler-http",
    toPort: "left",
    label: "",
  },
  {
    id: "c2",
    from: "crawler-http",
    fromPort: "right",
    to: "dedup-articles",
    toPort: "left",
    label: "",
  },
  {
    id: "c3",
    from: "dedup-articles",
    fromPort: "right",
    to: "ai-analysis",
    toPort: "left",
    label: "已去重文章",
  },
  {
    id: "c4",
    from: "ai-analysis",
    fromPort: "right",
    to: "email-send",
    toPort: "left",
    label: "郵件摘要",
  },
  {
    id: "c5",
    from: "ai-analysis",
    fromPort: "right",
    to: "excel-archive",
    toPort: "left",
    label: "表格歸檔",
  },
];

/* 預設畫布留言 (Figma 風格留言氣泡) */
const INITIAL_COMMENTS = [
  {
    id: "comment-1",
    x: 1070,
    y: 230,
    attachedTo: {
      type: "node",
      nodeId: "dedup-articles",
      offsetX: 270,
      offsetY: -10,
    },
    author: "Alex (Data Lead)",
    avatar: "A",
    avatarBg: "bg-indigo-600",
    content: "已設定唯一識別鍵為 article_url，比對快取中近 30 天的文章，徹底避免重複爬取與發送。",
    createdAt: "10分鐘前",
    timestamp: Date.now() - 600000,
    resolved: false,
    replies: [
      {
        id: "rep-1",
        author: "Sarah (Designer)",
        avatar: "S",
        avatarBg: "bg-emerald-600",
        content: "這樣就不會每天收到相同的文章了，非常棒！",
        createdAt: "5分鐘前",
      },
    ],
  },
  {
    id: "comment-2",
    x: 1430,
    y: 230,
    attachedTo: {
      type: "node",
      nodeId: "ai-analysis",
      offsetX: 270,
      offsetY: -10,
    },
    author: "Sarah (Designer)",
    avatar: "S",
    avatarBg: "bg-emerald-600",
    content: "AI 摘要格式已統一為 3 點核心重點，同時產出 HTML 信件模板與 Excel 表格資料。",
    createdAt: "20分鐘前",
    timestamp: Date.now() - 1200000,
    resolved: false,
    replies: [],
  },
];

/* 禁止模式自訂游標 (紅色禁止符號) */
const BAN_CURSOR =
  'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23EF4444\' stroke-width=\'2.5\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Ccircle cx=\'12\' cy=\'12\' r=\'9\'/%3E%3Cline x1=\'5.5\' y1=\'5.5\' x2=\'18.5\' y2=\'18.5\'/%3E%3C/svg%3E") 12 12, not-allowed';

/* 留言模式自訂游標 (全圓角水滴對話泡泡，底色與外框均加上60%白色，箭頭熱點位於左下角尖端) */
const COMMENT_CURSOR =
  'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'28\' height=\'30\' viewBox=\'0 0 28 30\' fill=\'none\'%3E%3Cpath d=\'M14 1.5C7.1 1.5 1.5 7.1 1.5 14c0 2.85.95 5.48 2.55 7.59L1.7 28.9c-.27.6.33 1.2.92.93l6.53-2.9C10.68 27.6 12.31 28 14 28c6.9 0 12.5-5.6 12.5-12.5S20.9 1.5 14 1.5Z\' fill=\'%23BECEDA\' stroke=\'%23BECEDA\' stroke-width=\'1.5\' stroke-linejoin=\'round\'/%3E%3C/svg%3E") 2 29, crosshair';

const NODE_WIDTH = 280;
const NODE_HEIGHT = 140;

/* 右側工具對應之節點範本 */
const TOOL_NODE_MAP = {
  // Data: 流程控制與觸發
  tigger: {
    title: "Tigger 觸發節點",
    subtitle: "工作流程起始事件觸發器",
    category: "trigger",
    iconKey: "trigger",
  },
  branch: {
    title: "條件分支",
    subtitle: "多路徑規則分發與路由判斷",
    category: "branch",
    iconKey: "branch",
  },
  loop: {
    title: "迴圈迭代",
    subtitle: "批次逐筆重複執行流程",
    category: "action",
    iconKey: "loop",
  },
  delay: {
    title: "延遲等待",
    subtitle: "暫停指定秒數後繼續執行",
    category: "action",
    iconKey: "delay",
  },

  // Data: 資料轉換與處理
  code: {
    title: "程式碼",
    subtitle: "執行自訂 JavaScript 腳本邏輯",
    category: "data",
    iconKey: "code",
  },
  "edit-field": {
    title: "編輯欄位",
    subtitle: "動態修改或新增資料鍵值欄位",
    category: "data",
    iconKey: "pen",
  },
  datetime: {
    title: "日期與時間格式化",
    subtitle: "統一時區並轉換為 ISO 格式",
    category: "data",
    iconKey: "calendar",
  },
  "json-convert": {
    title: "JSON / 格式轉換",
    subtitle: "字串與 JSON 物件相互解析轉換",
    category: "data",
    iconKey: "json",
  },

  // Data: 篩選與彙整
  filter: {
    title: "資料篩選",
    subtitle: "依條件過濾符合之資料筆數",
    category: "branch",
    iconKey: "filter",
  },
  limit: {
    title: "限制筆數",
    subtitle: "截取前 N 筆或設定上限筆數",
    category: "branch",
    iconKey: "ban",
  },
  deduplicate: {
    title: "移除重複項目",
    subtitle: "以識別碼為準去除重複紀錄",
    category: "data",
    iconKey: "copy",
  },
  statistics: {
    title: "彙整與計算",
    subtitle: "即時計算平均分、總數與標準差",
    category: "action",
    iconKey: "statistics",
  },

  // AI: 語言模型與代理
  llm: {
    title: "語言模型",
    subtitle: "調用大型語言模型推論與生成",
    category: "ai",
    iconKey: "sparkles",
  },
  "ai-agent": {
    title: "AI 代理",
    subtitle: "具自主規劃與工具調用之智慧代理",
    category: "ai",
    iconKey: "robot",
  },
  "structured-extract": {
    title: "結構化資訊擷取",
    subtitle: "從非結構化文字中提取 Schema 欄位",
    category: "ai",
    iconKey: "structure",
  },

  // AI: 知識庫與檢索
  "kb-qa": {
    title: "知識庫問答",
    subtitle: "基於私有知識庫進行 RAG 問答",
    category: "ai",
    iconKey: "book",
  },
  "vector-search": {
    title: "向量檢索",
    subtitle: "在向量資料庫中搜尋語義最相近片段",
    category: "ai",
    iconKey: "search",
  },
  "text-embedding": {
    title: "文字向量化",
    subtitle: "將輸入文本轉換為高維特徵向量",
    category: "ai",
    iconKey: "embedding",
  },

  // AI: 多模態轉換
  "image-gen": {
    title: "圖像生成",
    subtitle: "依據 Prompt 生成高品質視覺圖像",
    category: "ai",
    iconKey: "image",
  },
  "speech-to-text": {
    title: "語音轉文字",
    subtitle: "音訊轉錄為文字稿 (STT / Whisper)",
    category: "ai",
    iconKey: "mic",
  },
  "text-to-speech": {
    title: "文字轉語音",
    subtitle: "將文本合成為自然語音 (TTS)",
    category: "ai",
    iconKey: "speaker",
  },

  // API: 觸發與通訊協定
  webhook: {
    title: "Webhook 接收端",
    subtitle: "接收外部系統 HTTP POST 事件推播",
    category: "trigger",
    iconKey: "webhook",
  },
  "http-request": {
    title: "HTTP 請求",
    subtitle: "發送 GET/POST/PUT/DELETE API 呼叫",
    category: "action",
    iconKey: "globe",
  },
  "sub-workflow": {
    title: "子工作流程",
    subtitle: "將資料傳遞至巢狀子流程並等待回傳",
    category: "action",
    iconKey: "subworkflow",
  },

  // API: 常用應用服務
  "google-sheets": {
    title: "Google Sheets",
    subtitle: "讀取、新增或更新試算表列資料",
    category: "action",
    iconKey: "sheets",
  },
  "google-docs": {
    title: "Google Docs",
    subtitle: "自動建立文件或將報告追加至文件",
    category: "action",
    iconKey: "docs",
  },
  "bot-integration": {
    title: "Telegram / Slack Bot",
    subtitle: "發送即時互動通知至即時通訊機器人",
    category: "action",
    iconKey: "botchat",
  },
  "email-send": {
    title: "郵件發送",
    subtitle: "透過 SMTP / Resend 發送通知信件",
    category: "action",
    iconKey: "mail",
  },

  // API: 資料庫與雲端
  "database-tool": {
    title: "資料庫",
    subtitle: "執行 SQL 查詢或更新關聯資料庫",
    category: "data",
    iconKey: "database",
  },
  "cloud-storage": {
    title: "雲端物件儲存",
    subtitle: "上傳或下載檔案至 S3 / GCS 儲存貯體",
    category: "action",
    iconKey: "cloud",
  },

  // 既有相容別名
  "edit-area": {
    title: "編輯欄位",
    subtitle: "動態修改或新增資料鍵值欄位",
    category: "data",
    iconKey: "pen",
  },
  database: {
    title: "資料庫",
    subtitle: "執行 SQL 查詢或更新關聯資料庫",
    category: "data",
    iconKey: "database",
  },
};

function createNodeFromTool(toolItem, x, y) {
  const template = TOOL_NODE_MAP[toolItem.id] || {
    title: toolItem.label || "新節點",
    subtitle: "自訂新增工作流程節點",
    category: "data",
    iconKey: "database",
  };

  const isTrigger = toolItem.id === "tigger" || template.category === "trigger";
  const newId = `node-${toolItem.id}-${Date.now().toString(36)}`;
  const itemTitle = TOOL_TITLES[toolItem.id] || template.title;
  return {
    id: newId,
    toolId: toolItem.id,
    itemTitle: itemTitle,
    isFixed: false,
    isRootTrigger: false,
    name: template.title,
    title: template.title,
    subtitle: template.subtitle,
    category: template.category,
    iconKey: template.iconKey,
    status: "idle",
    duration: "0ms",
    recordCount: "新建立",
    hasInput: !isTrigger,
    outputCount: 1,
    x: Math.round(x),
    y: Math.round(y),
    params: getDefaultParamsForTool(toolItem.id),
  };
}

/* 貝茲曲線產生器：支援上下左右任意端點自然過渡，並計算曲線中點 t = 0.5 及控制點 */
function getBezierData(start, end, fromPort = "right", toPort = "left") {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const curvature = Math.max(30, Math.min(140, dist * 0.45));

  const cp1 = { x: start.x, y: start.y };
  const cp2 = { x: end.x, y: end.y };

  if (fromPort === "right") cp1.x += curvature;
  else if (fromPort === "left") cp1.x -= curvature;
  else if (fromPort === "bottom") cp1.y += curvature;
  else if (fromPort === "top") cp1.y -= curvature;

  if (toPort === "left") cp2.x -= curvature;
  else if (toPort === "right") cp2.x += curvature;
  else if (toPort === "top") cp2.y -= curvature;
  else if (toPort === "bottom") cp2.y += curvature;

  const path = `M ${start.x} ${start.y} C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${end.x} ${end.y}`;

  // 曲線正中心點 (t = 0.5) 畫布座標
  const midX = 0.125 * start.x + 0.375 * cp1.x + 0.375 * cp2.x + 0.125 * end.x;
  const midY = 0.125 * start.y + 0.375 * cp1.y + 0.375 * cp2.y + 0.125 * end.y;

  return { path, midX, midY, cp1, cp2 };
}

function getBezierPath(start, end, fromPort = "right", toPort = "left") {
  return getBezierData(start, end, fromPort, toPort).path;
}

/* 計算三次貝茲曲線在比率 t (0 ~ 1) 處之精確座標 */
function evaluateCubicBezier(t, p0, p1, p2, p3) {
  const clampedT = Math.max(0, Math.min(1, t));
  const mt = 1 - clampedT;
  const mt2 = mt * mt;
  const t2 = clampedT * clampedT;
  const a = mt2 * mt;
  const b = 3 * mt2 * clampedT;
  const c = 3 * mt * t2;
  const d = t2 * clampedT;
  return {
    x: a * p0.x + b * p1.x + c * p2.x + d * p3.x,
    y: a * p0.y + b * p1.y + c * p2.y + d * p3.y,
  };
}

/* 計算節點端點座標 (上下左右) */
function getNodePortCoords(nodeId, portName = "right", nodesList = [], nodeSizesMap = {}) {
  const node = nodesList.find((n) => n.id === nodeId);
  if (!node) return { x: 0, y: 0 };

  const size = nodeSizesMap[nodeId];
  let width = size?.width;
  let height = size?.height;

  if ((!width || !height) && typeof document !== "undefined") {
    const el = document.getElementById(`node-${nodeId}`);
    if (el) {
      width = el.offsetWidth;
      height = el.offsetHeight;
    }
  }

  width = width || NODE_WIDTH;
  height = height || 118;

  switch (portName) {
    case "top":
      return { x: node.x + width / 2, y: node.y };
    case "bottom":
      return { x: node.x + width / 2, y: node.y + height };
    case "left":
      return { x: node.x, y: node.y + height / 2 };
    case "right":
    default:
      return { x: node.x + width, y: node.y + height / 2 };
  }
}

/* 偵測留言座標 (x, y) 是否附著在卡片 (node) 或線段 (connection) 上 */
function detectAttachment(x, y, nodesList = [], connectionsList = [], nodeSizesMap = {}) {
  // 1. 優先檢查是否在節點卡片範圍內 (含卡片周邊 16px 吸附緩衝區)
  for (const node of nodesList) {
    const size = nodeSizesMap[node.id];
    let width = size?.width;
    let height = size?.height;

    if ((!width || !height) && typeof document !== "undefined") {
      const el = document.getElementById(`node-${node.id}`);
      if (el) {
        width = el.offsetWidth;
        height = el.offsetHeight;
      }
    }

    width = width || NODE_WIDTH;
    height = height || 118;

    const pad = 16;
    if (
      x >= node.x - pad &&
      x <= node.x + width + pad &&
      y >= node.y - pad &&
      y <= node.y + height + pad
    ) {
      return {
        type: "node",
        nodeId: node.id,
        offsetX: Math.round(x - node.x),
        offsetY: Math.round(y - node.y),
      };
    }
  }

  // 2. 檢查是否附著在任何線段上 (採樣貝茲曲線 25 個點，判定半徑 36px)
  let bestConn = null;
  let minDistance = 36;
  let bestT = 0.5;
  let bestOffset = { x: 0, y: 0 };

  for (const conn of connectionsList) {
    const fromNode = nodesList.find((n) => n.id === conn.from);
    const toNode = nodesList.find((n) => n.id === conn.to);
    if (!fromNode || !toNode) continue;

    const start = getNodePortCoords(conn.from, conn.fromPort || "right", nodesList, nodeSizesMap);
    const end = getNodePortCoords(conn.to, conn.toPort || "left", nodesList, nodeSizesMap);
    const { cp1, cp2 } = getBezierData(start, end, conn.fromPort || "right", conn.toPort || "left");

    for (let step = 1; step <= 24; step++) {
      const t = step / 25;
      const pt = evaluateCubicBezier(t, start, cp1, cp2, end);
      const dist = Math.hypot(x - pt.x, y - pt.y);
      if (dist < minDistance) {
        minDistance = dist;
        bestConn = conn;
        bestT = t;
        bestOffset = { x: Math.round(x - pt.x), y: Math.round(y - pt.y) };
      }
    }
  }

  if (bestConn) {
    return {
      type: "connection",
      connectionId: bestConn.id,
      t: bestT,
      offsetDistanceX: bestOffset.x,
      offsetDistanceY: bestOffset.y,
    };
  }

  return null;
}

/* 當節點移動時，同步更新附著在該節點或相關線段上的所有留言座標 */
function syncAttachedComments(
  movedNodeId,
  currentNodes,
  currentComments,
  currentConnections,
  nodeSizesMap = {},
) {
  let hasChange = false;
  const nextComments = currentComments.map((c) => {
    // 條件 1: 留言直接掛在被移動的卡片上
    if (c.attachedTo?.type === "node" && c.attachedTo.nodeId === movedNodeId) {
      const targetNode = currentNodes.find((n) => n.id === movedNodeId);
      if (targetNode) {
        const nextX = Math.round(targetNode.x + c.attachedTo.offsetX);
        const nextY = Math.round(targetNode.y + c.attachedTo.offsetY);
        if (nextX !== c.x || nextY !== c.y) {
          hasChange = true;
          return { ...c, x: nextX, y: nextY };
        }
      }
    }

    // 條件 2: 留言掛在線段上，且該線段的起點或終點包含被移動的節點
    if (c.attachedTo?.type === "connection") {
      const conn = currentConnections.find((cn) => cn.id === c.attachedTo.connectionId);
      if (conn && (conn.from === movedNodeId || conn.to === movedNodeId)) {
        const fromNode = currentNodes.find((n) => n.id === conn.from);
        const toNode = currentNodes.find((n) => n.id === conn.to);
        if (fromNode && toNode) {
          const start = getNodePortCoords(conn.from, conn.fromPort || "right", currentNodes, nodeSizesMap);
          const end = getNodePortCoords(conn.to, conn.toPort || "left", currentNodes, nodeSizesMap);
          const { cp1, cp2 } = getBezierData(start, end, conn.fromPort || "right", conn.toPort || "left");
          const t = c.attachedTo.t ?? 0.5;
          const pt = evaluateCubicBezier(t, start, cp1, cp2, end);
          const nextX = Math.round(pt.x + (c.attachedTo.offsetDistanceX || 0));
          const nextY = Math.round(pt.y + (c.attachedTo.offsetDistanceY || 0));
          if (nextX !== c.x || nextY !== c.y) {
            hasChange = true;
            return { ...c, x: nextX, y: nextY };
          }
        }
      }
    }

    return c;
  });

  return hasChange ? nextComments : currentComments;
}

export default function App() {
  const [workflowTitle, setWorkflowTitle] = useState("每日最新設計文章爬蟲與 AI 摘要整理");
  const [mode, setMode] = useState("edit"); // "edit" | "history" (預設展示編輯畫布頁面)
  const [selectedRunId, setSelectedRunId] = useState("#1048"); // 預設選擇第 3 筆失敗紀錄 #1048 (對齊 Figma 附圖)
  const [isHistoryDetailOpen, setIsHistoryDetailOpen] = useState(true); // 預設開啟右側紀錄詳情面板

  const activeRun = useMemo(() => {
    return RUNS_DATA.find((r) => r.id === selectedRunId) || RUNS_DATA[0];
  }, [selectedRunId]);

  const [nodes, setNodes] = useState(INITIAL_NODES);
  const [connections, setConnections] = useState(INITIAL_CONNECTIONS);
  const [comments, setComments] = useState(INITIAL_COMMENTS);
  const [tool, setTool] = useState("pointer"); // "pointer" | "limit" | "comment"
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const selectedNodeIdRef = useRef(selectedNodeId);
  useEffect(() => {
    selectedNodeIdRef.current = selectedNodeId;
  }, [selectedNodeId]);

  const [selectedConnectionId, setSelectedConnectionId] = useState(null);
  const selectedConnectionIdRef = useRef(selectedConnectionId);
  useEffect(() => {
    selectedConnectionIdRef.current = selectedConnectionId;
  }, [selectedConnectionId]);

  const [selectedToolId, setSelectedToolId] = useState(null);
  const [previewToolNode, setPreviewToolNode] = useState(null);
  const [isDraggingTool, setIsDraggingTool] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  /* 全域監聽拖曳結束事件，確保任何情況下恢復拖曳狀態 */
  useEffect(() => {
    const handleDragEnd = () => {
      setIsDraggingTool(false);
    };
    window.addEventListener("dragend", handleDragEnd);
    return () => {
      window.removeEventListener("dragend", handleDragEnd);
    };
  }, []);

  /* 即時更新選取節點參數與屬性 (支援畫布節點與側邊欄預覽節點) */
  const handleUpdateNode = useCallback((nodeId, updatedFields) => {
    setPreviewToolNode((prev) =>
      prev && prev.id === nodeId ? { ...prev, ...updatedFields } : prev,
    );
    setNodes((prevNodes) => {
      const next = prevNodes.map((n) => (n.id === nodeId ? { ...n, ...updatedFields } : n));
      nodesRef.current = next;
      return next;
    });
  }, []);

  /* 刪除節點二次確認狀態 (包含後續流程影響評估) */
  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState(null);
  const deleteConfirmTargetRef = useRef(deleteConfirmTarget);
  useEffect(() => {
    deleteConfirmTargetRef.current = deleteConfirmTarget;
  }, [deleteConfirmTarget]);

  /* 留言與草稿狀態 (Figma 風格留言) */
  const [draftComment, setDraftComment] = useState(null); // { x, y, text }
  const [activeCommentId, setActiveCommentId] = useState(null);
  const [justSubmittedCommentId, setJustSubmittedCommentId] = useState(null);

  /* 縮放與平移狀態 */
  const [zoom, setZoom] = useState(60);
  const [pan, setPan] = useState({ x: -9, y: 154 });
  const [isCentered, setIsCentered] = useState(false);
  const [isPanning, setIsPanning] = useState(false);

  /* 保持 ref 同步以支援快速滾輪縮放無延遲計算 */
  const panRef = useRef(pan);
  const zoomRef = useRef(zoom);
  useEffect(() => {
    panRef.current = pan;
  }, [pan]);
  useEffect(() => {
    zoomRef.current = zoom;
  }, [zoom]);

  const canvasRef = useRef(null);
  const panStartRef = useRef({ mouseX: 0, mouseY: 0, panX: 0, panY: 0 });
  const hasMovedRef = useRef(false);

  /* 狀態持久 Ref (供非同步事件與歷史引擎即時讀取最新狀態) */
  const nodesRef = useRef(nodes);
  useEffect(() => {
    nodesRef.current = nodes;
  }, [nodes]);

  const connectionsRef = useRef(connections);
  useEffect(() => {
    connectionsRef.current = connections;
  }, [connections]);

  const commentsRef = useRef(comments);
  useEffect(() => {
    commentsRef.current = comments;
  }, [comments]);

  /* 追蹤所有節點卡片的實際量測尺寸 (寬度與高度)，確保連線絕對精確 */
  const [nodeSizes, setNodeSizes] = useState({});
  const nodeSizesRef = useRef({});
  useEffect(() => {
    nodeSizesRef.current = nodeSizes;
  }, [nodeSizes]);

  const handleNodeSizeChange = useCallback((nodeId, width, height) => {
    setNodeSizes((prev) => {
      const current = prev[nodeId];
      if (current && current.width === width && current.height === height) {
        return prev;
      }
      return {
        ...prev,
        [nodeId]: { width, height },
      };
    });
  }, []);

  const toolRef = useRef(tool);
  useEffect(() => {
    toolRef.current = tool;
  }, [tool]);

  /* 訊息 Toast 通知函式 */
  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 2800);
  }, []);

  /* 復原與重做歷史狀態引擎 (最多恢復 10 個步驟) */
  const historyRef = useRef([
    {
      nodes: INITIAL_NODES,
      connections: INITIAL_CONNECTIONS,
      comments: INITIAL_COMMENTS,
    },
  ]);
  const historyIndexRef = useRef(0);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const pushHistory = useCallback((nextNodes, nextConnections, nextComments) => {
    const nodesToSave = nextNodes !== undefined ? nextNodes : nodesRef.current;
    const connsToSave =
      nextConnections !== undefined ? nextConnections : connectionsRef.current;
    const commentsToSave =
      nextComments !== undefined ? nextComments : commentsRef.current;

    const cur = historyRef.current[historyIndexRef.current];
    if (
      cur &&
      cur.nodes === nodesToSave &&
      cur.connections === connsToSave &&
      cur.comments === commentsToSave
    ) {
      return;
    }

    const newHistory = historyRef.current.slice(0, historyIndexRef.current + 1);
    newHistory.push({
      nodes: nodesToSave,
      connections: connsToSave,
      comments: commentsToSave,
    });

    // 最多恢復 10 個步驟 (歷史緩衝區最多保留 11 個狀態)
    while (newHistory.length > 11) {
      newHistory.shift();
    }

    historyRef.current = newHistory;
    historyIndexRef.current = newHistory.length - 1;

    setCanUndo(historyIndexRef.current > 0);
    setCanRedo(false);
  }, []);

  const handleUndo = useCallback(() => {
    if (historyIndexRef.current <= 0) return;
    const nextIndex = historyIndexRef.current - 1;
    const snapshot = historyRef.current[nextIndex];
    if (!snapshot) return;

    historyIndexRef.current = nextIndex;
    setNodes(snapshot.nodes);
    setConnections(snapshot.connections);
    setComments(snapshot.comments);
    setSelectedNodeId(null);
    setSelectedConnectionId(null);
    setSelectedToolId(null);
    setPreviewToolNode(null);
    setDraftComment(null);
    setActiveCommentId(null);

    setCanUndo(nextIndex > 0);
    setCanRedo(true);
    showToast("↩️ 已復原上一步操作");
  }, [showToast]);

  const handleRedo = useCallback(() => {
    if (historyIndexRef.current >= historyRef.current.length - 1) return;
    const nextIndex = historyIndexRef.current + 1;
    const snapshot = historyRef.current[nextIndex];
    if (!snapshot) return;

    historyIndexRef.current = nextIndex;
    setNodes(snapshot.nodes);
    setConnections(snapshot.connections);
    setComments(snapshot.comments);
    setSelectedNodeId(null);
    setSelectedConnectionId(null);
    setSelectedToolId(null);
    setPreviewToolNode(null);
    setDraftComment(null);
    setActiveCommentId(null);

    setCanUndo(true);
    setCanRedo(nextIndex < historyRef.current.length - 1);
    showToast("↪️ 已重做操作");
  }, [showToast]);

  /* 留言操作功能 */
  const handleCreateComment = useCallback(() => {
    if (!draftComment || !draftComment.text.trim()) return;

    const attachment = detectAttachment(
      draftComment.x,
      draftComment.y,
      nodesRef.current,
      connectionsRef.current,
      nodeSizesRef.current,
    );

    const newComment = {
      id: `comment-${Date.now().toString(36)}`,
      x: draftComment.x,
      y: draftComment.y,
      attachedTo: attachment,
      author: "你 (You)",
      avatar: "Y",
      avatarBg: "bg-primary",
      content: draftComment.text.trim(),
      createdAt: "剛剛",
      timestamp: Date.now(),
      resolved: false,
      replies: [],
      justCreated: true,
    };

    const nextComments = [...commentsRef.current, newComment];
    setComments(nextComments);
    setDraftComment(null);
    setActiveCommentId(newComment.id);
    setJustSubmittedCommentId(newComment.id);
    pushHistory(undefined, undefined, nextComments);
  }, [draftComment, pushHistory]);

  const handleDeleteComment = useCallback(
    (commentId) => {
      const nextComments = commentsRef.current.filter((c) => c.id !== commentId);
      setComments(nextComments);
      setActiveCommentId((prev) => (prev === commentId ? null : prev));
      pushHistory(undefined, undefined, nextComments);
      showToast("🗑️ 已刪除留言");
    },
    [pushHistory, showToast],
  );

  const handleMoveComment = useCallback(
    (commentId, newX, newY) => {
      const attachment = detectAttachment(
        newX,
        newY,
        nodesRef.current,
        connectionsRef.current,
        nodeSizesRef.current,
      );
      const nextComments = commentsRef.current.map((c) =>
        c.id === commentId ? { ...c, x: newX, y: newY, attachedTo: attachment } : c,
      );
      setComments(nextComments);
      pushHistory(undefined, undefined, nextComments);
    },
    [pushHistory],
  );

  const handleToggleResolveComment = useCallback(
    (commentId) => {
      const nextComments = commentsRef.current.map((c) => {
        if (c.id === commentId) {
          return { ...c, resolved: !c.resolved };
        }
        return c;
      });
      setComments(nextComments);
      pushHistory(undefined, undefined, nextComments);
    },
    [pushHistory],
  );

  const handleAddReply = useCallback(
    (commentId, text, customReplyId) => {
      if (!text || !text.trim()) return;
      const newReplyId = customReplyId || `reply-${Date.now().toString(36)}`;
      const nextComments = commentsRef.current.map((c) => {
        if (c.id === commentId) {
          return {
            ...c,
            replies: [
              ...(c.replies || []),
              {
                id: newReplyId,
                author: "你 (You)",
                avatar: "Y",
                avatarBg: "bg-primary",
                content: text.trim(),
                createdAt: "剛剛",
              },
            ],
          };
        }
        return c;
      });
      setComments(nextComments);
      pushHistory(undefined, undefined, nextComments);
    },
    [pushHistory],
  );

  /* 動畫平移與鏡頭聚焦 Ref */
  const animFrameRef = useRef(null);
  useEffect(() => {
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  /* 節點位置拖曳狀態 */
  const [draggingNodeId, setDraggingNodeId] = useState(null);
  const nodeDragStartRef = useRef({ mouseX: 0, mouseY: 0, nodeX: 0, nodeY: 0 });
  const nodeHasMovedRef = useRef(false);
  const draggingNodeIdRef = useRef(draggingNodeId);
  useEffect(() => {
    draggingNodeIdRef.current = draggingNodeId;
  }, [draggingNodeId]);

  const isPanningRef = useRef(isPanning);
  useEffect(() => {
    isPanningRef.current = isPanning;
  }, [isPanning]);

  /* 拉線連接狀態 */
  const [connectingLine, setConnectingLine] = useState(null);
  const connectingRef = useRef(null);
  const [hoveredPort, setHoveredPort] = useState(null);

  /* 刪除與切換禁用連線 */
  const deleteConnection = useCallback(
    (connId) => {
      const nextConns = connectionsRef.current.filter((c) => c.id !== connId);
      // 當留言被鎖定在此線段時，隨線段刪除而消失
      const nextComments = commentsRef.current.filter((c) => {
        if (c.attachedTo?.type === "connection" && c.attachedTo.connectionId === connId) {
          return false;
        }
        return true;
      });
      setConnections(nextConns);
      setComments(nextComments);
      setSelectedConnectionId(null);
      setActiveCommentId((prevId) => {
        const wasDeleted = commentsRef.current.some(
          (c) => c.id === prevId && c.attachedTo?.type === "connection" && c.attachedTo.connectionId === connId,
        );
        return wasDeleted ? null : prevId;
      });
      pushHistory(undefined, nextConns, nextComments);
      showToast("🗑️ 已刪除連接線");
    },
    [pushHistory, showToast, setSelectedConnectionId],
  );

  const toggleConnectionDisabled = useCallback(
    (connId) => {
      let toggledState = false;
      const nextConns = connectionsRef.current.map((c) => {
        if (c.id === connId) {
          const nextDisabled = !c.disabled;
          toggledState = nextDisabled;
          return { ...c, disabled: nextDisabled };
        }
        return c;
      });
      setConnections(nextConns);
      pushHistory(undefined, nextConns, undefined);
      showToast(
        toggledState
          ? "🚫 已禁用此連接線（後續流程已中斷停用）"
          : "✅ 已啟用此連接線（後續流程已恢復導通）",
      );
    },
    [pushHistory, showToast],
  );

  /* 刪除節點（同時清除所有關聯連線與鎖定附著之留言；固定起頭之觸發節點不可刪除） */
  const deleteNode = useCallback(
    (nodeId) => {
      const nodeToDelete = nodesRef.current.find((n) => n.id === nodeId);
      if (!nodeToDelete) return;

      // 只有畫面上固定的起始觸發節點不可刪除
      if (isTriggerNode(nodeToDelete)) {
        showToast("⚠️ 畫面上固定的起始觸發節點不可刪除");
        return;
      }

      const nextNodes = nodesRef.current.filter((n) => n.id !== nodeId);
      const deletedConnIds = new Set(
        connectionsRef.current
          .filter((c) => c.from === nodeId || c.to === nodeId)
          .map((c) => c.id),
      );
      const nextConns = connectionsRef.current.filter(
        (c) => c.from !== nodeId && c.to !== nodeId,
      );

      // 當留言被鎖定在卡片或其相連線段時，隨卡片刪除而消失
      const nextComments = commentsRef.current.filter((c) => {
        if (c.attachedTo?.type === "node" && c.attachedTo.nodeId === nodeId) {
          return false;
        }
        if (c.attachedTo?.type === "connection" && deletedConnIds.has(c.attachedTo.connectionId)) {
          return false;
        }
        return true;
      });

      setNodes(nextNodes);
      setConnections(nextConns);
      setComments(nextComments);
      setSelectedNodeId(null);
      setActiveCommentId((prevId) => {
        const wasDeleted = commentsRef.current.some(
          (c) =>
            c.id === prevId &&
            ((c.attachedTo?.type === "node" && c.attachedTo.nodeId === nodeId) ||
              (c.attachedTo?.type === "connection" && deletedConnIds.has(c.attachedTo.connectionId))),
        );
        return wasDeleted ? null : prevId;
      });
      pushHistory(nextNodes, nextConns, nextComments);
      showToast(`🗑️ 已刪除節點「${nodeToDelete.title}」`);
    },
    [pushHistory, showToast],
  );

  /* 請求刪除節點（僅在會影響後續流程時才彈出提示；不影響流程則直接刪除；觸發節點不可刪除） */
  const requestDeleteNode = useCallback((nodeId) => {
    if (!nodeId) return;
    const node = nodesRef.current.find((n) => n.id === nodeId);
    if (!node) return;

    // 只有畫面上固定的起始觸發節點不可刪除
    if (isTriggerNode(node)) {
      showToast("⚠️ 畫面上固定的起始觸發節點不可刪除");
      return;
    }

    // 檢查是否有從此節點出發的下游連線 (c.from === nodeId)，判斷是否會影響後續流程
    const hasDownstream = connectionsRef.current.some((c) => c.from === nodeId);

    // 僅需要會影響流程的卡片刪除才出現提示；不影響流程則直接刪除
    if (!hasDownstream) {
      deleteNode(nodeId);
      return;
    }

    setDeleteConfirmTarget({
      node,
    });
  }, [deleteNode, showToast]);

  const handleConfirmDelete = useCallback(() => {
    if (!deleteConfirmTargetRef.current) return;
    const targetId = deleteConfirmTargetRef.current.node.id;
    if (isTriggerNode(deleteConfirmTargetRef.current.node)) {
      setDeleteConfirmTarget(null);
      showToast("⚠️ 畫面上固定的起始觸發節點不可刪除");
      return;
    }
    setDeleteConfirmTarget(null);
    deleteNode(targetId);
  }, [deleteNode, showToast]);

  const handleCancelDelete = useCallback(() => {
    setDeleteConfirmTarget(null);
  }, []);

  /* 複製節點副本 */
  const duplicateNode = useCallback(
    (nodeId) => {
      const sourceNode = nodesRef.current.find((n) => n.id === nodeId);
      if (!sourceNode) return;

      const newNodeId = `${sourceNode.id}-copy-${Date.now().toString(36).slice(-4)}`;
      const newNode = {
        ...sourceNode,
        id: newNodeId,
        isFixed: false,
        isRootTrigger: false,
        title: `${sourceNode.title} (副本)`,
        x: sourceNode.x + 36,
        y: sourceNode.y + 36,
      };

      const nextNodes = [...nodesRef.current, newNode];
      setNodes(nextNodes);
      setSelectedNodeId(newNodeId);
      pushHistory(nextNodes, undefined, undefined);
      showToast(`📋 已複製節點「${newNode.title}」`);
    },
    [pushHistory, showToast],
  );

  /* 停用 / 啟用節點（切換狀態並影響下游 DAG 流程） */
  const toggleNodeDisabled = useCallback(
    (nodeId) => {
      let targetTitle = "";
      let toggledState = false;
      const nextNodes = nodesRef.current.map((n) => {
        if (n.id === nodeId) {
          const nextDisabled = !n.disabled;
          targetTitle = n.title;
          toggledState = nextDisabled;
          return { ...n, disabled: nextDisabled };
        }
        return n;
      });
      setNodes(nextNodes);
      pushHistory(nextNodes, undefined, undefined);
      showToast(
        toggledState
          ? `🚫 已停用節點「${targetTitle}」（後續流程已中斷）`
          : `✅ 已啟用節點「${targetTitle}」（後續流程已恢復）`,
      );
    },
    [pushHistory, showToast],
  );


  /* 計算每個節點當前已有連線的端點清單 (條件 1: 有被連線至該節點) */
  const nodeConnectedPorts = useMemo(() => {
    const map = {};
    for (const c of connections) {
      const fromPort = c.fromPort || "right";
      const toPort = c.toPort || "left";
      if (!map[c.from]) map[c.from] = new Set();
      if (!map[c.to]) map[c.to] = new Set();
      map[c.from].add(fromPort);
      map[c.to].add(toPort);
    }
    const result = {};
    for (const [id, set] of Object.entries(map)) {
      result[id] = Array.from(set);
    }
    return result;
  }, [connections]);

  /* 計算因線段禁止而受影響之停用節點與連線 (DAG 拓撲分析：線段禁止後，後續流程無法導通皆為 disable) */
  const { disabledNodeIds, disabledConnectionIds } = useMemo(() => {
    const incomingMap = new Map();
    const outgoingMap = new Map();

    for (const node of nodes) {
      incomingMap.set(node.id, []);
      outgoingMap.set(node.id, []);
    }

    for (const conn of connections) {
      if (incomingMap.has(conn.to)) {
        incomingMap.get(conn.to).push(conn);
      }
      if (outgoingMap.has(conn.from)) {
        outgoingMap.get(conn.from).push(conn);
      }
    }

    // 尋找根節點 (觸發器類別、無輸入屬性、或畫布上無任何入度的獨立起始節點)
    const rootNodes = nodes.filter(
      (n) =>
        (n.category === "trigger" ||
          n.hasInput === false ||
          (incomingMap.get(n.id) || []).length === 0) &&
        !n.disabled,
    );

    // BFS 尋找透過有效(未禁用)連線可到達的所有節點
    const enabledNodeIds = new Set();
    const queue = [];

    for (const root of rootNodes) {
      enabledNodeIds.add(root.id);
      queue.push(root.id);
    }

    while (queue.length > 0) {
      const currentId = queue.shift();
      const outConns = outgoingMap.get(currentId) || [];

      for (const conn of outConns) {
        // 若該連線本身被手動禁用，則中斷導通
        if (conn.disabled) continue;

        const targetNodeId = conn.to;
        const targetNode = nodes.find((n) => n.id === targetNodeId);
        // 若目標節點本身被手動停用，亦中斷向下導通
        if (targetNode?.disabled) continue;

        if (!enabledNodeIds.has(targetNodeId)) {
          enabledNodeIds.add(targetNodeId);
          queue.push(targetNodeId);
        }
      }
    }

    // 未能自根節點導通到達之節點或手動停用之節點皆為已停用 (disabled)
    const disabledNodes = new Set();
    for (const node of nodes) {
      if (node.disabled || !enabledNodeIds.has(node.id)) {
        disabledNodes.add(node.id);
      }
    }

    // 連線是否有效停用：手動禁用 OR 來源節點已被停用
    const disabledConns = new Set();
    for (const conn of connections) {
      if (conn.disabled || disabledNodes.has(conn.from)) {
        disabledConns.add(conn.id);
      }
    }

    return {
      disabledNodeIds: disabledNodes,
      disabledConnectionIds: disabledConns,
    };
  }, [nodes, connections]);

  /* 節點內容與相依性驗證：評估內容錯誤、尚未填寫完整或無法進行流程 */
  const nodeValidations = useMemo(() => {
    const map = {};
    for (const node of nodes) {
      if (disabledNodeIds.has(node.id)) {
        map[node.id] = { status: "valid" };
      } else {
        map[node.id] = validateNode(node, connections, nodes);
      }
    }
    return map;
  }, [nodes, connections, disabledNodeIds]);

  /* 是否正在拖曳任何連線段 (條件 2: 正在拖曳任何線段) */
  const isConnecting = connectingLine !== null;

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);
  const activeDetailNode = selectedNode || previewToolNode;

  /* 預設使資料置中出現在正中間 (Requirement 3) */
  useEffect(() => {
    if (!canvasRef.current || isCentered) return;
    const { clientWidth, clientHeight } = canvasRef.current;
    if (clientWidth > 0 && clientHeight > 0) {
      const scale = zoom / 100;
      const initialPanX = Math.round(clientWidth / 2 - 940 * scale);
      const initialPanY = Math.round(clientHeight / 2 - 280 * scale);
      panRef.current = { x: initialPanX, y: initialPanY };
      setPan({ x: initialPanX, y: initialPanY });
      setIsCentered(true);
    }
  }, [isCentered, zoom]);

  /* 左鍵拖動畫布或新增留言 */
  const handleCanvasMouseDown = (e) => {
    if (e.button !== 0) return;

    // 留言模式下：在畫布任何空白或物件區域（非既有留言視窗/Pin/詳細配置面板）皆可新增留言
    if (toolRef.current === "comment") {
      if (
        e.target.closest("[data-comment-pin]") ||
        e.target.closest("[data-comment-popover]") ||
        e.target.closest("[data-comment-composer]") ||
        e.target.closest("[data-detail-panel]")
      ) {
        return;
      }
      e.stopPropagation();
      e.preventDefault();
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const scale = zoomRef.current / 100;
      const clickX = Math.round((e.clientX - rect.left - panRef.current.x) / scale);
      const clickY = Math.round((e.clientY - rect.top - panRef.current.y) / scale);

      setDraftComment({
        x: clickX,
        y: clickY,
        text: "",
      });
      setActiveCommentId(null);
      return;
    }

    if (draggingNodeIdRef.current || connectingRef.current || isConnecting) return;
    if (
      e.target.closest("[data-node]") ||
      e.target.closest("[data-port]") ||
      e.target.closest("[data-connection]") ||
      e.target.closest("[data-connection-toolbar]") ||
      e.target.closest("[data-node-toolbar]") ||
      e.target.closest("[data-comment-pin]") ||
      e.target.closest("[data-comment-popover]") ||
      e.target.closest("[data-comment-composer]") ||
      e.target.closest("[data-detail-panel]")
    ) {
      return;
    }

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }

    setIsPanning(true);
    hasMovedRef.current = false;
    panStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      panX: panRef.current.x,
      panY: panRef.current.y,
    };
  };

  useEffect(() => {
    if (!isPanning) return;

    const handleMouseMove = (e) => {
      if (e.buttons === 0) {
        setIsPanning(false);
        return;
      }
      const dx = e.clientX - panStartRef.current.mouseX;
      const dy = e.clientY - panStartRef.current.mouseY;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        hasMovedRef.current = true;
      }
      const nextPan = {
        x: Math.round(panStartRef.current.panX + dx),
        y: Math.round(panStartRef.current.panY + dy),
      };
      panRef.current = nextPan;
      setPan(nextPan);
    };

    const handleMouseUp = () => {
      setIsPanning(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp, { capture: true });
    window.addEventListener("mouseleave", handleMouseUp);
    window.addEventListener("blur", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp, { capture: true });
      window.removeEventListener("mouseleave", handleMouseUp);
      window.removeEventListener("blur", handleMouseUp);
    };
  }, [isPanning]);

  /* 點擊畫布空白位置：取消選取或新增留言 */
  const handleCanvasClick = (e) => {
    if (hasMovedRef.current || nodeHasMovedRef.current) return;
    if (
      e.target.closest("[data-node]") ||
      e.target.closest("[data-port]") ||
      e.target.closest("[data-connection]") ||
      e.target.closest("[data-connection-toolbar]") ||
      e.target.closest("[data-node-toolbar]") ||
      e.target.closest("[data-comment-pin]") ||
      e.target.closest("[data-comment-popover]") ||
      e.target.closest("[data-comment-composer]") ||
      e.target.closest("[data-detail-panel]")
    ) {
      return;
    }

    // 留言模式：點擊畫布空白處新增留言氣泡
    if (toolRef.current === "comment") {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const scale = zoomRef.current / 100;
      const clickX = Math.round((e.clientX - rect.left - panRef.current.x) / scale);
      const clickY = Math.round((e.clientY - rect.top - panRef.current.y) / scale);

      setDraftComment({
        x: clickX,
        y: clickY,
        text: "",
      });
      setActiveCommentId(null);
      return;
    }

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }

    setSelectedToolId(null);
    setPreviewToolNode(null);
    setSelectedNodeId(null);
    setSelectedConnectionId(null);
    setActiveCommentId(null);
  };

  /* 全域按鍵監聽：Undo / Redo (最多恢復10步驟)、Escape 取消、Delete / Backspace 刪除 */
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isInputActive =
        document.activeElement &&
        (document.activeElement.tagName === "INPUT" ||
          document.activeElement.tagName === "TEXTAREA" ||
          document.activeElement.isContentEditable);

      // 若當前正開啟刪除卡片確認彈窗，優先響應彈窗快捷鍵 (Escape 取消、Enter 確認)
      if (deleteConfirmTargetRef.current) {
        if (e.key === "Escape") {
          e.preventDefault();
          setDeleteConfirmTarget(null);
          return;
        }
        if (e.key === "Enter") {
          e.preventDefault();
          handleConfirmDelete();
          return;
        }
        return;
      }

      if (e.key === "Escape") {
        if (draftComment) {
          setDraftComment(null);
          return;
        }
        if (activeCommentId) {
          setActiveCommentId(null);
          return;
        }
        if (animFrameRef.current) {
          cancelAnimationFrame(animFrameRef.current);
          animFrameRef.current = null;
        }
        setDraggingNodeId(null);
        draggingNodeIdRef.current = null;
        connectingRef.current = null;
        setConnectingLine(null);
        setHoveredPort(null);
        setIsPanning(false);
        setSelectedConnectionId(null);
        setSelectedNodeId(null);
        setSelectedToolId(null);
        setPreviewToolNode(null);
        return;
      }

      // 若目前焦點在輸入框內，保留預設輸入行為
      if (isInputActive) {
        return;
      }

      // Cmd+Z or Ctrl+Z (上一步 / 復原)
      if ((e.metaKey || e.ctrlKey) && !e.shiftKey && e.key.toLowerCase() === "z") {
        e.preventDefault();
        handleUndo();
      }
      // Cmd+Shift+Z or Ctrl+Shift+Z or Ctrl+Y (下一步 / 重做)
      else if (
        (e.metaKey || e.ctrlKey) &&
        ((e.shiftKey && e.key.toLowerCase() === "z") || e.key.toLowerCase() === "y")
      ) {
        e.preventDefault();
        handleRedo();
      }
      // Delete or Backspace (刪除選取之節點或連線)
      else if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedConnectionIdRef.current) {
          e.preventDefault();
          deleteConnection(selectedConnectionIdRef.current);
        } else if (selectedNodeIdRef.current) {
          e.preventDefault();
          requestDeleteNode(selectedNodeIdRef.current);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    deleteConnection,
    deleteNode,
    requestDeleteNode,
    handleConfirmDelete,
    handleUndo,
    handleRedo,
    draftComment,
    activeCommentId,
  ]);

  /* 根據滑鼠游標位置進行縮放 (Requirement 1) */
  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;

    const handleWheel = (e) => {
      // 若滾動發生在留言彈窗或卡片內部滾動容器內，允許原生滾動，不攔截為畫布縮放/平移
      if (
        e.target.closest("[data-comment-popover]") ||
        e.target.closest("[data-comment-composer]") ||
        e.target.closest(".custom-scrollbar") ||
        e.target.closest("[data-detail-panel]")
      ) {
        return;
      }

      e.preventDefault();

      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }

      const rect = canvasEl.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const isPinchOrCtrl = e.ctrlKey || e.metaKey;
      const isMouseWheel = e.deltaX === 0 && Math.abs(e.deltaY) > 0;

      // 當使用者按住 Ctrl/Cmd 滾輪，或是滑鼠單純滾動滾輪時，皆以游標位置為縮放中心
      if (isPinchOrCtrl || isMouseWheel) {
        const currentPan = panRef.current;
        const currentZoom = zoomRef.current;

        // 計算平滑縮放倍率
        const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
        const targetZoom = Math.min(200, Math.max(20, Math.round(currentZoom * zoomFactor)));

        if (targetZoom === currentZoom) return;

        const oldScale = currentZoom / 100;
        const newScale = targetZoom / 100;

        // 轉換游標當前在畫布內部的絕對座標
        const canvasX = (mouseX - currentPan.x) / oldScale;
        const canvasY = (mouseY - currentPan.y) / oldScale;

        // 計算縮放後，維持該畫布座標剛好落在 (mouseX, mouseY) 所需的新 pan 位移
        const nextPanX = mouseX - canvasX * newScale;
        const nextPanY = mouseY - canvasY * newScale;

        // 同步更新 Ref 避免多次滾輪連發事件產生競態位移
        panRef.current = { x: nextPanX, y: nextPanY };
        zoomRef.current = targetZoom;

        setPan({ x: Math.round(nextPanX), y: Math.round(nextPanY) });
        setZoom(targetZoom);
      } else {
        // 雙指觸控板平移
        const nextPanX = panRef.current.x - e.deltaX;
        const nextPanY = panRef.current.y - e.deltaY;
        panRef.current = { x: nextPanX, y: nextPanY };
        setPan({ x: Math.round(nextPanX), y: Math.round(nextPanY) });
      }
    };

    canvasEl.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      canvasEl.removeEventListener("wheel", handleWheel);
    };
  }, []);

  /* 右下角縮放控制器變更（以視窗正中間為錨點縮放） */
  const handleZoomChange = useCallback(
    (newZoom) => {
      if (!canvasRef.current) {
        setZoom(newZoom);
        return;
      }
      const rect = canvasRef.current.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const oldScale = zoomRef.current / 100;
      const newScale = newZoom / 100;

      const canvasX = (centerX - panRef.current.x) / oldScale;
      const canvasY = (centerY - panRef.current.y) / oldScale;

      const nextPanX = centerX - canvasX * newScale;
      const nextPanY = centerY - canvasY * newScale;

      panRef.current = { x: nextPanX, y: nextPanY };
      zoomRef.current = newZoom;

      setPan({ x: Math.round(nextPanX), y: Math.round(nextPanY) });
      setZoom(newZoom);
    },
    [],
  );

  /* 點擊或新增節點平滑聚焦 (卡片置於詳細視窗左側約 32px 處，自動鎖定視野且完全不被遮蔽) */
  const focusNode = useCallback((nodeId, customNodes = null, force = false, centerVertical = false) => {
    if (!canvasRef.current || !nodeId) return;

    const currentNodes = customNodes || nodesRef.current;
    const node = currentNodes.find((n) => n.id === nodeId);
    if (!node) return;

    // 若正在畫布拖動中且未強制聚焦，不進行額外聚焦動畫
    if (nodeHasMovedRef.current && !force) return;

    const { clientWidth, clientHeight } = canvasRef.current;
    if (clientWidth <= 0 || clientHeight <= 0) return;

    const scale = zoomRef.current / 100;
    const size = nodeSizesRef.current[nodeId];
    const nodeW = size?.width || NODE_WIDTH;
    const nodeH = size?.height || (node.comment ? 154 : 118);

    const cardScaledWidth = nodeW * scale;
    const cardScaledHeight = nodeH * scale;

    // 詳細視窗位於右上角：right: 16px, width: 280px => 左邊界為 clientWidth - 296px
    // 聚焦目標：卡片右側距離詳細視窗左側約 32px，視覺緊湊舒適且完全不被遮蔽
    const detailPanelLeft = clientWidth - 296;
    const gapFromDetail = 32;

    // 若視窗較窄 (< 700px)，退回無遮蔽區域居中，否則緊貼詳細視窗左側安全區
    const targetScreenX =
      clientWidth > 700
        ? Math.round(detailPanelLeft - gapFromDetail - cardScaledWidth / 2)
        : Math.round((clientWidth - 296) / 2);

    const nodeCenterX = node.x + nodeW / 2;
    const targetPanX = Math.round(targetScreenX - nodeCenterX * scale);

    // 垂直方向：支援強制置中或微調保持
    let targetPanY;
    if (centerVertical) {
      targetPanY = Math.round(clientHeight / 2 - (node.y + nodeH / 2) * scale);
    } else {
      const currentPanY = panRef.current.y;
      const currentCardScreenTop = currentPanY + node.y * scale;
      const currentCardScreenBottom = currentCardScreenTop + cardScaledHeight;

      targetPanY = currentPanY;
      const minVisibleTop = 60;
      const maxVisibleBottom = clientHeight - 60;

      if (currentCardScreenTop < minVisibleTop) {
        // 若卡片偏上超出邊界，平緩向下微調至 70px
        targetPanY = Math.round(70 - node.y * scale);
      } else if (currentCardScreenBottom > maxVisibleBottom) {
        // 若卡片偏下超出邊界，平緩向上微調
        targetPanY = Math.round(maxVisibleBottom - 10 - (node.y + nodeH) * scale);
      }
    }

    const startPanX = panRef.current.x;
    const startPanY = panRef.current.y;
    const dist = Math.hypot(targetPanX - startPanX, targetPanY - startPanY);
    if (dist < 4) return;

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }

    const duration = 260; // 260ms 舒適平滑微過渡
    const startTime = performance.now();

    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // easeOutCubic 曲線，滑順聚焦
      const ease = 1 - Math.pow(1 - progress, 3);

      const currentX = Math.round(startPanX + (targetPanX - startPanX) * ease);
      const currentY = Math.round(startPanY + (targetPanY - startPanY) * ease);

      panRef.current = { x: currentX, y: currentY };
      setPan({ x: currentX, y: currentY });

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(step);
      } else {
        animFrameRef.current = null;
      }
    };

    animFrameRef.current = requestAnimationFrame(step);
  }, []);

  /* 當點擊設定視窗或空白區域時，若底層有畫布卡片重疊，立即選取並聚焦該卡片 */
  const handleSelectUnderlyingNode = useCallback(
    (clientX, clientY) => {
      if (!canvasRef.current) return false;
      const rect = canvasRef.current.getBoundingClientRect();
      const scale = zoomRef.current / 100;
      const canvasX = (clientX - rect.left - panRef.current.x) / scale;
      const canvasY = (clientY - rect.top - panRef.current.y) / scale;

      const hitNode = [...nodesRef.current].reverse().find((n) => {
        const size = nodeSizesRef.current[n.id];
        const w = size?.width || NODE_WIDTH;
        const h = size?.height || 118;
        return (
          canvasX >= n.x &&
          canvasX <= n.x + w &&
          canvasY >= n.y &&
          canvasY <= n.y + h
        );
      });

      if (hitNode) {
        setSelectedToolId(null);
        setPreviewToolNode(null);
        setSelectedNodeId(hitNode.id);
        setSelectedConnectionId(null);
        focusNode(hitNode.id, null, true);
        return true;
      }
      return false;
    },
    [focusNode],
  );

  /* 節點滑鼠按下與拖動位置 */
  const handleNodeMouseDown = (e, nodeId) => {
    // 嚴格限制僅滑鼠左鍵可拖動卡片
    if (e.button !== 0) return;

    // 禁止模式：快速切換卡片停用狀態
    if (toolRef.current === "limit") {
      e.stopPropagation();
      e.preventDefault();
      toggleNodeDisabled(nodeId);
      return;
    }

    // 留言模式：直接在卡片上新增留言 Pin
    if (toolRef.current === "comment") {
      e.stopPropagation();
      e.preventDefault();
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const scale = zoomRef.current / 100;
      const clickX = Math.round((e.clientX - rect.left - panRef.current.x) / scale);
      const clickY = Math.round((e.clientY - rect.top - panRef.current.y) / scale);

      setDraftComment({
        x: clickX,
        y: clickY,
        text: "",
      });
      setActiveCommentId(null);
      return;
    }

    // 互斥防護：若正在拉線或畫布正在平移，絕對不觸發卡片拖曳
    if (connectingRef.current || isConnecting || isPanningRef.current) return;

    // 若點擊目標為端點或其內部元素，由端點事件處理，卡片絕不進入拖曳
    if (e.target.closest("[data-port]")) return;

    // 防止瀏覽器原生選取反白與原生 HTML5 拖拽虛影（防止 mouseup 事件遺失）
    e.stopPropagation();
    e.preventDefault();

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }

    // 清除任何殘留的拉線狀態
    connectingRef.current = null;
    setConnectingLine(null);
    setHoveredPort(null);

    setSelectedToolId(null);
    setPreviewToolNode(null);
    // 不在 mousedown 立即開啟視窗，確保拖動時不出現視窗，僅在 mouseup 確認純點擊時才開啟
    setSelectedConnectionId(null);

    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return;

    nodeHasMovedRef.current = false;
    setDraggingNodeId(nodeId);
    draggingNodeIdRef.current = nodeId;
    nodeDragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      nodeX: node.x,
      nodeY: node.y,
    };

    // 建立即時原生監聽器，確保點擊立即觸發定位，避免受 React 重繪時差或微小位移影響
    let hasMoved = false;
    const startX = e.clientX;
    const startY = e.clientY;
    const onMove = (me) => {
      if (Math.hypot(me.clientX - startX, me.clientY - startY) > 5) {
        hasMoved = true;
      }
    };
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp, { capture: true });
      if (!hasMoved) {
        setSelectedNodeId(nodeId);
        selectedNodeIdRef.current = nodeId;
        focusNode(nodeId, null, true);
      }
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp, { capture: true });
  };

  useEffect(() => {
    if (!draggingNodeId) return;

    const handleNodeMouseMove = (e) => {
      // 若滑鼠按鍵已放開（例如在視窗外釋放後游標移回），立即終止拖拽
      if (e.buttons === 0) {
        setDraggingNodeId(null);
        draggingNodeIdRef.current = null;
        return;
      }

      const scale = zoomRef.current / 100;
      const dx = (e.clientX - nodeDragStartRef.current.mouseX) / scale;
      const dy = (e.clientY - nodeDragStartRef.current.mouseY) / scale;

      if (Math.hypot(dx, dy) > 3) {
        nodeHasMovedRef.current = true;
        // 移動卡片時若設定視窗處於開啟狀態，立即關閉視窗，確保移動中不出現視窗且不被視窗遮擋
        if (selectedNodeIdRef.current) {
          setSelectedNodeId(null);
          selectedNodeIdRef.current = null;
        }
      }

      const targetX = Math.round(nodeDragStartRef.current.nodeX + dx);
      const targetY = Math.round(nodeDragStartRef.current.nodeY + dy);

      // 廣闊畫布範圍限制，允許自由探索並防止卡片被拖移過遠遺失
      const clampedX = Math.max(-5000, Math.min(8000, targetX));
      const clampedY = Math.max(-5000, Math.min(8000, targetY));

      const updatedNodes = nodesRef.current.map((n) =>
        n.id === draggingNodeId
          ? {
              ...n,
              x: clampedX,
              y: clampedY,
            }
          : n,
      );
      nodesRef.current = updatedNodes;
      setNodes(updatedNodes);

      // 判斷附著在此節點或關聯線段上的留言，一同即時同步移動位置
      const updatedComments = syncAttachedComments(
        draggingNodeId,
        updatedNodes,
        commentsRef.current,
        connectionsRef.current,
        nodeSizesRef.current,
      );
      if (updatedComments !== commentsRef.current) {
        commentsRef.current = updatedComments;
        setComments(updatedComments);
      }
    };

    const handleNodeMouseUp = () => {
      const targetId = draggingNodeIdRef.current;
      const moved = nodeHasMovedRef.current;
      setDraggingNodeId(null);
      draggingNodeIdRef.current = null;

      // 若滑鼠點擊且未發生拖動位移，選取該節點並觸發聚焦置中動畫
      if (!moved && targetId) {
        setSelectedNodeId(targetId);
        selectedNodeIdRef.current = targetId;
        focusNode(targetId, null, true);
      } else if (moved) {
        // 卡片移動完成，記錄至步驟歷史（包含節點與一同移動的留言，支援最多恢復10步驟）
        pushHistory(nodesRef.current, undefined, commentsRef.current);
      }
    };

    // 使用 capture: true 確保即使游標移至子元素或停止冒泡的區域，亦必然接收 mouseup
    window.addEventListener("mousemove", handleNodeMouseMove);
    window.addEventListener("mouseup", handleNodeMouseUp, { capture: true });
    window.addEventListener("mouseleave", handleNodeMouseUp);
    window.addEventListener("blur", handleNodeMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleNodeMouseMove);
      window.removeEventListener("mouseup", handleNodeMouseUp, { capture: true });
      window.removeEventListener("mouseleave", handleNodeMouseUp);
      window.removeEventListener("blur", handleNodeMouseUp);
    };
  }, [draggingNodeId, focusNode, pushHistory]);

  /* 取得節點在特定端點（上下左右）之畫布座標 (Requirement 2) */
  const getPortCoords = useCallback(
    (nodeId, portName = "right") => {
      return getNodePortCoords(nodeId, portName, nodes, nodeSizes);
    },
    [nodes, nodeSizes],
  );

  const getPortCoordsRef = useRef(getPortCoords);
  useEffect(() => {
    getPortCoordsRef.current = getPortCoords;
  }, [getPortCoords]);

  /* 計算當前選取的線段其三次貝茲曲線中心點 (用於最上層浮動操作按鈕，確保兩卡片太近時按鈕永遠在卡片上方) */
  const selectedConnMid = useMemo(() => {
    if (!selectedConnectionId) return null;
    const conn = connections.find((c) => c.id === selectedConnectionId);
    if (!conn) return null;
    const fromNode = nodes.find((n) => n.id === conn.from);
    const toNode = nodes.find((n) => n.id === conn.to);
    if (!fromNode || !toNode) return null;

    const start = getPortCoords(conn.from, conn.fromPort || "right");
    const end = getPortCoords(conn.to, conn.toPort || "left");
    const { midX, midY } = getBezierData(
      start,
      end,
      conn.fromPort || "right",
      conn.toPort || "left",
    );
    return { midX, midY, conn };
  }, [selectedConnectionId, connections, nodes, getPortCoords]);

  /* 開始從端點拉出連接線 (Requirement 2) */
  const handlePortMouseDown = useCallback(
    (e, nodeId, portName) => {
      // 僅滑鼠左鍵可拉線，且僅在指標選擇模式下允許連線（禁止與留言功能時全面關閉連線）
      if (e.button !== 0) return;
      if (toolRef.current !== "pointer") return;

      // 互斥防護：若卡片正在拖動或畫布正在平移，絕對不開始拉線
      if (draggingNodeIdRef.current || isPanningRef.current) return;

      e.stopPropagation();
      e.preventDefault();

      // 確保卡片拖動狀態與線段選取完全清除
      setDraggingNodeId(null);
      draggingNodeIdRef.current = null;
      setSelectedConnectionId(null);

      let startX, startY;
      if (e.currentTarget && canvasRef.current) {
        const portRect = e.currentTarget.getBoundingClientRect();
        const canvasRect = canvasRef.current.getBoundingClientRect();
        const scale = zoomRef.current / 100;
        startX =
          (portRect.left + portRect.width / 2 - canvasRect.left - panRef.current.x) /
          scale;
        startY =
          (portRect.top + portRect.height / 2 - canvasRect.top - panRef.current.y) /
          scale;
      } else {
        const start = getPortCoords(nodeId, portName);
        startX = start.x;
        startY = start.y;
      }

      startX = Math.round(startX * 10) / 10;
      startY = Math.round(startY * 10) / 10;

      const initialLine = {
        fromNodeId: nodeId,
        fromPort: portName,
        startX,
        startY,
        currentX: startX,
        currentY: startY,
        snappedNodeId: null,
        snappedPort: null,
      };

      connectingRef.current = initialLine;
      setConnectingLine(initialLine);
      setHoveredPort(null);
    },
    [getPortCoords, setSelectedConnectionId],
  );

  /* 拉線過程中之滑鼠移動與全域釋放監聽（使用持久事件監聽，流暢不卡頓不中斷） */
  useEffect(() => {
    if (!isConnecting) return;

    const handleMouseMove = (e) => {
      if (!canvasRef.current || !connectingRef.current) return;

      // 若滑鼠按鍵已放開，終止拉線
      if (e.buttons === 0) {
        connectingRef.current = null;
        setConnectingLine(null);
        setHoveredPort(null);
        return;
      }

      const rect = canvasRef.current.getBoundingClientRect();
      const scale = zoomRef.current / 100;
      const mouseCanvasX = (e.clientX - rect.left - panRef.current.x) / scale;
      const mouseCanvasY = (e.clientY - rect.top - panRef.current.y) / scale;

      const fromId = connectingRef.current.fromNodeId;

      // 智慧磁吸演算法：
      // 1. 先檢驗游標是否落在任一目標卡片範圍內（精確卡片優先）
      let nodeUnderMouse = null;
      for (const node of nodesRef.current) {
        if (node.id === fromId) continue;
        const size = nodeSizesRef.current[node.id];
        const w = size?.width || 280;
        const h = size?.height || (node.comment ? 154 : 118);
        if (
          mouseCanvasX >= node.x &&
          mouseCanvasX <= node.x + w &&
          mouseCanvasY >= node.y &&
          mouseCanvasY <= node.y + h
        ) {
          nodeUnderMouse = node;
          break;
        }
      }

      const ports = ["top", "bottom", "left", "right"];
      let bestPort = null;

      if (nodeUnderMouse) {
        let closestDist = Infinity;
        for (const p of ports) {
          const coords = getPortCoordsRef.current(nodeUnderMouse.id, p);
          const dist = Math.hypot(mouseCanvasX - coords.x, mouseCanvasY - coords.y);
          if (dist < closestDist) {
            closestDist = dist;
            bestPort = {
              nodeId: nodeUnderMouse.id,
              port: p,
              x: coords.x,
              y: coords.y,
              dist,
            };
          }
        }
      } else {
        let minDistance = 56; // 56px 磁吸半徑
        for (const node of nodesRef.current) {
          if (node.id === fromId) continue;
          for (const p of ports) {
            const coords = getPortCoordsRef.current(node.id, p);
            const dist = Math.hypot(mouseCanvasX - coords.x, mouseCanvasY - coords.y);
            if (dist < minDistance) {
              minDistance = dist;
              bestPort = {
                nodeId: node.id,
                port: p,
                x: coords.x,
                y: coords.y,
                dist,
              };
            }
          }
        }
      }

      let curX = mouseCanvasX;
      let curY = mouseCanvasY;

      if (bestPort) {
        // 磁吸鎖定至該端點！
        curX = bestPort.x;
        curY = bestPort.y;
        connectingRef.current.snappedNodeId = bestPort.nodeId;
        connectingRef.current.snappedPort = bestPort.port;
        setHoveredPort({ nodeId: bestPort.nodeId, port: bestPort.port });
      } else {
        connectingRef.current.snappedNodeId = null;
        connectingRef.current.snappedPort = null;
        setHoveredPort(null);
      }

      connectingRef.current.currentX = curX;
      connectingRef.current.currentY = curY;

      setConnectingLine((prev) =>
        prev
          ? {
              ...prev,
              currentX: Math.round(curX * 10) / 10,
              currentY: Math.round(curY * 10) / 10,
            }
          : null,
      );
    };

    const handleMouseUp = () => {
      const snap = connectingRef.current;
      if (snap && snap.snappedNodeId && snap.snappedPort) {
        const targetNodeId = snap.snappedNodeId;
        const targetPort = snap.snappedPort;
        const fromNodeId = snap.fromNodeId;
        const fromPort = snap.fromPort;

        setConnections((prev) => {
          const exists = prev.some(
            (c) =>
              c.from === fromNodeId &&
              c.fromPort === fromPort &&
              c.to === targetNodeId &&
              c.toPort === targetPort,
          );
          if (exists) {
            return prev;
          }
          const nextConns = [
            ...prev,
            {
              id: `c-${Date.now().toString(36)}`,
              from: fromNodeId,
              fromPort: fromPort,
              to: targetNodeId,
              toPort: targetPort,
            },
          ];
          pushHistory(undefined, nextConns, undefined);
          return nextConns;
        });
      }

      connectingRef.current = null;
      setConnectingLine(null);
      setHoveredPort(null);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp, { capture: true });
    window.addEventListener("mouseleave", handleMouseUp);
    window.addEventListener("blur", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp, { capture: true });
      window.removeEventListener("mouseleave", handleMouseUp);
      window.removeEventListener("blur", handleMouseUp);
    };
  }, [isConnecting, pushHistory]);

  /* 線段按下滑鼠：支援「禁止模式快速切換」、「留言模式留言」、「點擊選取」與「按住拖曳拔除 (Unplug)」 */
  const handleConnectionMouseDown = useCallback(
    (e, conn) => {
      // 僅滑鼠左鍵可操作
      if (e.button !== 0) return;

      // 禁止模式：快速切換線段禁止狀態
      if (toolRef.current === "limit") {
        e.stopPropagation();
        e.preventDefault();
        toggleConnectionDisabled(conn.id);
        return;
      }

      // 留言模式：直接在線段上新增留言 Pin
      if (toolRef.current === "comment") {
        e.stopPropagation();
        e.preventDefault();
        if (!canvasRef.current) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const scale = zoomRef.current / 100;
        const clickX = Math.round((e.clientX - rect.left - panRef.current.x) / scale);
        const clickY = Math.round((e.clientY - rect.top - panRef.current.y) / scale);

        setDraftComment({
          x: clickX,
          y: clickY,
          text: "",
        });
        setActiveCommentId(null);
        return;
      }

      if (draggingNodeIdRef.current || isConnecting || isPanningRef.current) return;

      e.stopPropagation();
      e.preventDefault();

      setSelectedToolId(null);
      setPreviewToolNode(null);
      setSelectedNodeId(null);
      setSelectedConnectionId(conn.id);

      const startClientX = e.clientX;
      const startClientY = e.clientY;
      let isUnplugged = false;

      const handleWindowMouseMove = (moveEvent) => {
        if (moveEvent.buttons === 0) {
          cleanUp();
          return;
        }
        const dx = moveEvent.clientX - startClientX;
        const dy = moveEvent.clientY - startClientY;

        if (!isUnplugged && Math.hypot(dx, dy) > 5) {
          isUnplugged = true;
          // 拔除！從 connections 中移除該連線
          const nextConns = connectionsRef.current.filter((c) => c.id !== conn.id);
          setConnections(nextConns);
          setSelectedConnectionId(null);
          pushHistory(undefined, nextConns, undefined);

          // 轉換為即時拉線 connectingLine，由起點拉出跟隨游標
          const start = getPortCoords(conn.from, conn.fromPort || "right");
          const scale = zoomRef.current / 100;
          const rect = canvasRef.current.getBoundingClientRect();
          const curX = (moveEvent.clientX - rect.left - panRef.current.x) / scale;
          const curY = (moveEvent.clientY - rect.top - panRef.current.y) / scale;

          const liveLine = {
            fromNodeId: conn.from,
            fromPort: conn.fromPort || "right",
            startX: start.x,
            startY: start.y,
            currentX: curX,
            currentY: curY,
            snappedNodeId: null,
            snappedPort: null,
            isFromUnplug: true,
          };
          connectingRef.current = liveLine;
          setConnectingLine(liveLine);

          cleanUp();
        }
      };

      const handleWindowMouseUp = () => {
        cleanUp();
      };

      function cleanUp() {
        window.removeEventListener("mousemove", handleWindowMouseMove);
        window.removeEventListener("mouseup", handleWindowMouseUp, { capture: true });
      }

      window.addEventListener("mousemove", handleWindowMouseMove);
      window.addEventListener("mouseup", handleWindowMouseUp, { capture: true });
    },
    [getPortCoords, isConnecting, pushHistory, toggleConnectionDisabled],
  );

  /* 拖曳新增至想要位置 (Requirement 4) */
  const handleCanvasDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleCanvasDrop = (e) => {
    e.preventDefault();
    setIsDraggingTool(false);
    const data = e.dataTransfer.getData("application/json");
    if (!data) return;

    try {
      const toolItem = JSON.parse(data);
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const scale = zoomRef.current / 100;

      let dropClientX = e.clientX - rect.left;
      let dropClientY = e.clientY - rect.top;

      // 防遮擋安全定位：設定視窗位於右上角 (寬 280px + 右距 16px = 296px)
      // 若放置位置偏向右上側設定視窗範圍，自動鎖定至視窗左側安全區域，確保卡片完全不被遮擋
      const panelSafetyMargin = 32;
      const cardScaledWidth = NODE_WIDTH * scale;
      const maxSafeClientX = rect.width - 296 - cardScaledWidth / 2 - panelSafetyMargin;
      if (dropClientX > maxSafeClientX && dropClientY < 600) {
        dropClientX = maxSafeClientX;
      }

      // 垂直邊界安全限制：避免太靠頂部邊界
      const cardScaledHeight = NODE_HEIGHT * scale;
      const minSafeClientY = 60 + cardScaledHeight / 2;
      const maxSafeClientY = rect.height - 60 - cardScaledHeight / 2;
      dropClientY = Math.max(minSafeClientY, Math.min(maxSafeClientY, dropClientY));

      const canvasX = (dropClientX - panRef.current.x) / scale - NODE_WIDTH / 2;
      const canvasY = (dropClientY - panRef.current.y) / scale - NODE_HEIGHT / 2;

      const newNode = createNodeFromTool(toolItem, canvasX, canvasY);
      const nextNodes = [...nodesRef.current, newNode];
      nodesRef.current = nextNodes;
      setNodes(nextNodes);
      setSelectedNodeId(newNode.id);
      setSelectedToolId(null);
      setPreviewToolNode(null);
      pushHistory(nextNodes, undefined, undefined);

      // 自動跟蹤定位，鎖定視野使其置於設定視窗左側安全位置，完全不被遮擋
      focusNode(newNode.id, nextNodes, true);
    } catch (err) {
      console.error(err);
    }
  };

  /* 點擊側邊欄項目：單純查看設置項目（進入 selected 狀態），不可新增節點，且面板不具儲存配置與關閉按鈕，僅保留右上角叉叉 */
  const handleToolSelect = (toolItem) => {
    setSelectedToolId(toolItem.id);
    setSelectedNodeId(null);
    setSelectedConnectionId(null);

    const template = TOOL_NODE_MAP[toolItem.id] || {
      title: toolItem.label || "新節點",
      subtitle: "工作流程節點",
      category: "data",
      iconKey: "database",
    };

    const isTrigger = toolItem.id === "tigger" || template.category === "trigger";
    const previewNode = {
      id: `preview-${toolItem.id}`,
      toolId: toolItem.id,
      name: template.title,
      title: template.title,
      subtitle: template.subtitle,
      category: template.category,
      iconKey: template.iconKey,
      status: "idle",
      duration: "0ms",
      recordCount: "預覽",
      hasInput: !isTrigger,
      outputCount: 1,
      x: 0,
      y: 0,
      params: getDefaultParamsForTool(toolItem.id),
      isPreview: true,
    };
    setPreviewToolNode(previewNode);
  };

  /* 工具列切換工具（當切換至禁止或留言模式時，主動清除中斷拉線狀態） */
  const handleToolChange = useCallback((nextTool) => {
    setTool(nextTool);
    if (nextTool !== "pointer") {
      connectingRef.current = null;
      setConnectingLine(null);
      setHoveredPort(null);
    }
  }, []);

  /* 右側工具開始拖曳：將拖曳圖像設置為 75% 比例之單一動態節點卡片 (徹底避免多卡片堆疊重疊) */
  const handleToolDragStart = useCallback((event, toolItem) => {
    if (!event.dataTransfer || !toolItem) return;
    setIsDraggingTool(true);
    const template = TOOL_NODE_MAP[toolItem.id] || {
      title: toolItem.label || "新節點",
      subtitle: "工作流程節點",
      category: "data",
      iconKey: "database",
    };

    const ghostCard = document.getElementById("drag-ghost-card");
    if (!ghostCard) return;

    // 1. 同步即時更新單一卡片之文字內容
    const titleEl = ghostCard.querySelector("[data-ghost-title]");
    if (titleEl) titleEl.textContent = template.title;

    const subEl = ghostCard.querySelector("[data-ghost-subtitle]");
    if (subEl) subEl.textContent = template.subtitle;

    // 2. 更新類別徽章樣式與文字
    const badgeEl = ghostCard.querySelector("[data-ghost-badge]");
    const catStyle = CATEGORY_STYLES[template.category] || CATEGORY_STYLES.data;
    if (badgeEl) {
      badgeEl.textContent = catStyle.label;
      badgeEl.className = `inline-flex items-center px-8 py-2 rounded-full text-caption-1 font-medium border ${catStyle.badge}`;
    }

    // 3. 更新圖示外框色彩與內部 SVG
    const iconWrapEl = ghostCard.querySelector("[data-ghost-icon-wrap]");
    if (iconWrapEl) {
      iconWrapEl.className = `flex h-40 w-40 shrink-0 items-center justify-center rounded-xl ${catStyle.iconBg}`;
    }

    const iconEl = ghostCard.querySelector("[data-ghost-icon]");
    const targetIconEl = document.getElementById(`ghost-icon-source-${template.iconKey}`) || document.getElementById("ghost-icon-source-database");
    if (iconEl && targetIconEl) {
      iconEl.innerHTML = targetIconEl.innerHTML;
    }

    // 4. 強制 reflow 確保內容完全渲染，並以中心錨點 (105, 48) 設定拖曳預覽
    void ghostCard.offsetHeight;
    event.dataTransfer.setDragImage(ghostCard, 105, 48);
  }, []);

  function handleAction(action) {
    if (action === "undo") {
      handleUndo();
    } else if (action === "redo") {
      handleRedo();
    } else if (action === "test-workflow") {
      // 1. 識別畫布上所有啟用的觸發節點 (Trigger)
      const isTrigger = (n) =>
        Boolean(
          n &&
          (n.category === "trigger" ||
           n.iconKey === "trigger" ||
           n.toolId === "tigger" ||
           n.toolId === "trigger" ||
           n.id === "trigger-cron" ||
           n.id?.startsWith("trigger-") ||
           n.isRootTrigger ||
           n.isFixed ||
           isTriggerNode(n))
        );

      const activeTriggers = nodes.filter(
        (n) => isTrigger(n) && !n.disabled && !disabledNodeIds.has(n.id),
      );

      if (activeTriggers.length === 0) {
        showToast("⚠️ 畫布上尚無啟用的觸發節點 (Trigger)，無法執行測試！");
        return;
      }

      // 2. 尋找有向外串聯之觸發節點，並透過 BFS 收集所有由 Trigger 串聯導通之有效節點 (包含 Trigger 本身及所有下游客戶端節點)
      // 未與 Trigger 連接的孤立/獨立節點不納入測試驗證範圍
      const connectedTriggers = activeTriggers.filter((t) => {
        const outConns = connections.filter(
          (c) => c.from === t.id && !c.disabled && !disabledConnectionIds.has(c.id),
        );
        return outConns.length > 0;
      });

      if (connectedTriggers.length === 0) {
        showToast("⚠️ 觸發節點尚未串聯任何流程節點，無法進行流程測試！");
        return;
      }

      const triggerConnectedNodeIds = new Set();
      const queue = [];

      for (const t of connectedTriggers) {
        triggerConnectedNodeIds.add(t.id);
        queue.push(t.id);
      }

      while (queue.length > 0) {
        const currentId = queue.shift();
        const outConns = connections.filter(
          (c) => c.from === currentId && !c.disabled && !disabledConnectionIds.has(c.id),
        );

        for (const conn of outConns) {
          const targetNode = nodes.find((n) => n.id === conn.to);
          if (!targetNode || targetNode.disabled || disabledNodeIds.has(targetNode.id)) {
            continue;
          }
          if (!triggerConnectedNodeIds.has(targetNode.id)) {
            triggerConnectedNodeIds.add(targetNode.id);
            queue.push(targetNode.id);
          }
        }
      }

      // 3. 只評斷有串聯且由 Trigger 導通的有效節點 (排除畫布上未連接的獨立節點)
      const activeFlowNodes = nodes.filter((n) => triggerConnectedNodeIds.has(n.id));

      const errorNodes = activeFlowNodes.filter(
        (n) => nodeValidations[n.id]?.status === "error",
      );
      if (errorNodes.length > 0) {
        const first = errorNodes[0];
        setSelectedNodeId(first.id);
        selectedNodeIdRef.current = first.id;
        focusNode(first.id, null, true);
        showToast(
          `❌ 流程串聯節點「${first.name || first.title}」存在阻斷錯誤（已標示紅框），無法進行流程，請修正後再試！`,
        );
        return;
      }

      const warningNodes = activeFlowNodes.filter(
        (n) => nodeValidations[n.id]?.status === "warning",
      );
      if (warningNodes.length > 0) {
        showToast(`⚠️ 串聯流程中尚有 ${warningNodes.length} 個節點未填寫完整，正在以預設配置進行測試...`);
      } else {
        showToast("🚀 有效串聯流程驗證通過，正在測試執行工作流程！");
      }
    }
  }

  /* 新增工作流程：重設畫布為預設值，僅保留單一 Trigger 節點在畫布中間 (Requirement) */
  const handleCreateWorkflow = useCallback(
    (newTitle) => {
      setWorkflowTitle(newTitle);

      const defaultTrigger = {
        id: "trigger-cron",
        isFixed: true,
        isRootTrigger: true,
        toolId: "tigger",
        itemTitle: "定時觸發",
        name: "定時觸發",
        title: "定時觸發",
        subtitle: "工作流程起始事件觸發器",
        category: "trigger",
        iconKey: "trigger",
        status: "idle",
        duration: "0ms",
        recordCount: "就緒中",
        hasInput: false,
        outputCount: 1,
        x: 360,
        y: 240,
        params: {
          cron: "0 10 * * *",
          time: "10:00 AM",
          date: "Oct 18, 2026",
          timezone: "Asia/Taipei",
          triggerType: "schedule",
          active: true,
        },
      };

      setNodes([defaultTrigger]);
      nodesRef.current = [defaultTrigger];
      setConnections([]);
      connectionsRef.current = [];
      setComments([]);
      setSelectedNodeId(defaultTrigger.id);
      selectedNodeIdRef.current = defaultTrigger.id;
      setSelectedConnectionId(null);
      selectedConnectionIdRef.current = null;
      setMode("edit");

      // 重設 Undo/Redo 歷程堆疊
      setHistoryStack([
        {
          nodes: [defaultTrigger],
          connections: [],
          comments: [],
        },
      ]);
      setHistoryIndex(0);

      // 計算平移使單一 Trigger 卡片剛好落在可視畫布正中央且不被右側面板遮蔽
      if (canvasRef.current) {
        const { clientWidth, clientHeight } = canvasRef.current;
        if (clientWidth > 0 && clientHeight > 0) {
          const scale = zoom / 100;
          const nodeCenterX = 360 + NODE_WIDTH / 2; // 500
          const nodeCenterY = 240 + 118 / 2; // 299
          const detailPanelLeft = clientWidth - 296;
          const gapFromDetail = 32;
          const cardScaledWidth = NODE_WIDTH * scale;
          const targetScreenX =
            clientWidth > 700
              ? Math.round(detailPanelLeft - gapFromDetail - cardScaledWidth / 2)
              : Math.round((clientWidth - 296) / 2);
          const targetPanX = Math.round(targetScreenX - nodeCenterX * scale);
          const targetPanY = Math.round(clientHeight / 2 - nodeCenterY * scale);
          setPan({ x: targetPanX, y: targetPanY });
          panRef.current = { x: targetPanX, y: targetPanY };
        }
      }

      // 平滑動畫聚焦鎖定在 Trigger 節點身上
      requestAnimationFrame(() => {
        focusNode(defaultTrigger.id, [defaultTrigger], true, true);
      });

      showToast(`✨ 已建立新工作流程「${newTitle}」，畫布已重設為單一觸發節點`);
    },
    [zoom, showToast, focusNode],
  );

  /* 選擇切換現有工作流程 */
  const handleSelectWorkflow = useCallback(
    (workflowItem) => {
      setWorkflowTitle(workflowItem.title);
      if (
        workflowItem.id === "wf-1" ||
        workflowItem.title.includes("每日最新設計文章")
      ) {
        setNodes(INITIAL_NODES);
        nodesRef.current = INITIAL_NODES;
        setConnections(INITIAL_CONNECTIONS);
        connectionsRef.current = INITIAL_CONNECTIONS;
        setComments(INITIAL_COMMENTS);
        setHistoryStack([
          {
            nodes: INITIAL_NODES,
            connections: INITIAL_CONNECTIONS,
            comments: INITIAL_COMMENTS,
          },
        ]);
        setHistoryIndex(0);
        setSelectedNodeId(INITIAL_NODES[0].id);
        selectedNodeIdRef.current = INITIAL_NODES[0].id;
        setSelectedConnectionId(null);
        selectedConnectionIdRef.current = null;

        if (canvasRef.current) {
          const { clientWidth, clientHeight } = canvasRef.current;
          if (clientWidth > 0 && clientHeight > 0) {
            const scale = zoom / 100;
            const initialPanX = Math.round(clientWidth / 2 - 940 * scale);
            const initialPanY = Math.round(clientHeight / 2 - 280 * scale);
            panRef.current = { x: initialPanX, y: initialPanY };
            setPan({ x: initialPanX, y: initialPanY });
          }
        }
      } else {
        const defaultTrigger = {
          id: "trigger-cron",
          isFixed: true,
          isRootTrigger: true,
          toolId: "tigger",
          itemTitle: "定時觸發",
          name: "定時觸發",
          title: "定時觸發",
          subtitle: "工作流程起始事件觸發器",
          category: "trigger",
          iconKey: "trigger",
          status: "idle",
          duration: "0ms",
          recordCount: "就緒中",
          hasInput: false,
          outputCount: 1,
          x: 360,
          y: 240,
          params: {
            cron: "0 10 * * *",
            time: "10:00 AM",
            date: "Oct 18, 2026",
            timezone: "Asia/Taipei",
            triggerType: "schedule",
            active: true,
          },
        };

        setNodes([defaultTrigger]);
        nodesRef.current = [defaultTrigger];
        setConnections([]);
        connectionsRef.current = [];
        setComments([]);
        setSelectedNodeId(defaultTrigger.id);
        selectedNodeIdRef.current = defaultTrigger.id;
        setSelectedConnectionId(null);
        selectedConnectionIdRef.current = null;

        if (canvasRef.current) {
          const { clientWidth, clientHeight } = canvasRef.current;
          if (clientWidth > 0 && clientHeight > 0) {
            const scale = zoom / 100;
            const nodeCenterX = 360 + NODE_WIDTH / 2;
            const nodeCenterY = 240 + 118 / 2;
            const detailPanelLeft = clientWidth - 296;
            const gapFromDetail = 32;
            const cardScaledWidth = NODE_WIDTH * scale;
            const targetScreenX =
              clientWidth > 700
                ? Math.round(detailPanelLeft - gapFromDetail - cardScaledWidth / 2)
                : Math.round((clientWidth - 296) / 2);
            const targetPanX = Math.round(targetScreenX - nodeCenterX * scale);
            const targetPanY = Math.round(clientHeight / 2 - nodeCenterY * scale);
            setPan({ x: targetPanX, y: targetPanY });
            panRef.current = { x: targetPanX, y: targetPanY };
          }
        }

        requestAnimationFrame(() => {
          focusNode(defaultTrigger.id, [defaultTrigger], true, true);
        });
      }
    },
    [zoom, focusNode],
  );

  return (
    <>
      {/* 拖曳自訂卡片預覽容器：僅保留單一專屬動態卡片，完全杜絕多卡疊加重疊 */}
      <div
        aria-hidden="true"
        className="fixed pointer-events-none select-none"
        style={{
          top: 0,
          left: 0,
          zIndex: -9999,
          opacity: 1,
        }}
      >
        <div
          id="drag-ghost-card"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 210,
            height: 96,
          }}
        >
          <div
            style={{
              width: 280,
              transform: "scale(0.75)",
              transformOrigin: "top left",
            }}
          >
            <div className="relative rounded-2xl bg-white p-16 shadow-drop-s border border-stroke/70 font-primary text-left select-none box-border">
              {/* 頂部類別標籤 */}
              <div className="flex items-center justify-between gap-8 mb-8">
                <span
                  data-ghost-badge="true"
                  className="inline-flex items-center px-8 py-2 rounded-full text-caption-1 font-medium border bg-primary/15 text-primary border-primary/20"
                >
                  觸發器
                </span>
                <span className="text-caption-2 text-description font-mono">
                  #node
                </span>
              </div>

              {/* 主體：圖示與標題 */}
              <div className="flex items-start gap-12">
                <div
                  data-ghost-icon-wrap="true"
                  className="flex h-40 w-40 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"
                >
                  <span data-ghost-icon="true" className="h-20 w-20 flex items-center justify-center">
                    {NODE_ICONS.trigger}
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <h3
                    data-ghost-title="true"
                    className="m-0 truncate text-label-2 font-medium text-fontcolor"
                  >
                    Tigger 觸發節點
                  </h3>
                  <p
                    data-ghost-subtitle="true"
                    className="m-0 mt-4 line-clamp-1 text-caption-1 text-description"
                  >
                    工作流程起始事件觸發器
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 向量圖示快取庫供同步提取 innerHTML */}
        <div style={{ display: "none" }}>
          {Object.entries(NODE_ICONS).map(([key, svg]) => (
            <div key={key} id={`ghost-icon-source-${key}`}>
              {svg}
            </div>
          ))}
        </div>
      </div>

      <WorkflowLayout
        title={workflowTitle}
        onTitleChange={setWorkflowTitle}
        onCreateWorkflow={handleCreateWorkflow}
        onSelectWorkflow={handleSelectWorkflow}
        selectedTool={selectedToolId}
        zoom={zoom}
        tool={tool}
        canUndo={canUndo}
        canRedo={canRedo}
        mode={mode}
        onModeChange={(newMode) => {
          setMode(newMode);
          if (newMode === "history") {
            setIsHistoryDetailOpen(true);
          }
        }}
        onToolChange={handleToolChange}
        onZoomChange={handleZoomChange}
        onAction={handleAction}
        onToolSelect={handleToolSelect}
        onToolDragStart={handleToolDragStart}
        historySidebar={
          isHistoryDetailOpen ? (
            <ExecutionDetailPanel
              run={activeRun}
              className="!border-0 !shadow-none !rounded-none !bg-transparent"
              onClose={() => setIsHistoryDetailOpen(false)}
              onBackToEdit={() => setMode("edit")}
              onRunWorkflow={() => {
                showToast(`⚡ 已重新排程執行歷程 ${activeRun?.id || ""}`);
              }}
            />
          ) : null
        }
      >
      {({ mode: currentMode }) => {
        const activeMode = currentMode || mode;
        if (activeMode === "history") {
          return (
            <div className="h-full w-full flex flex-col overflow-y-auto pr-4">
              <div className="flex-1 min-h-0">
                <ExecutionHistoryView
                  selectedRunId={selectedRunId}
                  onSelectRun={(runId) => {
                    setSelectedRunId(runId);
                    setIsHistoryDetailOpen(true);
                  }}
                />
              </div>
            </div>
          );
        }

        return (
          <div
            ref={canvasRef}
          onMouseDown={handleCanvasMouseDown}
          onClick={handleCanvasClick}
          onDragOver={handleCanvasDragOver}
          onDrop={handleCanvasDrop}
          className={`relative h-full w-full overflow-hidden select-none ${
            isPanning
              ? "cursor-grabbing"
              : tool === "limit"
                ? ""
                : tool === "comment"
                  ? ""
                  : "cursor-grab"
          }`}
          style={{
            backgroundColor: "#F8FAFC",
            backgroundImage:
              "radial-gradient(rgba(203, 213, 225, 0.45) 1.2px, transparent 1.2px)",
            backgroundPosition: `${pan.x}px ${pan.y}px`,
            backgroundSize: `${24 * (zoom / 100)}px ${24 * (zoom / 100)}px`,
            cursor: isPanning
              ? "grabbing"
              : tool === "limit"
                ? BAN_CURSOR
                : tool === "comment"
                  ? COMMENT_CURSOR
                  : isConnecting
                    ? "crosshair"
                    : "grab",
          }}
        >
          {/* 畫布視口容器（依 pan 與 zoom 平移縮放，設為 overflow-visible 確保無限畫布） */}
          <div
            className="absolute inset-0 pointer-events-none overflow-visible"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom / 100})`,
              transformOrigin: "0 0",
            }}
          >
            <div className="relative pointer-events-auto w-full h-full overflow-visible">
              {/* 連接線 (SVG)：移除固定邊界，設定 overflow-visible 確保無限畫布連線永不被裁切吃掉 */}
              <svg
                className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
                style={{ zIndex: 0, overflow: "visible" }}
              >
                {/* 已建立的連接線 */}
                {connections.map((conn) => {
                  const fromNode = nodes.find((n) => n.id === conn.from);
                  const toNode = nodes.find((n) => n.id === conn.to);
                  if (!fromNode || !toNode) return null;

                  const start = getPortCoords(conn.from, conn.fromPort || "right");
                  const end = getPortCoords(conn.to, conn.toPort || "left");

                  const { path: pathData } = getBezierData(
                    start,
                    end,
                    conn.fromPort || "right",
                    conn.toPort || "left",
                  );

                  const isHistory = mode === "history";
                  const isSelected = selectedConnectionId === conn.id;
                  const isDisabled = disabledConnectionIds.has(conn.id);

                  // 判斷主線顏色與虛線樣式
                  let mainStroke = isHistory ? "#369379" : "#5D84A2";
                  if (isDisabled) mainStroke = "#94A3B8";
                  if (isSelected) mainStroke = "#2563EB";

                  const strokeDash = isDisabled
                    ? "6 6"
                    : isHistory
                      ? "6 4"
                      : "none";

                  return (
                    <g key={conn.id} data-connection={conn.id} className="group/line">
                      {/* 隱形透明寬熱區 (24px)：極易點選選取與按住拖曳拔線 */}
                      <path
                        data-connection={conn.id}
                        d={pathData}
                        fill="none"
                        stroke="transparent"
                        strokeWidth="24"
                        style={{
                          cursor:
                            tool === "limit"
                              ? BAN_CURSOR
                              : tool === "comment"
                                ? COMMENT_CURSOR
                                : "pointer",
                        }}
                        className="pointer-events-auto"
                        onMouseDown={(e) => handleConnectionMouseDown(e, conn)}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (tool === "limit" || tool === "comment") return;
                          setSelectedToolId(null);
                          setSelectedNodeId(null);
                          setSelectedConnectionId(conn.id);
                        }}
                      />

                      {/* 選取狀態下的發光光暈外框 */}
                      {isSelected && (
                        <path
                          d={pathData}
                          fill="none"
                          stroke="#3B82F6"
                          strokeWidth="8"
                          strokeLinecap="round"
                          opacity="0.35"
                          className="pointer-events-none"
                        />
                      )}

                      {/* 底部立體襯線（非選取狀態時） */}
                      {!isSelected && (
                        <path
                          d={pathData}
                          fill="none"
                          stroke={isDisabled ? "#E2E8F0" : "#CBD5E1"}
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          className="pointer-events-none"
                        />
                      )}

                      {/* 主線段 */}
                      <path
                        d={pathData}
                        fill="none"
                        stroke={mainStroke}
                        strokeWidth={isSelected ? "3.5" : isDisabled ? "2" : "2.5"}
                        strokeDasharray={strokeDash}
                        strokeLinecap="round"
                        opacity={isDisabled ? 0.8 : 1}
                        className={`pointer-events-none transition-colors duration-150 ${
                          isHistory && !isDisabled ? "animate-pulse" : ""
                        }`}
                      />
                    </g>
                  );
                })}

                {/* 正在拉動的即時連線 (Requirement 2) */}
                {connectingLine && (
                  <g>
                    <path
                      d={getBezierPath(
                        { x: connectingLine.startX, y: connectingLine.startY },
                        { x: connectingLine.currentX, y: connectingLine.currentY },
                        connectingLine.fromPort,
                        hoveredPort
                          ? hoveredPort.port
                          : connectingLine.currentX >= connectingLine.startX
                            ? "left"
                            : "right",
                      )}
                      fill="none"
                      stroke={hoveredPort ? "#369379" : "#5D84A2"}
                      strokeWidth={hoveredPort ? "3" : "2.5"}
                      strokeDasharray={hoveredPort ? "none" : "6 4"}
                      strokeLinecap="round"
                      className={hoveredPort ? "" : "animate-pulse"}
                    />
                    <circle
                      cx={connectingLine.startX}
                      cy={connectingLine.startY}
                      r="4"
                      fill="#5D84A2"
                    />
                    {!hoveredPort && (
                      <circle
                        cx={connectingLine.currentX}
                        cy={connectingLine.currentY}
                        r="4"
                        fill="#5D84A2"
                      />
                    )}
                  </g>
                )}
              </svg>

              {/* 節點卡片渲染 */}
              {nodes.map((node) => {
                const isThisNodeDragging = draggingNodeId === node.id;
                const isAnyCardDragging = draggingNodeId !== null;

                return (
                  <div
                    key={node.id}
                    data-node="true"
                    data-node-id={node.id}
                    style={{
                      position: "absolute",
                      left: `${node.x}px`,
                      top: `${node.y}px`,
                      zIndex: isThisNodeDragging ? 35 : selectedNodeId === node.id ? 10 : 2,
                      cursor:
                        tool === "limit"
                          ? BAN_CURSOR
                          : tool === "comment"
                            ? COMMENT_CURSOR
                            : isConnecting
                              ? "crosshair"
                              : isThisNodeDragging
                                ? "grabbing"
                                : "grab",
                      userSelect: "none",
                      WebkitUserSelect: "none",
                    }}
                    onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                  >
                    <WorkflowNode
                      id={node.id}
                      itemTitle={resolveItemTitle(node)}
                      name={node.name || node.title}
                      title={node.title}
                      subtitle={node.subtitle}
                      category={node.category}
                      icon={NODE_ICONS[node.iconKey] || NODE_ICONS.database}
                      status={node.status}
                      duration={node.duration}
                      recordCount={node.recordCount}
                      disabled={disabledNodeIds.has(node.id)}
                      validation={nodeValidations[node.id]}
                      mode={mode}
                      hasInput={node.hasInput}
                      outputCount={node.outputCount}
                      selected={selectedNodeId === node.id}
                      isConnecting={isConnecting}
                      isDraggingCard={isAnyCardDragging}
                      connectedPorts={nodeConnectedPorts[node.id] || []}
                      canConnect={tool === "pointer"}
                      hoveredPort={hoveredPort}
                      onSizeChange={handleNodeSizeChange}
                      onPortMouseDown={handlePortMouseDown}
                      onPortMouseEnter={(nId, pName) => {
                        if (isConnecting && !isAnyCardDragging) {
                          setHoveredPort({ nodeId: nId, port: pName });
                        }
                      }}
                      onPortMouseLeave={() => {
                        if (isConnecting) {
                          setHoveredPort(null);
                        }
                      }}
                      onClick={() => {
                        if (nodeHasMovedRef.current) return;
                        if (tool === "limit" || tool === "comment") return;
                        focusNode(node.id, null, true);
                      }}
                    />
                  </div>
                );
              })}

              {/* 選取線段之操作按鈕浮動列 (放在一起的膠囊列，zIndex: 40) */}
              {selectedConnMid && (() => {
                const conn = selectedConnMid.conn;
                const isConnManuallyDisabled = !!conn.disabled;
                const isConnEffectiveDisabled = disabledConnectionIds.has(conn.id);
                return (
                  <div
                    key={`toolbar-${conn.id}`}
                    role="toolbar"
                    data-connection-toolbar="true"
                    aria-label="線段快捷操作"
                    style={{
                      position: "absolute",
                      left: `${selectedConnMid.midX}px`,
                      top: `${selectedConnMid.midY - 8}px`,
                      transform: "translate(-50%, -100%)",
                      zIndex: 40,
                    }}
                    className="flex items-center gap-4 rounded-full bg-white p-2 border border-stroke shadow-drop-s backdrop-blur-sm pointer-events-auto select-none"
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* 禁用 / 啟用按鈕 (Hover 與卡片禁止完全一致：呈現 warning 警示色與 hover 縮放) */}
                    <button
                      type="button"
                      title={
                        isConnManuallyDisabled
                          ? "啟用此連線 (恢復後續流程)"
                          : isConnEffectiveDisabled
                            ? "上游流程已中斷 (點擊可手動禁用此線)"
                            : "禁用此連線 (中斷後續流程)"
                      }
                      aria-label={
                        isConnManuallyDisabled
                          ? "啟用此連線"
                          : isConnEffectiveDisabled
                            ? "上游流程已中斷"
                            : "禁用此連線"
                      }
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleConnectionDisabled(conn.id);
                      }}
                      className={`w-[36px] h-[36px] flex items-center justify-center rounded-full transition-all hover:scale-105 active:scale-95 ${
                        isConnManuallyDisabled
                          ? "bg-warning/20 text-warning hover:bg-warning/30"
                          : isConnEffectiveDisabled
                            ? "bg-slate-100 text-slate-400 hover:bg-warning/10 hover:text-warning"
                            : "text-description hover:bg-warning/10 hover:text-warning"
                      }`}
                    >
                      {isConnManuallyDisabled ? (
                        <svg
                          viewBox="0 0 24 24"
                          className="w-[22px] h-[22px] stroke-current fill-none stroke-2"
                        >
                          <polygon points="5 3 19 12 5 21 5 3" className="fill-current" />
                        </svg>
                      ) : (
                        <svg
                          viewBox="0 0 24 24"
                          className="w-[22px] h-[22px] stroke-current fill-none stroke-2"
                        >
                          <circle cx="12" cy="12" r="9" />
                          <path d="m5 5 14 14" />
                        </svg>
                      )}
                    </button>

                    {/* 刪除按鈕 (直接紅色圖示，Hover 時淡紅底色與縮放) */}
                    <button
                      type="button"
                      title="刪除連線"
                      aria-label="刪除連線"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteConnection(conn.id);
                      }}
                      className="w-[36px] h-[36px] flex items-center justify-center rounded-full text-error hover:bg-error/10 transition-all hover:scale-105 active:scale-95"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="w-[22px] h-[22px] stroke-current fill-none stroke-2"
                      >
                        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" />
                      </svg>
                    </button>
                  </div>
                );
              })()}

              {/* 選取卡片下方之快捷操作浮動列 (複製、停用靠左，刪除靠右) */}
              {selectedNode && !isConnecting && (() => {
                const isNodeManuallyDisabled = !!selectedNode.disabled;
                const size = nodeSizes[selectedNode.id];
                const width = size?.width || NODE_WIDTH;
                const height = size?.height || (selectedNode.comment ? 154 : 118);

                return (
                  <div
                    key={`node-toolbar-${selectedNode.id}`}
                    role="toolbar"
                    data-node-toolbar="true"
                    aria-label="節點快捷操作"
                    style={{
                      position: "absolute",
                      left: `${selectedNode.x}px`,
                      top: `${selectedNode.y + height + 12}px`,
                      width: `${width}px`,
                      zIndex: 40,
                    }}
                    className="flex items-center justify-between pointer-events-auto select-none"
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* 靠左：兩個獨立按鈕 (複製、停用/啟用) */}
                    <div className="flex items-center gap-8">
                      {/* 獨立複製按鈕 */}
                      <button
                        type="button"
                        title="複製節點 (Duplicate)"
                        aria-label="複製節點"
                        onClick={(e) => {
                          e.stopPropagation();
                          duplicateNode(selectedNode.id);
                        }}
                        className="w-[36px] h-[36px] flex items-center justify-center rounded-full bg-white border border-stroke shadow-drop-s backdrop-blur-sm text-description hover:border-primary/50 hover:bg-primary/10 hover:text-primary transition-all hover:scale-105 active:scale-95"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          className="w-[22px] h-[22px] stroke-current fill-none stroke-2"
                        >
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                      </button>

                      {/* 獨立停用 / 啟用按鈕 */}
                      <button
                        type="button"
                        title={
                          isNodeManuallyDisabled
                            ? "啟用此節點 (恢復後續流程)"
                            : "停用此節點 (中斷後續流程)"
                        }
                        aria-label={isNodeManuallyDisabled ? "啟用節點" : "停用節點"}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleNodeDisabled(selectedNode.id);
                        }}
                        className={`w-[36px] h-[36px] flex items-center justify-center rounded-full bg-white border shadow-drop-s backdrop-blur-sm transition-all hover:scale-105 active:scale-95 ${
                          isNodeManuallyDisabled
                            ? "border-warning/50 bg-warning/15 text-warning hover:bg-warning/25"
                            : "border-stroke text-description hover:border-warning/50 hover:bg-warning/10 hover:text-warning"
                        }`}
                      >
                        {isNodeManuallyDisabled ? (
                          <svg
                            viewBox="0 0 24 24"
                            className="w-[22px] h-[22px] stroke-current fill-none stroke-2"
                          >
                            <polygon points="5 3 19 12 5 21 5 3" className="fill-current" />
                          </svg>
                        ) : (
                          <svg
                            viewBox="0 0 24 24"
                            className="w-[22px] h-[22px] stroke-current fill-none stroke-2"
                          >
                            <circle cx="12" cy="12" r="9" />
                            <path d="m5 5 14 14" />
                          </svg>
                        )}
                      </button>
                    </div>

                    {/* 靠右：獨立刪除按鈕 (固定觸發節點不可刪除) */}
                    {!isTriggerNode(selectedNode) && (
                      <div className="flex items-center">
                        <button
                          type="button"
                          title="刪除節點"
                          aria-label="刪除節點"
                          onClick={(e) => {
                            e.stopPropagation();
                            requestDeleteNode(selectedNode.id);
                          }}
                          className="w-[36px] h-[36px] flex items-center justify-center rounded-full bg-white border border-stroke shadow-drop-s backdrop-blur-sm text-error hover:border-error/50 hover:bg-error/10 transition-all hover:scale-105 active:scale-95"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            className="w-[22px] h-[22px] stroke-current fill-none stroke-2"
                          >
                            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Figma 風格全圓角畫布留言系統 (可複用元件) */}
              {comments.map((c) => (
                <CommentBubble
                  key={c.id}
                  comment={c}
                  zoom={zoom}
                  isSelected={activeCommentId === c.id}
                  initialHighlightedId={
                    justSubmittedCommentId === c.id ? `root-${c.id}` : null
                  }
                  onToggleSelect={(id) => {
                    setJustSubmittedCommentId(null);
                    setActiveCommentId((prev) => (prev === id ? null : id));
                    setDraftComment(null);
                  }}
                  onMoveEnd={handleMoveComment}
                  onResolve={handleToggleResolveComment}
                  onDelete={handleDeleteComment}
                  onReply={handleAddReply}
                  onClose={() => {
                    setJustSubmittedCommentId(null);
                    setActiveCommentId(null);
                  }}
                />
              ))}

              {/* 正在新增留言之草稿氣泡與編輯卡 (可複用元件) */}
              {draftComment && (
                <CommentDraftBubble
                  draft={draftComment}
                  onChange={(text) => setDraftComment((prev) => ({ ...prev, text }))}
                  onSubmit={handleCreateComment}
                  onCancel={() => setDraftComment(null)}
                />
              )}
            </div>
          </div>

          {/* 選取節點屬性詳情面板 (右上方)：畫布節點設定或側邊欄工具設定預覽 */}
          {activeDetailNode && (
            <div
              className={`transition-opacity duration-150 ${
                isDraggingTool ? "pointer-events-none opacity-20" : "opacity-100"
              }`}
            >
              <NodeDetailPanel
                node={activeDetailNode}
                validation={activeDetailNode ? nodeValidations[activeDetailNode.id] : null}
                connections={connections}
                allNodes={nodes}
                isPreview={Boolean(activeDetailNode.isPreview)}
                onClose={() => {
                  setSelectedNodeId(null);
                  selectedNodeIdRef.current = null;
                  setSelectedToolId(null);
                  setPreviewToolNode(null);
                }}
                onUpdateNode={handleUpdateNode}
                onSave={(nodeId) => {
                  pushHistory(nodesRef.current);
                  showToast("✅ 已成功儲存節點配置");
                }}
                isDisabledFlow={!activeDetailNode.isPreview && disabledNodeIds.has(activeDetailNode.id)}
                mode={mode}
                nodeIcons={NODE_ICONS}
                onSelectUnderlyingNode={handleSelectUnderlyingNode}
              />
            </div>
          )}

          {/* 訊息 Toast */}
          {toastMessage && (
            <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 flex items-center gap-8 rounded-full bg-fontcolor px-16 py-8 text-label-2 text-white shadow-drop-s transition-all">
              <span>{toastMessage}</span>
            </div>
          )}
        </div>
      );
    }}
  </WorkflowLayout>

    {/* 刪除卡片再次確認精簡對話框 */}
    {deleteConfirmTarget && (
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-dialog-title"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-16 backdrop-blur-[2px] animate-in fade-in duration-100"
        onClick={handleCancelDelete}
      >
        <div
          className="w-full max-w-[280px] rounded-2xl bg-white p-20 shadow-drop-m border border-stroke text-left font-primary animate-in zoom-in-95 duration-100"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 1. 向量警示 icon ＋ 刪除 */}
          <div className="flex items-center gap-8">
            <svg
              viewBox="0 0 24 24"
              className="h-20 w-20 shrink-0 fill-none stroke-warning stroke-2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="2.5" />
            </svg>
            <h3 id="delete-dialog-title" className="m-0 text-label-1 font-semibold text-fontcolor">
              刪除
            </h3>
          </div>

          {/* 2. 下方內容文字 (一般字色) */}
          <p className="m-0 mt-8 text-caption-1 text-fontcolor leading-relaxed">
            刪除後流程將會受到影響，是否確認刪除？
          </p>

          {/* 操作按鈕 (使用專案 Button 元件，高度統一為 !h-9) */}
          <div className="mt-16 flex items-center justify-end gap-8">
            <Button
              variant="ghost"
              intent="secondary"
              onClick={handleCancelDelete}
              className="!h-[36px] !px-12 !text-caption-1"
            >
              取消
            </Button>
            <Button
              variant="filled"
              intent="error"
              onClick={handleConfirmDelete}
              className="!h-[36px] !px-12 !text-caption-1"
            >
              確認刪除
            </Button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
