import { useId, useRef, useState, useEffect } from "react";
import Button from "../components/ui/button";
import ToggleButton from "../components/ui/togglebutton";
import ListItem from "../components/ui/listitem";
import { Tab as DefaultTab } from "../components/ui/tabs";
import Drawer from "../components/ui/drawer";
import { Input } from "../components/ui/input";
import Card from "../components/ui/card";
import FloatButton from "../components/ui/floatbutton";
import Select from "../components/ui/select";

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

/* =========================================================
 * [C00 Icon] 共用圖示
 * 圖示背景透明，不依賴額外圖示套件。
 * ======================================================= */

const ICONS = {
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,

  plus: <path d="M12 5v14M5 12h14" />,

  share: (
    <>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="m8.6 10.5 6.8-4m-6.8 7 6.8 4" />
    </>
  ),

  exit: <path d="M10 5H5v14h5M10 12h11m-4-4 4 4-4 4" />,

  close: <path d="M18 6 6 18M6 6l12 12" />,

  check: <polyline points="20 6 9 17 4 12" />,

  setting: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </>
  ),

  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </>
  ),

  pen: <path d="m4 16-1 5 5-1L20 8l-4-4L4 16Zm10-10 4 4" />,

  layers: (
    <path d="m12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5" />
  ),

  play: (
    <path
      d="m8 5 11 7-11 7V5Z"
      className="fill-current stroke-none"
    />
  ),

  left: <path d="m15 5-7 7 7 7" />,

  right: <path d="m9 5 7 7-7 7" />,

  pointer: (
    <path
      d="m4 3 16 9-7 2-3 7L4 3Z"
      className="fill-current stroke-none"
    />
  ),

  ban: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m6 6 12 12" />
    </>
  ),

  branch: (
    <>
      <rect x="9" y="3" width="6" height="5" rx="1" />
      <rect x="2" y="16" width="6" height="5" rx="1" />
      <rect x="16" y="16" width="6" height="5" rx="1" />
      <path d="M12 8v4H5v4m7-4h7v4" />
    </>
  ),

  comment: (
    <path d="M12 3a9 9 0 0 1 9 9c0 4.97-4.03 9-9 9a8.9 8.9 0 0 1-4.2-1L3 21l1-4.8A8.9 8.9 0 0 1 3 12a9 9 0 0 1 9-9Z" />
  ),

  zoomOut: (
    <>
      <circle cx="10" cy="10" r="6" />
      <path d="m15 15 5 5M7 10h6" />
    </>
  ),

  zoomIn: (
    <>
      <circle cx="10" cy="10" r="6" />
      <path d="m15 15 5 5M7 10h6m-3-3v6" />
    </>
  ),

  /* 資料庫 */
  database: (
    <>
      <ellipse cx="12" cy="5" rx="8" ry="3" />
      <path d="M4 5v7c0 4 16 4 16 0V5M4 12v7c0 4 16 4 16 0v-7" />
    </>
  ),

  /* AI 機器人 / 代理 */
  robot: (
    <>
      <rect x="4" y="7" width="16" height="13" rx="3" />
      <path d="M12 3v4M1 11v5m22-5v5M8 16h8" />
      <circle cx="8" cy="12" r="1" />
      <circle cx="16" cy="12" r="1" />
    </>
  ),

  link: (
    <path d="m9 15 6-6m-7 4-2 2a4 4 0 0 0 6 6l3-3m1-7 2-2a4 4 0 0 0-6-6L9 6" />
  ),

  code: <path d="m8 6-6 6 6 6m8-12 6 6-6 6M14 4l-4 16" />,

  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M7 3v4m10-4v4M3 10h18m-13 4h2m4 0h2m-8 4h2" />
    </>
  ),

  filter: <path d="M3 4h18l-7 8v7l-4 2v-9L3 4Z" />,

  copy: (
    <>
      <rect x="8" y="8" width="13" height="13" rx="2" />
      <path d="M16 8V3H3v13h5" />
    </>
  ),

  collection: (
    <path d="m12 3 9 5v9l-9 5-9-5V8l9-5Zm0 10v9M3 8l9 5 9-5M8 5l9 5" />
  ),

  statistics: <path d="M20 4H5l8 8-8 8h15M3 4v16" />,

  /* 流程控制與觸發：Trigger (觸發器) */
  trigger: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />,

  /* 迴圈迭代 */
  loop: (
    <>
      <path d="m17 2 4 4-4 4" />
      <path d="M3 11v-1a4 4 0 0 1 4-4h14M7 22l-4-4 4-4" />
      <path d="M21 13v1a4 4 0 0 1-4 4H3" />
    </>
  ),

  /* 延遲等待 */
  delay: (
    <>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </>
  ),

  /* JSON / 格式轉換 */
  json: (
    <path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5a2 2 0 0 0 2 2h1M16 3h1a2 2 0 0 1 2 2v5a2 2 0 0 0 2 2 2 2 0 0 0-2 2v5a2 2 0 0 1-2 2h-1" />
  ),

  /* 語言模型 (Sparkles) */
  sparkles: (
    <>
      <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3Z" />
      <path d="M5 3v4M3 5h4M19 17v4M17 19h4" />
    </>
  ),

  /* 結構化資訊擷取 */
  structure: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
    </>
  ),

  /* 知識庫問答 (書本) */
  book: (
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  ),

  /* 向量檢索 (放大鏡＋方向向量) */
  search: (
    <>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
      <path d="m11 8 2 3-2 3" />
    </>
  ),

  /* 文字向量化 (特徵線條) */
  embedding: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M7 8h10M7 12h6M7 16h8" />
    </>
  ),

  /* 圖像生成 */
  image: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </>
  ),

  /* 語音轉文字 (麥克風) */
  mic: (
    <>
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v3M8 22h8" />
    </>
  ),

  /* 文字轉語音 (揚聲器) */
  speaker: (
    <>
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14" />
    </>
  ),

  /* Webhook 接收端 */
  webhook: (
    <>
      <path d="M18 16.98h-5.99c-1.1 0-1.95.94-2.48 1.9A4 4 0 0 1 2 17c.01-.7.2-1.4.57-2" />
      <path d="m6 17 3.13-5.78c.53-.97.1-2.18-.5-3.1a4 4 0 1 1 6.89-4.06l3.19 5.74c.6 1.08 1.83 1.63 3.01 1.2A4 4 0 1 1 18 16.98Z" />
    </>
  ),

  /* HTTP 請求 (全球網際網路) */
  globe: (
    <>
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </>
  ),

  /* 子工作流程 */
  subworkflow: (
    <>
      <circle cx="18" cy="18" r="3" />
      <circle cx="6" cy="6" r="3" />
      <path d="M6 9v12M15 15l-6-6" />
      <circle cx="18" cy="6" r="3" />
      <path d="M18 9v6" />
    </>
  ),

  /* Google Sheets */
  sheets: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M3 15h18M9 3v18" />
    </>
  ),

  /* 操作導覽教學 (Help) */
  help: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </>
  ),

  /* Google Docs */
  docs: (
    <>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </>
  ),

  /* Telegram / Slack Bot */
  botchat: (
    <>
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </>
  ),

  /* 郵件發送 */
  mail: (
    <>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-10 7L2 7" />
    </>
  ),

  /* 雲端物件儲存 */
  cloud: <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />,

  /* API Tab 圖示 (雙向對接) */
  api: (
    <>
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </>
  ),

  /* 匯出圖示 */
  export: (
    <>
      <path d="M4 14v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4" />
      <polyline points="16 7 12 3 8 7" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </>
  ),
};

export function LayoutIcon({ name, className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cx(
        "h-16 w-16 shrink-0 bg-transparent fill-none stroke-current",
        className,
      )}
      aria-hidden="true"
      focusable="false"
    >
      {ICONS[name] || ICONS.database}
    </svg>
  );
}

/* =========================================================
 * 側欄內容設定 (Data、AI、API 三大分類完整分組與項目)
 * ======================================================= */

const SIDEBAR_TABS = [
  { value: "data", label: "Data", icon: "database" },
  { value: "ai", label: "AI", icon: "robot" },
  { value: "api", label: "API", icon: "api" },
];

const SIDEBAR_CONTENT = {
  data: [
    {
      title: "流程控制與觸發",
      items: [
        { id: "trigger", label: "Trigger", icon: "trigger" },
        { id: "branch", label: "條件分支", icon: "branch" },
        { id: "loop", label: "迴圈迭代", icon: "loop" },
        { id: "delay", label: "延遲等待", icon: "delay" },
      ],
    },
    {
      title: "資料轉換與處理",
      items: [
        { id: "code", label: "程式碼", icon: "code" },
        { id: "edit-field", label: "編輯欄位", icon: "pen" },
        { id: "datetime", label: "日期與時間格式化", icon: "calendar" },
        { id: "json-convert", label: "JSON / 格式轉換", icon: "json" },
      ],
    },
    {
      title: "篩選與彙整",
      items: [
        { id: "filter", label: "資料篩選", icon: "filter" },
        { id: "limit", label: "限制筆數", icon: "ban" },
        { id: "deduplicate", label: "移除重複項目", icon: "copy" },
        { id: "statistics", label: "彙整與計算", icon: "statistics" },
      ],
    },
  ],
  ai: [
    {
      title: "語言模型與代理",
      items: [
        { id: "llm", label: "語言模型", icon: "sparkles" },
        { id: "ai-agent", label: "AI 代理", icon: "robot" },
        { id: "structured-extract", label: "結構化資訊擷取", icon: "structure" },
      ],
    },
    {
      title: "知識庫與檢索",
      items: [
        { id: "kb-qa", label: "知識庫問答", icon: "book" },
        { id: "vector-search", label: "向量檢索", icon: "search" },
        { id: "text-embedding", label: "文字向量化", icon: "embedding" },
      ],
    },
    {
      title: "多模態轉換",
      items: [
        { id: "image-gen", label: "圖像生成", icon: "image" },
        { id: "speech-to-text", label: "語音轉文字", icon: "mic" },
        { id: "text-to-speech", label: "文字轉語音", icon: "speaker" },
      ],
    },
  ],
  api: [
    {
      title: "觸發與通訊協定",
      items: [
        { id: "webhook", label: "Webhook 接收端", icon: "webhook" },
        { id: "http-request", label: "HTTP 請求", icon: "globe" },
        { id: "sub-workflow", label: "子工作流程", icon: "subworkflow" },
      ],
    },
    {
      title: "常用應用服務",
      items: [
        { id: "google-sheets", label: "Google Sheets", icon: "sheets" },
        { id: "google-docs", label: "Google Docs", icon: "docs" },
        { id: "bot-integration", label: "Telegram / Slack Bot", icon: "botchat" },
        { id: "email-send", label: "郵件發送", icon: "mail" },
      ],
    },
    {
      title: "資料庫與雲端",
      items: [
        { id: "database-tool", label: "資料庫", icon: "database" },
        { id: "cloud-storage", label: "雲端物件儲存", icon: "cloud" },
      ],
    },
  ],
};

/* =========================================================
 * [C09 Formitem] 側欄工具分組
 * ======================================================= */

function ToolSection({
  group,
  ItemComponent,
  selectedTool,
  onPick,
  onDragStart,
}) {
  const headingId = useId();
  const ListItemComp = ItemComponent;

  return (
    <section
      data-component="Formitem"
      aria-labelledby={headingId}
      className="flex flex-col gap-4"
    >
      <h2
        id={headingId}
        className="m-0 font-primary text-[15px] font-normal leading-[20px] text-description"
      >
        {group.title}
      </h2>

      <div
        data-component="Divider"
        role="separator"
        className="border-t border-stroke"
      />

      <ul className="m-0 flex list-none flex-col gap-4 p-0">
        {group.items.map((item) => (
          <ListItemComp
            key={item.id}
            id={`tool-item-${item.id}`}
            data-tool-id={item.id}
            selected={selectedTool === item.id}
            showLeftIcon
            leftIcon={<LayoutIcon name={item.icon} />}
            onClick={() => onPick(item)}
            draggable
            onDragStart={(event) => {
              event.dataTransfer.setData("application/json", JSON.stringify(item));
              event.dataTransfer.effectAllowed = "copy";
              onDragStart?.(event, item);
            }}
          >
            {item.label}
          </ListItemComp>
        ))}
      </ul>
    </section>
  );
}

/* =========================================================
 * 左側抽屜常駐資料：自動化工作流程、服務憑證與快捷指南
 * ======================================================= */

const SYSTEM_WORKFLOWS = [
  {
    id: "wf-1",
    title: "每日最新設計文章爬蟲與AI摘要整理",
    status: "running",
    statusText: "運行中",
    updatedAt: "剛剛",
    runsCount: "1,248 次執行",
    category: "爬蟲 & AI",
  },
  {
    id: "wf-2",
    title: "客戶滿意度分析與自動化分流",
    status: "running",
    statusText: "運行中",
    updatedAt: "15 分鐘前",
    runsCount: "860 次執行",
    category: "CRM 客服",
  },
  {
    id: "wf-3",
    title: "社群媒體行銷文案多平台排程發布",
    status: "running",
    statusText: "運行中",
    updatedAt: "2 小時前",
    runsCount: "432 次執行",
    category: "行銷社群",
  },
  {
    id: "wf-4",
    title: "GitHub Issue & PR 自動化標籤與通知",
    status: "paused",
    statusText: "已暫停",
    updatedAt: "昨天",
    runsCount: "3,120 次執行",
    category: "DevOps",
  },
  {
    id: "wf-5",
    title: "資料庫每日定時增量自動化備份",
    status: "running",
    statusText: "運行中",
    updatedAt: "3 天前",
    runsCount: "92 次執行",
    category: "資料庫",
  },
];

const CREDENTIAL_ITEMS = [
  {
    id: "cred-1",
    name: "OpenAI API",
    account: "sk-proj-...8a9f",
    status: "connected",
    statusText: "已連線",
    model: "GPT-4o & Text Embedding",
  },
  {
    id: "cred-2",
    name: "Google Cloud Workspace",
    account: "service-acc@automation.iam",
    status: "connected",
    statusText: "已授權",
    model: "Sheets, Docs, Drive",
  },
  {
    id: "cred-3",
    name: "Anthropic API",
    account: "sk-ant-...c102",
    status: "connected",
    statusText: "已連線",
    model: "Claude 3.5 Sonnet",
  },
  {
    id: "cred-4",
    name: "Slack Incoming Webhook",
    account: "workspace.slack.com (#alerts)",
    status: "connected",
    statusText: "已連線",
    model: "Channel Bot Messaging",
  },
  {
    id: "cred-5",
    name: "PostgreSQL Production DB",
    account: "db-admin@10.0.1.42",
    status: "warning",
    statusText: "金鑰即將過期",
    model: "Read/Write Pool",
  },
];

/* =========================================================
 * 主佈局：WorkflowLayout
 * ======================================================= */

export default function WorkflowLayout({
  title = "客戶滿意度分析與自動化分流",
  onTitleChange,
  onCreateWorkflow,
  onSelectWorkflow,
  children,
  components = {},
  sidebarPanels = {},
  historySidebar,

  defaultZoom = 60,
  zoom: propZoom,
  tool: propTool,
  canUndo = false,
  canRedo = false,

  selectedTool: propSelectedTool,
  mode: propMode,
  defaultMode = "edit",
  sidebarTab: propSidebarTab,
  onAction,
  onToolSelect,
  onToolDragStart,
  onModeChange,
  onToolChange,
  onSidebarTabChange,
  onZoomChange,
}) {
  // 依傳入參數或預設小寫檔案匯入之元件
  const Btn = components.button ?? components.Button ?? Button;
  const ToggleBtn = components.togglebutton ?? components.ToggleButton ?? ToggleButton;
  const TabComp = components.tab ?? components.Tab ?? DefaultTab;
  const ListItemComp = components.listitem ?? components.ListItem ?? ListItem;
  const DrawerComp = components.drawer ?? components.Drawer ?? Drawer;
  const InputComp = components.input ?? components.Input ?? Input;
  const CardComp = components.card ?? components.Card ?? Card;
  const FloatButtonComp = components.floatbutton ?? components.FloatButton ?? FloatButton;
  const SelectComp = components.select ?? components.Select ?? Select;

  const id = useId();
  const tabRefs = useRef([]);

  /* 左側系統導航抽屜狀態 */
  const [isMenuDrawerOpen, setIsMenuDrawerOpen] = useState(false);
  const [menuDrawerTab, setMenuDrawerTab] = useState("workflows"); // "workflows" | "credentials" | "shortcuts"
  const [searchWorkflowQuery, setSearchWorkflowQuery] = useState("");
  const [workflowList, setWorkflowList] = useState(SYSTEM_WORKFLOWS);

  const filteredWorkflows = workflowList.filter(
    (item) =>
      item.title.toLowerCase().includes(searchWorkflowQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchWorkflowQuery.toLowerCase()),
  );

  /* 分享彈窗狀態 (圓角 22px, 陰影 m, Email 邀請、共編者清單、拷貝連結、分享至) */
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [invitePermission, setInvitePermission] = useState("edit"); // "edit" | "view"
  const [collaborators, setCollaborators] = useState([
    { email: "jacqueline@workflow.io", name: "Jacqueline", role: "擁有者", permission: "owner" },
    { email: "alex.chen@company.com", name: "Alex Chen", role: "可編輯", permission: "edit" },
    { email: "sarah.lin@company.com", name: "Sarah Lin", role: "僅可檢視", permission: "view" },
  ]);
  const [isCopied, setIsCopied] = useState(false);

  const handleUpdateCollaboratorPermission = (index, newPermission) => {
    setCollaborators((prev) =>
      prev.map((c, i) =>
        i === index
          ? {
              ...c,
              permission: newPermission,
              role: newPermission === "edit" ? "可編輯" : "僅可檢視",
            }
          : c,
      ),
    );
  };

  /* 新增工作流程彈窗狀態 (使用元件庫 Input, 陰影 m, 圓角 22px) */
  const [isNewWorkflowModalOpen, setIsNewWorkflowModalOpen] = useState(false);
  const [newWorkflowName, setNewWorkflowName] = useState("未命名工作流程");

  /* 新增 API 憑證彈窗狀態 (使用元件庫 Input, 陰影 m, 圓角 22px) */
  const [isNewCredentialModalOpen, setIsNewCredentialModalOpen] = useState(false);
  const [newCredentialName, setNewCredentialName] = useState("");
  const [credentialsList, setCredentialsList] = useState(CREDENTIAL_ITEMS);

  const handleConfirmCreateCredential = () => {
    const trimmed = newCredentialName.trim();
    if (!trimmed) return;

    const newCredItem = {
      id: `cred-${Date.now().toString(36)}`,
      name: trimmed,
      account: trimmed.startsWith("sk-")
        ? `${trimmed.slice(0, 7)}...${trimmed.slice(-4)}`
        : "自訂金鑰已授權",
      status: "connected",
      statusText: "已連線",
      model: "自訂 API 服務",
    };
    setCredentialsList((prev) => [newCredItem, ...prev]);
    setIsNewCredentialModalOpen(false);
    setNewCredentialName("");
  };

  // ESC 鍵關閉彈窗
  useEffect(() => {
    if (!isShareModalOpen && !isNewWorkflowModalOpen && !isNewCredentialModalOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsShareModalOpen(false);
        setIsNewWorkflowModalOpen(false);
        setIsNewCredentialModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isShareModalOpen, isNewWorkflowModalOpen, isNewCredentialModalOpen]);

  const handleCopyLink = () => {
    const shareUrl = `${window.location.origin || "https://studio.workflow.io"}/share/flow/${encodeURIComponent(title.toLowerCase().replace(/\s+/g, "-"))}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      });
    } else {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleSendInvite = () => {
    if (!inviteEmail.trim() || !inviteEmail.includes("@")) return;
    setCollaborators((prev) => [
      ...prev,
      {
        email: inviteEmail.trim(),
        name: inviteEmail.trim().split("@")[0],
        role: invitePermission === "edit" ? "可編輯" : "僅可檢視",
        permission: invitePermission,
      },
    ]);
    setInviteEmail("");
  };

  const handleConfirmCreateWorkflow = () => {
    const trimmed = newWorkflowName.trim();
    if (!trimmed) return;

    // 將新流程新增至抽屜工作流程清單最上方
    const newWfItem = {
      id: `wf-${Date.now().toString(36)}`,
      title: trimmed,
      status: "running",
      statusText: "編輯中",
      updatedAt: "剛剛",
      runsCount: "0 次執行",
      category: "自訂流程",
    };
    setWorkflowList((prev) => [newWfItem, ...prev]);

    // 立即關閉新增工作流程彈窗與側邊系統導覽抽屜
    setIsNewWorkflowModalOpen(false);
    setIsMenuDrawerOpen(false);
    setNewWorkflowName("未命名工作流程");

    // 觸發建立工作流程並重設畫布與鏡頭鎖定在 Trigger 節點
    if (onCreateWorkflow) {
      onCreateWorkflow(trimmed);
    } else {
      onTitleChange?.(trimmed);
    }
  };

  /* 雙擊編輯標題狀態 */
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editingTitleText, setEditingTitleText] = useState(title);
  const previousTitleRef = useRef(title);
  const isTitleCommittedRef = useRef(false);
  const titleInputRef = useRef(null);

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [isEditingTitle]);

  const handleStartEditTitle = () => {
    previousTitleRef.current = title;
    setEditingTitleText(title);
    isTitleCommittedRef.current = false;
    setIsEditingTitle(true);
  };

  const handleTitleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      isTitleCommittedRef.current = true;
      const trimmed = editingTitleText.trim();
      const nextTitle = trimmed === "" ? "未命名" : trimmed;
      setIsEditingTitle(false);
      onTitleChange?.(nextTitle);
    } else if (e.key === "Escape") {
      e.preventDefault();
      isTitleCommittedRef.current = true;
      setEditingTitleText(previousTitleRef.current);
      setIsEditingTitle(false);
    }
  };

  const handleTitleBlur = () => {
    if (isTitleCommittedRef.current) return;

    const trimmed = editingTitleText.trim();
    if (trimmed === "") {
      // 點擊旁邊空白處：回覆為刪除前內容
      setEditingTitleText(previousTitleRef.current);
      setIsEditingTitle(false);
    } else {
      // 點擊其他地方存檔非空內容
      setIsEditingTitle(false);
      onTitleChange?.(trimmed);
    }
  };

  const isControlledMode = propMode !== undefined;
  const [internalMode, setInternalMode] = useState(defaultMode);
  const mode = isControlledMode ? propMode : internalMode;

  /* 編輯 / 執行紀錄 模式切換果凍滑動效果 */
  const modeGroupRef = useRef(null);
  const editBtnRef = useRef(null);
  const historyBtnRef = useRef(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, ready: false });
  const isModeMountedRef = useRef(false);

  useEffect(() => {
    const updateIndicator = () => {
      const activeEl = mode === "edit" ? editBtnRef.current : historyBtnRef.current;
      const container = modeGroupRef.current;
      if (!activeEl || !container) return;

      const containerRect = container.getBoundingClientRect();
      const activeRect = activeEl.getBoundingClientRect();
      const containerBorderLeft = container.clientLeft || 0;

      const left = activeRect.left - containerRect.left - containerBorderLeft;
      const width = activeRect.width;

      setIndicatorStyle({ left, width, ready: true });
    };

    updateIndicator();

    const container = modeGroupRef.current;
    let ro;
    if (container && typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(updateIndicator);
      ro.observe(container);
    }

    if (document.fonts?.ready) {
      document.fonts.ready.then(updateIndicator);
    }

    window.addEventListener("resize", updateIndicator);

    const timer = setTimeout(() => {
      isModeMountedRef.current = true;
    }, 60);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateIndicator);
      ro?.disconnect();
    };
  }, [mode]);
  const isControlledTool = propTool !== undefined;
  const [internalTool, setInternalTool] = useState("pointer");
  const tool = isControlledTool ? propTool : internalTool;
  const isControlledSidebarTab = propSidebarTab !== undefined;
  const [internalSidebarTab, setInternalSidebarTab] = useState("data");
  const sidebarTab = isControlledSidebarTab ? propSidebarTab : internalSidebarTab;

  useEffect(() => {
    if (propSidebarTab !== undefined) {
      setInternalSidebarTab(propSidebarTab);
    }
  }, [propSidebarTab]);

  const [internalSelectedTool, setInternalSelectedTool] = useState(null);
  const selectedTool =
    propSelectedTool !== undefined ? propSelectedTool : internalSelectedTool;

  const isControlledZoom = propZoom !== undefined;
  const [internalZoom, setInternalZoom] = useState(
    Math.min(200, Math.max(20, defaultZoom)),
  );
  const zoom = isControlledZoom ? propZoom : internalZoom;

  function chooseMode(next) {
    if (next === mode) return;
    if (!isControlledMode) {
      setInternalMode(next);
    }
    onModeChange?.(next);
  }

  function chooseTool(next) {
    if (next === tool) return;
    if (!isControlledTool) {
      setInternalTool(next);
    }
    onToolChange?.(next);
  }

  const getToolBtnClass = (isSelected) =>
    cx(
      "!h-[36px] !w-[36px] !border-0",
      "![box-shadow:none] hover:![box-shadow:none] active:![box-shadow:none] focus:![box-shadow:none] focus-visible:![box-shadow:none]",
      "enabled:hover:![box-shadow:none] enabled:active:![box-shadow:none]",
      "focus:!outline-none focus:!ring-0 focus-visible:!ring-0 focus-visible:!ring-offset-0",
      "!transition-colors duration-150",
      isSelected
        ? "!bg-primary !text-white hover:!bg-primary hover:!bg-none"
        : "!bg-transparent !text-primary !bg-none hover:!bg-primary/10 hover:!bg-none active:!bg-primary/30 enabled:hover:!bg-primary/10 enabled:hover:!bg-none enabled:active:!bg-primary/30",
    );

  function chooseSidebar(next) {
    if (next === sidebarTab) return;
    if (!isControlledSidebarTab) {
      setInternalSidebarTab(next);
    }
    onSidebarTabChange?.(next);
  }

  function chooseZoom(next) {
    const bounded = Math.min(200, Math.max(20, next));
    if (bounded === zoom) return;
    if (!isControlledZoom) {
      setInternalZoom(bounded);
    }
    onZoomChange?.(bounded);
  }

  function pickTool(item) {
    if (propSelectedTool === undefined) {
      setInternalSelectedTool(item.id);
    }
    onToolSelect?.(item);
  }

  function handleTabKey(event, index) {
    const last = SIDEBAR_TABS.length - 1;
    let next;

    if (event.key === "ArrowRight") {
      next = (index + 1) % SIDEBAR_TABS.length;
    } else if (event.key === "ArrowLeft") {
      next = (index + last) % SIDEBAR_TABS.length;
    } else if (event.key === "Home") {
      next = 0;
    } else if (event.key === "End") {
      next = last;
    } else {
      return;
    }

    event.preventDefault();
    chooseSidebar(SIDEBAR_TABS[next].value);
    tabRefs.current[next]?.focus();
  }

  return (
    <div
      data-component="WorkflowLayout"
      className="fixed inset-0 flex flex-col gap-16 overflow-hidden bg-bg p-16 text-left font-primary text-fontcolor"
    >
      {/* 頂部導航列 */}
      <header className="flex shrink-0 items-center gap-16">
        <nav
          data-component="Navbar"
          aria-label="工作流程導覽"
          className="flex min-w-0 flex-1 items-center gap-8 rounded-full bg-white p-4 border border-stroke shadow-none"
        >
          <Btn
            variant="ghost"
            iconOnly
            icon={<LayoutIcon name="menu" />}
            aria-label="開啟選單"
            onClick={() => {
              setIsMenuDrawerOpen(true);
              onAction?.("menu");
            }}
          />

          {isEditingTitle ? (
            <input
              ref={titleInputRef}
              type="text"
              value={editingTitleText}
              onChange={(e) => setEditingTitleText(e.target.value)}
              onKeyDown={handleTitleKeyDown}
              onBlur={handleTitleBlur}
              aria-label="編輯工作流程標題"
              className="m-0 rounded-lg border border-primary bg-white px-[2px] py-2 font-primary text-[18px] font-medium tracking-[1px] text-fontcolor outline-none ring-2 ring-primary/20 shadow-inner-s transition-all min-w-[200px] max-w-[500px]"
            />
          ) : (
            <h1
              onDoubleClick={handleStartEditTitle}
              title="雙擊以編輯標題"
              className="m-0 truncate font-primary text-[18px] font-medium tracking-[1px] text-fontcolor cursor-pointer select-none rounded-lg px-[2px] py-2 hover:bg-bg/60 transition-colors"
            >
              {title}
            </h1>
          )}
        </nav>

        {/* 右上操作：操作教學與分享 */}
        <nav
          data-component="NavbarActions"
          aria-label="工作流程操作"
          className="flex shrink-0 items-center gap-4 rounded-full bg-white p-4 border border-stroke shadow-none"
        >
          <Btn
            variant="ghost"
            iconOnly
            icon={<LayoutIcon name="help" />}
            aria-label="操作教學"
            title="操作教學導覽"
            onClick={() => onAction?.("tutorial")}
          />
          <Btn
            variant="ghost"
            iconOnly
            icon={<LayoutIcon name="share" />}
            aria-label="分享"
            title="分享工作流程"
            onClick={() => {
              setIsShareModalOpen(true);
              onAction?.("share");
            }}
          />
        </nav>
      </header>

      {/* 主內容區：畫布與右側抽屜 */}
      <div className="flex min-h-0 flex-1 gap-16">
        {/* 左側主要工作畫布卡片 */}
        <main
          data-component="Card"
          aria-label="工作區"
          className={cx(
            "flex min-h-0 min-w-0 flex-1 flex-col rounded-4xl bg-white p-16 border border-stroke shadow-drop-s transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]",
            mode === "history" ? "gap-16" : "gap-8",
          )}
        >
          <div className="flex shrink-0 items-center justify-between gap-8">
            {/* 編輯 / 執行紀錄模式切換 */}
            <div
              ref={modeGroupRef}
              data-component="ModeToggleGroup"
              role="group"
              aria-label="工作區模式"
              className="relative inline-flex h-[36px] items-center gap-4 rounded-full bg-primary p-2 border border-primary shadow-drop-s overflow-hidden"
            >
              {/* 果凍滑動指示塊 */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute top-[2px] bottom-[2px] left-0 rounded-full bg-white shadow-inner-s will-change-transform"
                style={{
                  transform: `translateX(${indicatorStyle.left}px)`,
                  width: `${indicatorStyle.width}px`,
                  opacity: indicatorStyle.ready ? 1 : 0,
                  transition: isModeMountedRef.current
                    ? "transform 360ms cubic-bezier(0.34, 1.56, 0.64, 1), width 360ms cubic-bezier(0.34, 1.56, 0.64, 1)"
                    : "opacity 150ms ease",
                }}
              />

              <ToggleBtn
                ref={editBtnRef}
                variant="ghost"
                selected={mode === "edit"}
                onSelectedChange={(next) =>
                  next && chooseMode("edit")
                }
                icon={<LayoutIcon name="pen" />}
                className={cx(
                  "!h-full relative z-10 !border-0 ![box-shadow:none]",
                  "enabled:hover:![box-shadow:none] enabled:active:![box-shadow:none]",
                  "focus-visible:!ring-inset",
                  "!transition-colors duration-200",
                  mode === "edit"
                    ? "!bg-transparent !text-primary font-medium"
                    : "!bg-transparent !text-white enabled:hover:!bg-white/15 enabled:hover:!text-white enabled:active:!bg-white/25 font-normal",
                )}
              >
                編輯
              </ToggleBtn>

              <ToggleBtn
                ref={historyBtnRef}
                variant="ghost"
                selected={mode === "history"}
                onSelectedChange={(next) =>
                  next && chooseMode("history")
                }
                icon={<LayoutIcon name="layers" />}
                className={cx(
                  "!h-full relative z-10 !border-0 ![box-shadow:none]",
                  "enabled:hover:![box-shadow:none] enabled:active:![box-shadow:none]",
                  "focus-visible:!ring-inset",
                  "!transition-colors duration-200",
                  mode === "history"
                    ? "!bg-transparent !text-primary font-medium"
                    : "!bg-transparent !text-white enabled:hover:!bg-white/15 enabled:hover:!text-white enabled:active:!bg-white/25 font-normal",
                )}
              >
                執行紀錄
              </ToggleBtn>
            </div>

            {/* 編輯模式展示測試工作流程按鈕，執行紀錄模式展示匯出紀錄按鈕 */}
            {mode === "edit" ? (
              <Btn
                variant="outline"
                showLeftIcon
                leftIcon={<LayoutIcon name="play" />}
                onClick={() => onAction?.("test-workflow")}
              >
                測試工作流程
              </Btn>
            ) : (
              <Btn
                variant="outline"
                intent="secondary"
                showLeftIcon
                leftIcon={<LayoutIcon name="export" />}
                onClick={() => {
                  onAction?.("export-history");
                  alert("已成功匯出執行紀錄 CSV 檔案！");
                }}
                className="!h-[34px] !rounded-full !px-14 text-caption-1 text-fontcolor border-stroke hover:bg-bg/40 transition-all cursor-pointer font-medium"
              >
                匯出
              </Btn>
            )}
          </div>

          {/* 核心畫布插槽 */}
          <section
            data-component="Canvas"
            aria-label={mode === "edit" ? "流程畫布" : "執行紀錄"}
            className={cx(
              "relative min-h-0 flex-1 overflow-hidden",
              mode === "edit" ? "rounded-2xl bg-[#F8FAFC]" : "bg-transparent",
            )}
          >
            <div className="absolute inset-0">
              {typeof children === "function"
                ? children({ mode, tool, zoom })
                : children}
            </div>

            {/* 下方懸浮工具列 (僅在編輯模式下展示) */}
            {mode === "edit" && (
              <div
                data-component="ToolBar"
                role="toolbar"
                aria-label="畫布工具"
                className="absolute bottom-16 left-1/2 z-10 inline-flex -translate-x-1/2 items-center gap-8 rounded-full border border-stroke bg-white p-4 shadow-drop-s animate-in fade-in duration-200"
              >
                <Btn
                  variant="ghost"
                  iconOnly
                  disabled={!canUndo}
                  icon={<LayoutIcon name="left" />}
                  aria-label="上一步"
                  onClick={() => onAction?.("undo")}
                  className="![box-shadow:none] hover:![box-shadow:none] active:![box-shadow:none] enabled:hover:![box-shadow:none] enabled:active:![box-shadow:none] !transition-colors duration-150"
                />

                <Btn
                  variant="ghost"
                  iconOnly
                  disabled={!canRedo}
                  icon={<LayoutIcon name="right" />}
                  aria-label="下一步"
                  onClick={() => onAction?.("redo")}
                  className="![box-shadow:none] hover:![box-shadow:none] active:![box-shadow:none] enabled:hover:![box-shadow:none] enabled:active:![box-shadow:none] !transition-colors duration-150"
                />

                <div
                  role="separator"
                  aria-orientation="vertical"
                  className="h-20 border-l border-stroke"
                />

                <ToggleBtn
                  variant="filled"
                  showText={false}
                  selected={tool === "pointer"}
                  icon={<LayoutIcon name="pointer" />}
                  aria-label="選取模式"
                  onSelectedChange={(next) =>
                    next && chooseTool("pointer")
                  }
                  className={getToolBtnClass(tool === "pointer")}
                />

                <ToggleBtn
                  variant="filled"
                  showText={false}
                  selected={tool === "comment"}
                  icon={<LayoutIcon name="comment" />}
                  aria-label="留言模式"
                  onSelectedChange={(next) =>
                    next && chooseTool("comment")
                  }
                  className={getToolBtnClass(tool === "comment")}
                />
              </div>
            )}

            {/* 右下縮放控制 (僅在編輯模式下展示) */}
            {mode === "edit" && (
              <div
                data-component="ZoomControls"
                role="group"
                aria-label="畫布縮放"
                className="absolute bottom-16 right-16 z-10 flex items-center gap-4 rounded-full bg-white p-4 shadow-drop-s border border-stroke animate-in fade-in duration-200"
              >
                <Btn
                  variant="ghost"
                  iconOnly
                  disabled={zoom <= 20}
                  icon={<LayoutIcon name="zoomOut" />}
                  aria-label="縮小"
                  onClick={() => chooseZoom(zoom - 10)}
                />

                <output
                  aria-label="縮放比例"
                  className="font-primary text-label-2 text-fontcolor px-4 font-medium"
                >
                  {zoom}%
                </output>

                <Btn
                  variant="ghost"
                  iconOnly
                  disabled={zoom >= 200}
                  icon={<LayoutIcon name="zoomIn" />}
                  aria-label="放大"
                  onClick={() => chooseZoom(zoom + 10)}
                />
              </div>
            )}
          </section>
        </main>

        {/* 右側側欄卡片：單一獨立圓角卡片 Shell，在編輯模式 (280px) 與執行紀錄詳情模式 (380px/410px) 之間平滑變寬/縮小 */}
        <aside
          data-component="RightSidebarCard"
          aria-label={mode === "edit" ? "工具面板" : "紀錄詳情"}
          className={cx(
            "h-full shrink-0 relative flex flex-col rounded-4xl bg-white border border-stroke shadow-drop-s overflow-hidden",
            "transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]",
            mode === "edit"
              ? "w-[280px] opacity-100 translate-x-0"
              : historySidebar
              ? "w-[380px] xl:w-[410px] opacity-100 translate-x-0"
              : "w-0 opacity-0 translate-x-[20px] pointer-events-none -mr-16 border-0 shadow-none",
          )}
        >
          {/* 1. 編輯模式工具抽屜內容 */}
          <div
            aria-hidden={mode !== "edit"}
            className={cx(
              "absolute inset-y-0 right-0 w-[280px] h-full transition-all duration-400 ease-[cubic-bezier(0.25,1,0.5,1)]",
              mode === "edit"
                ? "opacity-100 translate-x-0 pointer-events-auto"
                : "opacity-0 -translate-x-6 pointer-events-none",
            )}
          >
            <DrawerComp
              aria-label="工具面板"
              className="w-full h-full shrink-0 !border-0 !shadow-none !rounded-none !bg-transparent"
            >
              {/* Tab 切換標籤：文字＋icon，平均分佈 */}
              <div
                data-component="SidebarTabs"
                role="tablist"
                aria-label="工具分類"
                aria-orientation="horizontal"
                className="grid grid-cols-3 gap-[4px] h-[36px] shrink-0 w-full"
              >
                {SIDEBAR_TABS.map((tab, index) => {
                  const isSelected = sidebarTab === tab.value;
                  return (
                    <TabComp
                      key={tab.value}
                      ref={(node) => {
                        tabRefs.current[index] = node;
                      }}
                      id={`${id}-tab-${tab.value}`}
                      panelId={`${id}-panel-${tab.value}`}
                      selected={isSelected}
                      tabIndex={isSelected ? 0 : -1}
                      showLeftIcon
                      leftIcon={<LayoutIcon name={tab.icon} />}
                      showText
                      className="w-full !flex-1 !h-[36px]"
                      title={tab.label}
                      aria-label={tab.label}
                      onSelect={() => chooseSidebar(tab.value)}
                      onKeyDown={(event) => handleTabKey(event, index)}
                    >
                      {tab.label}
                    </TabComp>
                  );
                })}
              </div>

              {/* Tab 內容區域 */}
              {SIDEBAR_TABS.map((tab) => (
                <div
                  key={tab.value}
                  id={`${id}-panel-${tab.value}`}
                  role="tabpanel"
                  aria-labelledby={`${id}-tab-${tab.value}`}
                  hidden={sidebarTab !== tab.value}
                  tabIndex={0}
                  className={cx(
                    "min-h-0 flex-1 overflow-y-auto rounded-md p-2 pr-4",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-stroke",
                    sidebarTab !== tab.value && "hidden",
                  )}
                >
                  {sidebarPanels[tab.value] ?? (
                    <div className="flex flex-col gap-16">
                      {(SIDEBAR_CONTENT[tab.value] || []).map((group) => (
                        <ToolSection
                          key={group.title}
                          group={group}
                          ItemComponent={ListItemComp}
                          selectedTool={selectedTool}
                          onPick={pickTool}
                          onDragStart={onToolDragStart}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </DrawerComp>
          </div>

          {/* 2. 執行紀錄模式詳情面板內容 */}
          <div
            aria-hidden={mode !== "history" || !historySidebar}
            className={cx(
              "absolute inset-y-0 right-0 w-[380px] xl:w-[410px] h-full transition-all duration-400 ease-[cubic-bezier(0.25,1,0.5,1)]",
              mode === "history" && historySidebar
                ? "opacity-100 translate-x-0 pointer-events-auto"
                : "opacity-0 translate-x-6 pointer-events-none",
            )}
          >
            {historySidebar}
          </div>
        </aside>
      </div>

      {/* 左側系統導覽抽屜 (從左側滑入，圓角 22px，半透明遮罩) */}
      <DrawerComp
        variant="overlay"
        placement="left"
        isOpen={isMenuDrawerOpen}
        onClose={() => setIsMenuDrawerOpen(false)}
        showClose
        showDivider
        className="w-[380px] max-w-[calc(100vw-32px)] overflow-hidden flex flex-col left-[16px]"
        header={
          <div className="flex items-center">
            <span className="font-primary text-[17px] font-semibold text-fontcolor leading-[22px]">
              Workflow Studio
            </span>
          </div>
        }
        footer={
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-primary/20 text-primary font-semibold text-[13px]">
                J
              </div>
              <div className="flex flex-col text-left gap-4">
                <span className="text-[13px] font-medium leading-none text-fontcolor">Jacqueline</span>
                <span className="text-[11px] leading-none text-description">Enterprise 企業方案</span>
              </div>
            </div>
            <Btn
              variant="ghost"
              iconOnly
              icon={<LayoutIcon name="setting" />}
              aria-label="系統偏好設定"
              title="系統偏好設定"
              className="!h-[32px] !w-[32px]"
            />
          </div>
        }
      >
        {/* 抽屜分類分頁 (套用專案 Tab 元件，等分兩欄，高度 36px) */}
        <div
          data-component="DrawerTabs"
          role="tablist"
          aria-label="抽屜分類"
          className="grid grid-cols-2 gap-[4px] h-[36px] shrink-0 w-full"
        >
          {[
            { value: "workflows", label: "工作流程", icon: "layers" },
            { value: "credentials", label: "服務憑證", icon: "api" },
          ].map((tab) => (
            <TabComp
              key={tab.value}
              selected={menuDrawerTab === tab.value}
              showLeftIcon
              leftIcon={<LayoutIcon name={tab.icon} />}
              showText
              className="w-full !flex-1 !h-[36px]"
              title={tab.label}
              aria-label={tab.label}
              onSelect={() => setMenuDrawerTab(tab.value)}
            >
              {tab.label}
            </TabComp>
          ))}
        </div>

        {/* 抽屜分頁內容容器：工作流程與服務憑證雙向絲滑平移 (Tab Slide Carousel) */}
        <div className="relative flex-1 min-h-0 w-full overflow-hidden">
          <div
            data-tab={menuDrawerTab}
            className={cx(
              "drawer-tab-track flex flex-row h-full w-[200%] transition-transform duration-[380ms] ease-[cubic-bezier(0.25,1,0.5,1)] will-change-transform",
              menuDrawerTab === "credentials" ? "-translate-x-1/2" : "translate-x-0",
            )}
          >
            {/* Tab 1: 工作流程清單 (佔 50% 軌道寬度 = 抽屜 100% 寬) */}
            <div
              className={cx(
                "relative flex h-full w-1/2 min-h-0 shrink-0 flex-col gap-12",
                menuDrawerTab !== "workflows" && "pointer-events-none select-none",
              )}
              aria-hidden={menuDrawerTab !== "workflows"}
              inert={menuDrawerTab !== "workflows" ? "" : undefined}
            >
              <div className="shrink-0 px-2">
                <InputComp
                  placeholder="搜尋工作流程..."
                  value={searchWorkflowQuery}
                  onChange={(e) => setSearchWorkflowQuery(e.target.value)}
                  prefixIcon={<LayoutIcon name="search" />}
                  className="w-full"
                />
              </div>

              {/* 修正邊框裁切問題：加入 px-4 py-2 預留邊界空間，避免 ring/border 貼齊邊緣被 overflow 切割 */}
              <div className="flex min-h-0 flex-1 flex-col gap-8 overflow-y-auto px-4 py-2 custom-scrollbar pb-60">
                <div className="text-caption-1 font-medium text-description px-2 text-left">
                  最近開啟
                </div>
                <ul className="m-0 flex list-none flex-col gap-8 p-0">
                  {filteredWorkflows.length === 0 ? (
                    <CardComp
                      as="li"
                      variant="subtle"
                      className="rounded-[22px] rounded-4xl border border-stroke p-16 text-center text-caption-1 text-description"
                    >
                      查無符合的工作流程
                    </CardComp>
                  ) : (
                    filteredWorkflows.map((item) => {
                      const isActive = item.title === title;
                      return (
                        <CardComp
                          key={item.id}
                          as="li"
                          role="button"
                          tabIndex={0}
                          variant={isActive ? "default" : "flat"}
                          className={cx(
                            "rounded-[22px] rounded-4xl border p-2 transition-all duration-200 cursor-pointer",
                            "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                            isActive
                              ? "border-primary bg-white shadow-drop-s ring-1 ring-inset ring-primary/25"
                              : "border-stroke bg-white hover:border-primary/40 hover:shadow-drop-s",
                          )}
                          onClick={() => {
                            onTitleChange?.(item.title);
                            onSelectWorkflow?.(item);
                            setIsMenuDrawerOpen(false);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              onTitleChange?.(item.title);
                              onSelectWorkflow?.(item);
                              setIsMenuDrawerOpen(false);
                            }
                          }}
                        >
                          <ListItemComp
                            as="div"
                            selected={isActive}
                            showLeftIcon
                            leftIcon={
                              <span
                                className={cx(
                                  "inline-block h-[8px] w-[8px] rounded-full",
                                  item.status === "running" ? "bg-emerald-500" : "bg-slate-400",
                                )}
                              />
                            }
                            showDescription
                            description={`${item.category} · ${item.runsCount} · ${item.updatedAt}`}
                            showSuffix
                            suffix={
                              <span
                                className={cx(
                                  "rounded-full px-8 py-2 text-caption-2 font-medium leading-none",
                                  isActive
                                    ? "bg-primary text-white"
                                    : item.status === "running"
                                      ? "bg-emerald-50 text-emerald-600"
                                      : "bg-slate-100 text-slate-500",
                                )}
                              >
                                {isActive ? "目前編輯" : item.statusText}
                              </span>
                            }
                            className="!bg-transparent hover:!bg-transparent active:!bg-transparent !px-8 !py-[6px] w-full pointer-events-none"
                          >
                            <span className="text-[13.5px] leading-[18px]">{item.title}</span>
                          </ListItemComp>
                        </CardComp>
                      );
                    })
                  )}
                </ul>
              </div>

              {/* 右下角懸浮新增按鈕 (FloatButton, Hover 向左展開) -> 點擊開啟自訂 Popup */}
              <div className="absolute bottom-16 right-16 z-20 pointer-events-auto">
                <FloatButtonComp
                  variant="primary"
                  shape="circle"
                  text="流程"
                  icon={<LayoutIcon name="plus" className="!h-18 !w-18" />}
                  aria-label="新增流程"
                  title="新增流程"
                  onClick={() => {
                    setNewWorkflowName("未命名工作流程");
                    setIsNewWorkflowModalOpen(true);
                  }}
                />
              </div>
            </div>

            {/* Tab 2: 服務連線憑證 (佔 50% 軌道寬度 = 抽屜 100% 寬) */}
            <div
              className={cx(
                "relative flex h-full w-1/2 min-h-0 shrink-0 flex-col gap-12",
                menuDrawerTab !== "credentials" && "pointer-events-none select-none",
              )}
              aria-hidden={menuDrawerTab !== "credentials"}
              inert={menuDrawerTab !== "credentials" ? "" : undefined}
            >
              <div className="shrink-0 px-2">
                <CardComp
                  variant="subtle"
                  className="rounded-[22px] rounded-4xl border border-stroke bg-bg/50 p-12 text-body-4 text-description leading-relaxed text-left shrink-0"
                >
                  節點共用之第三方授權憑證與 API 金鑰，集中管理可直接於畫布節點中引用。
                </CardComp>
              </div>

              {/* 修正邊框裁切問題：加入 px-4 py-2 預留邊界空間 */}
              <div className="flex min-h-0 flex-1 flex-col gap-8 overflow-y-auto px-4 py-2 custom-scrollbar pb-60">
                <ul className="m-0 flex list-none flex-col gap-8 p-0">
                  {credentialsList.map((cred) => (
                    <CardComp
                      key={cred.id}
                      as="li"
                      role="button"
                      tabIndex={0}
                      variant="flat"
                      className={cx(
                        "rounded-[22px] rounded-4xl border border-stroke bg-white p-2 transition-all duration-200 cursor-pointer",
                        "hover:border-primary/40 hover:shadow-drop-s",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                      )}
                      onClick={() => alert(`查看 ${cred.name} 憑證配置`)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          alert(`查看 ${cred.name} 憑證配置`);
                        }
                      }}
                    >
                      <ListItemComp
                        as="div"
                        showLeftIcon
                        leftIcon={
                          <span
                            className={cx(
                              "inline-block h-[8px] w-[8px] rounded-full",
                              cred.status === "connected" ? "bg-emerald-500" : "bg-amber-500",
                            )}
                          />
                        }
                        showDescription
                        description={`${cred.model} (${cred.account})`}
                        showSuffix
                        suffix={
                          <span
                            className={cx(
                              "rounded-full px-8 py-2 text-caption-2 font-medium leading-none",
                              cred.status === "connected"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-amber-50 text-amber-700",
                            )}
                          >
                            {cred.statusText}
                          </span>
                        }
                        className="!bg-transparent hover:!bg-transparent active:!bg-transparent !px-8 !py-[6px] w-full pointer-events-none"
                      >
                        <span className="text-[13.5px] leading-[18px]">{cred.name}</span>
                      </ListItemComp>
                    </CardComp>
                  ))}
                </ul>
              </div>

              {/* 右下角懸浮新增按鈕 (FloatButton, Hover 向左展開) */}
              <div className="absolute bottom-16 right-16 z-20 pointer-events-auto">
                <FloatButtonComp
                  variant="primary"
                  shape="circle"
                  text="憑證"
                  icon={<LayoutIcon name="plus" className="!h-18 !w-18" />}
                  aria-label="新增憑證"
                  title="新增憑證"
                  onClick={() => {
                    setNewCredentialName("");
                    setIsNewCredentialModalOpen(true);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </DrawerComp>

      {/* ============================================================ */}
      {/* 新增工作流程彈窗 (New Workflow Modal) */}
      {/* 規範：圓角 22px (rounded-[22px] / rounded-4xl)，陰影 m (shadow-drop-m)，採用元件庫 Input */}
      {/* ============================================================ */}
      {isNewWorkflowModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="new-workflow-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-16 backdrop-blur-[2px] animate-in fade-in duration-150"
          onClick={() => setIsNewWorkflowModalOpen(false)}
        >
          <div
            className="w-full max-w-[400px] rounded-[22px] rounded-4xl bg-white p-20 shadow-drop-m border border-stroke text-left font-primary animate-in zoom-in-95 duration-150 flex flex-col gap-16 select-none"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 標題與關閉按鈕 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-8">
                <div className="flex h-32 w-32 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <LayoutIcon name="layers" className="!h-18 !w-18" />
                </div>
                <h3 id="new-workflow-dialog-title" className="m-0 text-label-1 font-semibold text-fontcolor">
                  新增工作流程
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNewWorkflowModalOpen(false)}
                aria-label="關閉對話框"
                className="flex h-[36px] w-[36px] min-h-[36px] min-w-[36px] items-center justify-center rounded-full text-description hover:bg-bg hover:text-fontcolor transition-colors cursor-pointer shrink-0"
              >
                <LayoutIcon name="close" className="!h-16 !w-16" />
              </button>
            </div>

            <p className="m-0 text-caption-1 text-description leading-relaxed">
              為您的新自動化工作流程設定名稱，建立完成後可立即於畫布中進行節點配置與串聯。
            </p>

            {/* 輸入框 (使用專案元件庫 InputComp) */}
            <div className="flex flex-col gap-6">
              <label className="text-caption-1 font-medium text-fontcolor">工作流程名稱</label>
              <InputComp
                placeholder="例如：每日營運日報自動生成..."
                value={newWorkflowName}
                onChange={(e) => setNewWorkflowName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleConfirmCreateWorkflow();
                }}
                prefixIcon={<LayoutIcon name="pen" />}
                autoFocus
                className="w-full"
              />
            </div>

            {/* 底部操作按鈕 */}
            <div className="flex items-center justify-end gap-8 pt-8 border-t border-stroke/60">
              <Btn
                variant="ghost"
                onClick={() => setIsNewWorkflowModalOpen(false)}
                className="!h-[36px] !px-16 text-description hover:text-fontcolor"
              >
                取消
              </Btn>
              <Btn
                variant="filled"
                intent="primary"
                disabled={!newWorkflowName.trim()}
                onClick={handleConfirmCreateWorkflow}
                className="!h-[36px] !px-20 font-medium"
              >
                建立工作流程
              </Btn>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 新增 API 憑證彈窗 (New API Credential Modal) */}
      {/* 規範：圓角 22px (rounded-[22px] / rounded-4xl)，陰影 m (shadow-drop-m)，採用元件庫 Input */}
      {/* ============================================================ */}
      {isNewCredentialModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="new-credential-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-16 backdrop-blur-[2px] animate-in fade-in duration-150"
          onClick={() => setIsNewCredentialModalOpen(false)}
        >
          <div
            className="w-full max-w-[400px] rounded-[22px] rounded-4xl bg-white p-20 shadow-drop-m border border-stroke text-left font-primary animate-in zoom-in-95 duration-150 flex flex-col gap-16 select-none"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 標題與關閉按鈕 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-8">
                <div className="flex h-32 w-32 items-center justify-center rounded-full bg-primary/15 text-primary shrink-0">
                  <LayoutIcon name="api" className="!h-18 !w-18" />
                </div>
                <h3 id="new-credential-dialog-title" className="m-0 text-label-1 font-semibold text-fontcolor">
                  新增 API 憑證
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNewCredentialModalOpen(false)}
                aria-label="關閉對話框"
                className="flex h-[36px] w-[36px] min-h-[36px] min-w-[36px] items-center justify-center rounded-full text-description hover:bg-bg hover:text-fontcolor transition-colors cursor-pointer shrink-0"
              >
                <LayoutIcon name="close" className="!h-16 !w-16" />
              </button>
            </div>

            <p className="m-0 text-caption-1 text-description leading-relaxed">
              輸入您的 API 金鑰或服務名稱，建立連線憑證以供工作流程節點直接調用。
            </p>

            {/* 輸入框 (使用專案元件庫 InputComp) */}
            <div className="flex flex-col gap-6">
              <label className="text-caption-1 font-medium text-fontcolor">API 金鑰或服務名稱</label>
              <InputComp
                placeholder="例如：OpenAI API Key (sk-proj-...) 或 服務名稱..."
                value={newCredentialName}
                onChange={(e) => setNewCredentialName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleConfirmCreateCredential();
                }}
                prefixIcon={<LayoutIcon name="api" />}
                autoFocus
                className="w-full"
              />
            </div>

            {/* 底部操作按鈕 */}
            <div className="flex items-center justify-end gap-8 pt-8 border-t border-stroke/60">
              <Btn
                variant="ghost"
                onClick={() => setIsNewCredentialModalOpen(false)}
                className="!h-[36px] !px-16 text-description hover:text-fontcolor"
              >
                取消
              </Btn>
              <Btn
                variant="filled"
                intent="primary"
                disabled={!newCredentialName.trim()}
                onClick={handleConfirmCreateCredential}
                className="!h-[36px] !px-20 font-medium"
              >
                建立憑證
              </Btn>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 分享彈窗 (Share Modal) */}
      {/* 規範：圓角 22px (rounded-[22px] / rounded-4xl)，陰影 m (shadow-drop-m) */}
      {/* ============================================================ */}
      {isShareModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="share-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-16 backdrop-blur-[2px] animate-in fade-in duration-150"
          onClick={() => setIsShareModalOpen(false)}
        >
          <div
            className="flex flex-col gap-[8px] w-full max-w-[500px] animate-in zoom-in-95 duration-150 select-none"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 上方主要 Popup 卡片：Email 邀請與成員清單 */}
            <div className="w-full rounded-[22px] rounded-4xl bg-white p-20 shadow-drop-m border border-stroke text-left font-primary flex flex-col gap-16">
              {/* 標頭與關閉按鈕 (關閉按鈕符合 36px*36px 點擊範圍) */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-10">
                  <div className="flex h-36 w-36 items-center justify-center rounded-full bg-primary/15 text-primary shrink-0">
                    <LayoutIcon name="share" className="!h-20 !w-20" />
                  </div>
                  {/* 4. 上方標題跟副標的 gap=4px */}
                  <div className="flex flex-col gap-[4px]">
                    <h3 id="share-dialog-title" className="m-0 text-label-1 font-semibold text-fontcolor">
                      分享工作流程
                    </h3>
                    <span className="text-caption-2 text-description">
                      分享「{title}」給團隊成員進行共同編輯或檢視
                    </span>
                  </div>
                </div>
                {/* 3. 只保留叉叉關閉，符合點擊範圍 36px*36px */}
                <button
                  type="button"
                  onClick={() => setIsShareModalOpen(false)}
                  aria-label="關閉分享視窗"
                  className="flex h-[36px] w-[36px] min-h-[36px] min-w-[36px] items-center justify-center rounded-full text-description hover:bg-bg hover:text-fontcolor transition-colors cursor-pointer shrink-0"
                >
                  <LayoutIcon name="close" className="!h-18 !w-18" />
                </button>
              </div>

              <div className="h-[1px] w-full bg-stroke/60" />

              {/* 1. 透過 Email 邀請的輸入格：權限選擇寬度 hug，移到 email input 前方 */}
              <div className="flex flex-col gap-8">
                <label className="text-caption-1 font-medium text-fontcolor">透過 Email 邀請成員</label>
                <div className="flex items-center gap-8">
                  {/* 1. 寬度窄一些 hug 就好，移到 email input 前方 */}
                  <div className="w-auto shrink-0">
                    <SelectComp
                      value={invitePermission}
                      onChange={(val) => setInvitePermission(val)}
                      options={[
                        { value: "edit", label: "可編輯" },
                        { value: "view", label: "僅可檢視" },
                      ]}
                      containerClassName="w-auto shrink-0"
                      className="!w-auto !min-w-0 !px-10 gap-6"
                    />
                  </div>
                  {/* Email 輸入格 */}
                  <div className="flex-1 min-w-0">
                    <InputComp
                      type="email"
                      placeholder="輸入成員電子郵件 (例如 alex@company.com)..."
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSendInvite();
                      }}
                      prefixIcon={<LayoutIcon name="mail" />}
                      className="w-full"
                    />
                  </div>
                  {/* 邀請按鈕 */}
                  <Btn
                    variant="filled"
                    intent="primary"
                    disabled={!inviteEmail.trim() || !inviteEmail.includes("@")}
                    onClick={handleSendInvite}
                    className="!h-[36px] !px-16 shrink-0"
                  >
                    邀請
                  </Btn>
                </div>

                {/* 2. 下方的使用者：放在同一個區塊，不用分三個獨立的，但在擁有者下方放 divider 區分開來 */}
                <div className="mt-4 rounded-[22px] bg-white border border-stroke p-6 flex flex-col max-h-[200px] overflow-y-auto custom-scrollbar">
                  {collaborators.map((c, idx) => {
                    const isOwner = c.permission === "owner";
                    return (
                      <div key={idx} className="flex flex-col">
                        <div className="flex items-center justify-between px-10 py-8 transition-colors hover:bg-bg/30 rounded-2xl">
                          <div className="flex items-center gap-10 min-w-0">
                            <div className="flex h-32 w-32 items-center justify-center rounded-full bg-primary/15 text-[12px] font-bold text-primary shrink-0">
                              {c.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <div className="flex items-center gap-6">
                                <span className="text-label-3 font-medium text-fontcolor truncate">
                                  {c.name}
                                </span>
                                {isOwner && (
                                  <span className="rounded-full bg-primary/10 px-6 py-1 text-[10px] font-medium text-primary shrink-0">
                                    您
                                  </span>
                                )}
                              </div>
                              <span className="text-caption-2 text-description truncate">
                                {c.email}
                              </span>
                            </div>
                          </div>
                          {isOwner ? (
                            <span className="inline-flex h-[32px] items-center justify-center rounded-full bg-primary/10 px-14 text-label-3 font-medium text-primary shrink-0">
                              擁有者
                            </span>
                          ) : (
                            <div className="w-auto shrink-0">
                              <SelectComp
                                value={c.permission}
                                onChange={(val) => handleUpdateCollaboratorPermission(idx, val)}
                                options={[
                                  { value: "edit", label: "可編輯" },
                                  { value: "view", label: "僅可檢視" },
                                ]}
                                containerClassName="w-auto shrink-0"
                                className="!h-[32px] !min-h-[32px] !max-h-[32px] !w-auto !min-w-0 !px-10 text-[12.5px] gap-4"
                              />
                            </div>
                          )}
                        </div>
                        {isOwner && (
                          <div className="my-4 h-[1px] w-full bg-stroke/60" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 5. 公開分享連結的區塊，獨立拉出來做一個 popup 區塊，放在原本 popup 的下方 gap=8px */}
            <div className="w-full rounded-[22px] rounded-4xl bg-white p-16 shadow-drop-m border border-stroke text-left font-primary flex flex-col gap-12 select-none">
              <label className="text-caption-1 font-medium text-fontcolor">公開分享連結</label>
              <div className="flex items-center gap-8">
                <div className="flex-1">
                  <InputComp
                    readOnly
                    value={`${window.location.origin || "https://studio.workflow.io"}/share/flow/${encodeURIComponent(title.toLowerCase().replace(/\s+/g, "-"))}`}
                    prefixIcon={<LayoutIcon name="link" />}
                    className="w-full !bg-bg/40 font-mono text-[12px]"
                  />
                </div>
                <Btn
                  variant={isCopied ? "filled" : "outline"}
                  intent={isCopied ? "success" : "primary"}
                  onClick={handleCopyLink}
                  className="!h-[36px] !px-16 shrink-0 transition-all"
                >
                  {isCopied ? "已拷貝！" : "拷貝連結"}
                </Btn>
              </div>

              {/* 分享至... */}
              <div className="flex items-center gap-8">
                <span className="text-caption-2 text-description shrink-0">分享至：</span>
                <div className="flex flex-wrap items-center gap-6">
                  {[
                    { name: "Slack", icon: "botchat" },
                    { name: "Teams", icon: "webhook" },
                    { name: "電子郵件", icon: "mail" },
                    { name: "Webhook", icon: "api" },
                  ].map((platform) => (
                    <button
                      key={platform.name}
                      type="button"
                      onClick={() => {
                        handleCopyLink();
                        alert(`已拷貝分享連結，可直接貼上分享至 ${platform.name}！`);
                      }}
                      className="inline-flex h-[28px] items-center gap-4 rounded-full border border-stroke bg-white px-10 text-[11px] text-fontcolor hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-all cursor-pointer"
                    >
                      <LayoutIcon name={platform.icon} className="!h-12 !w-12" />
                      <span>{platform.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}