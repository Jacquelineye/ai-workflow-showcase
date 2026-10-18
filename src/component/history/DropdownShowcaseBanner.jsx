import React, { useState } from "react";
import Button from "../ui/button";
import ListItem from "../ui/listitem";

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

const DEMO_OPTIONS = [
  { id: "all", label: "所有狀態" },
  { id: "running", label: "執行中" },
  { id: "success", label: "成功" },
  { id: "error", label: "失敗" },
];

export default function DropdownShowcaseBanner({
  activeVariant = "outline",
  onSelectVariant,
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  // 整合款 內部模擬狀態
  const [demo1Open, setDemo1Open] = useState(false);
  const [demo1Filter, setDemo1Filter] = useState("all");

  // 原方案 1 內部模擬狀態
  const [demo2Open, setDemo2Open] = useState(false);
  const [demo2Filter, setDemo2Filter] = useState("all");

  // 原方案 2 內部模擬狀態
  const [demo3Open, setDemo3Open] = useState(false);
  const [demo3Filter, setDemo3Filter] = useState("all");

  return (
    <div className="mb-12 shrink-0 rounded-2xl border border-primary/25 bg-gradient-to-b from-white to-[#F8FAFC] p-12 shadow-drop-s transition-all">
      {/* 頂部收合列 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          <span className="flex h-28 w-28 items-center justify-center rounded-xl bg-primary/10 text-primary text-base shadow-xs">
            🎨
          </span>
          <div>
            <div className="flex items-center gap-8">
              <h3 className="m-0 text-body-2 font-bold text-fontcolor">
                「所有狀態」與「觸發方式」下拉按鈕風格體驗
              </h3>
              <span className="rounded-full bg-primary/10 px-8 py-1 text-[11px] font-semibold text-primary">
                已套用整合款
              </span>
            </div>
            <p className="m-0 mt-2 text-caption-2 text-description">
              已套用您指定之「方案一外框 + 方案二 Active」整合款，下方提供與原方案 1、原方案 2 的並排即時切換與互動體驗。
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          className="flex h-[30px] items-center gap-4 rounded-full border border-stroke bg-white px-12 text-caption-1 font-medium text-secondary hover:bg-bg/40 cursor-pointer transition-colors"
        >
          <span>{isExpanded ? "收合展示" : "展開 3 款方案比較"}</span>
          <svg
            className={cx("h-10 w-10 transition-transform duration-200", isExpanded && "rotate-180")}
            viewBox="0 0 12 12"
            fill="none"
          >
            <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* 3 款方案卡片 (並排展示) */}
      {isExpanded && (
        <div className="mt-12 grid grid-cols-3 gap-12 pt-12 border-t border-stroke/40">
          
          {/* ==================== 🌟 整合款：方案一外框 + 方案二 Active ==================== */}
          <div
            className={cx(
              "flex flex-col justify-between rounded-xl border p-12 transition-all bg-white",
              activeVariant === "outline"
                ? "border-primary ring-2 ring-primary/20 shadow-drop-s"
                : "border-stroke/70 hover:border-stroke",
            )}
          >
            <div className="flex flex-col gap-8">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-bold text-fontcolor">🌟 整合款：方案一外框 + 方案二 Active</span>
                <span className="rounded-full bg-primary/10 px-6 py-0.5 text-[10px] font-semibold text-primary">
                  指定首選
                </span>
              </div>
              <p className="text-[11px] text-description m-0 leading-relaxed">
                保留 34px 膠囊細邊框與白底，Hover 變色提亮；點擊與展開時套用方案二的 <code className="text-primary bg-primary/10 px-3 py-0.5 rounded">bg-primary/25</code> 與 <code className="text-primary bg-primary/10 px-3 py-0.5 rounded">shadow-inner-s</code> 內陰影，箭頭極簡直接旋轉。
              </p>

              {/* 互動展示區 */}
              <div className="my-6 flex flex-col gap-6 rounded-lg bg-[#F8FAFC] p-8 border border-stroke/30">
                <span className="text-[10px] font-medium text-description">可點擊體驗互動：</span>
                <div className="flex items-center gap-8">
                  {/* Demo 按鈕 1 */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setDemo1Open((prev) => !prev)}
                      className={cx(
                        "h-[34px] pl-14 pr-10 rounded-full border font-primary text-caption-1 transition-all duration-150 cursor-pointer select-none flex items-center gap-6",
                        demo1Open
                          ? "border-primary bg-primary/25 text-primary font-medium shadow-inner-s"
                          : demo1Filter !== "all"
                          ? "border-primary/60 bg-primary/5 text-primary font-medium hover:bg-primary/10 active:bg-primary/30"
                          : "border-stroke bg-white text-fontcolor hover:border-primary/60 hover:bg-primary/10 hover:text-primary active:bg-primary/30",
                      )}
                    >
                      <span>{DEMO_OPTIONS.find((o) => o.id === demo1Filter)?.label}</span>
                      <svg
                        className={cx("w-12 h-12 transition-transform duration-200 text-current", demo1Open && "rotate-180")}
                        viewBox="0 0 12 12"
                        fill="none"
                      >
                        <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>

                    {demo1Open && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setDemo1Open(false)} />
                        <div className="absolute top-[40px] left-0 z-50 min-w-[130px] rounded-[22px] border border-stroke bg-white p-6 shadow-drop-l animate-in fade-in duration-100">
                          <ul className="m-0 list-none p-0 flex flex-col gap-2">
                            {DEMO_OPTIONS.map((item) => (
                              <ListItem
                                key={item.id}
                                selected={demo1Filter === item.id}
                                onClick={() => {
                                  setDemo1Filter(item.id);
                                  setDemo1Open(false);
                                }}
                                className="!h-[30px] !min-h-[30px] !px-10 !rounded-full !text-caption-1 cursor-pointer"
                              >
                                {item.label}
                              </ListItem>
                            ))}
                          </ul>
                        </div>
                      </>
                    )}
                  </div>

                  {/* 靜態對照 */}
                  <span className="text-[11px] text-description">點擊展開有內陰影沉浸效果</span>
                </div>
              </div>
            </div>

            <Button
              variant={activeVariant === "outline" ? "filled" : "outline"}
              intent="primary"
              onClick={() => onSelectVariant?.("outline")}
              className="mt-8 !h-[32px] w-full !rounded-full !text-caption-1 font-medium"
            >
              {activeVariant === "outline" ? "✓ 目前套用中" : "套用整合款"}
            </Button>
          </div>

          {/* ==================== 方案 1: 原版 Outline ==================== */}
          <div
            className={cx(
              "flex flex-col justify-between rounded-xl border p-12 transition-all bg-white",
              activeVariant === "original-outline"
                ? "border-primary ring-2 ring-primary/20 shadow-drop-s"
                : "border-stroke/70 hover:border-stroke",
            )}
          >
            <div className="flex flex-col gap-8">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-bold text-fontcolor">原方案 1：Outline 膠囊按鈕</span>
                <span className="rounded-full bg-secondary/15 px-6 py-0.5 text-[10px] font-semibold text-secondary">
                  原版對照
                </span>
              </div>
              <p className="text-[11px] text-description m-0 leading-relaxed">
                原版方案一：具有外環光暈焦點（<code className="text-secondary bg-secondary/10 px-3 py-0.5 rounded">ring-2 ring-primary/20</code>）與獨立圓形徽章箭頭。
              </p>

              {/* 互動展示區 */}
              <div className="my-6 flex flex-col gap-6 rounded-lg bg-[#F8FAFC] p-8 border border-stroke/30">
                <span className="text-[10px] font-medium text-description">可點擊體驗互動：</span>
                <div className="flex items-center gap-8">
                  {/* Demo 按鈕 2 */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setDemo2Open((prev) => !prev)}
                      className={cx(
                        "h-[34px] pl-14 pr-8 rounded-full border bg-white text-caption-1 transition-all cursor-pointer select-none flex items-center gap-6",
                        demo2Open
                          ? "border-primary ring-2 ring-primary/20 text-primary font-medium bg-primary/5 shadow-xs"
                          : "border-stroke text-fontcolor hover:border-primary/60 hover:bg-primary/10 hover:text-primary active:bg-primary/20",
                      )}
                    >
                      <span>{DEMO_OPTIONS.find((o) => o.id === demo2Filter)?.label}</span>
                      <span
                        className={cx(
                          "w-[20px] h-[20px] rounded-full flex items-center justify-center transition-all",
                          demo2Open ? "bg-[#CEDAE3] text-primary shadow-inner" : "text-description",
                        )}
                      >
                        <svg
                          className={cx("w-10 h-10 transition-transform duration-200", demo2Open && "rotate-180")}
                          viewBox="0 0 12 12"
                          fill="none"
                        >
                          <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </button>

                    {demo2Open && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setDemo2Open(false)} />
                        <div className="absolute top-[40px] left-0 z-50 min-w-[130px] rounded-[22px] border border-stroke bg-white p-6 shadow-drop-l animate-in fade-in duration-100">
                          <ul className="m-0 list-none p-0 flex flex-col gap-2">
                            {DEMO_OPTIONS.map((item) => (
                              <ListItem
                                key={item.id}
                                selected={demo2Filter === item.id}
                                onClick={() => {
                                  setDemo2Filter(item.id);
                                  setDemo2Open(false);
                                }}
                                className="!h-[30px] !min-h-[30px] !px-10 !rounded-full !text-caption-1 cursor-pointer"
                              >
                                {item.label}
                              </ListItem>
                            ))}
                          </ul>
                        </div>
                      </>
                    )}
                  </div>

                  {/* 靜態對照 */}
                  <span className="text-[11px] text-description">焦點外環＋獨立圓形箭頭</span>
                </div>
              </div>
            </div>

            <Button
              variant={activeVariant === "original-outline" ? "filled" : "outline"}
              intent="primary"
              onClick={() => onSelectVariant?.("original-outline")}
              className="mt-8 !h-[32px] w-full !rounded-full !text-caption-1 font-medium"
            >
              {activeVariant === "original-outline" ? "✓ 目前套用中" : "套用原方案 1 (Outline)"}
            </Button>
          </div>

          {/* ==================== 方案 2: Ghost 扁平 ==================== */}
          <div
            className={cx(
              "flex flex-col justify-between rounded-xl border p-12 transition-all bg-white",
              activeVariant === "ghost"
                ? "border-primary ring-2 ring-primary/20 shadow-drop-s"
                : "border-stroke/70 hover:border-stroke",
            )}
          >
            <div className="flex flex-col gap-8">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-bold text-fontcolor">原方案 2：Ghost 扁平風格</span>
                <span className="rounded-full bg-secondary/15 px-6 py-0.5 text-[10px] font-semibold text-secondary">
                  比照月/年
                </span>
              </div>
              <p className="text-[11px] text-description m-0 leading-relaxed">
                完全比照 Datepicker 頂部切換風格：無外框透明底、主色文字，Hover 變色、點擊 Active/開啟時底色加深，箭頭極簡直接旋轉。
              </p>

              {/* 互動展示區 */}
              <div className="my-6 flex flex-col gap-6 rounded-lg bg-[#F8FAFC] p-8 border border-stroke/30">
                <span className="text-[10px] font-medium text-description">可點擊體驗互動：</span>
                <div className="flex items-center gap-8">
                  {/* Demo 按鈕 3 */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setDemo3Open((prev) => !prev)}
                      className={cx(
                        "h-[34px] px-12 rounded-full border-0 font-primary text-caption-1 font-medium transition-all duration-150 cursor-pointer select-none flex items-center gap-6",
                        demo3Open
                          ? "bg-primary/25 text-primary shadow-inner-s"
                          : "bg-transparent text-primary hover:bg-primary/10 active:bg-primary/30",
                      )}
                    >
                      <span>{DEMO_OPTIONS.find((o) => o.id === demo3Filter)?.label}</span>
                      <svg
                        className={cx("w-12 h-12 transition-transform duration-200 text-current", demo3Open && "rotate-180")}
                        viewBox="0 0 12 12"
                        fill="none"
                      >
                        <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>

                    {demo3Open && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setDemo3Open(false)} />
                        <div className="absolute top-[40px] left-0 z-50 min-w-[130px] rounded-[22px] border border-stroke bg-white p-6 shadow-drop-l animate-in fade-in duration-100">
                          <ul className="m-0 list-none p-0 flex flex-col gap-2">
                            {DEMO_OPTIONS.map((item) => (
                              <ListItem
                                key={item.id}
                                selected={demo3Filter === item.id}
                                onClick={() => {
                                  setDemo3Filter(item.id);
                                  setDemo3Open(false);
                                }}
                                className="!h-[30px] !min-h-[30px] !px-10 !rounded-full !text-caption-1 cursor-pointer"
                              >
                                {item.label}
                              </ListItem>
                            ))}
                          </ul>
                        </div>
                      </>
                    )}
                  </div>

                  {/* 靜態對照 */}
                  <span className="text-[11px] text-description">無外框透明極簡</span>
                </div>
              </div>
            </div>

            <Button
              variant={activeVariant === "ghost" ? "filled" : "outline"}
              intent="primary"
              onClick={() => onSelectVariant?.("ghost")}
              className="mt-8 !h-[32px] w-full !rounded-full !text-caption-1 font-medium"
            >
              {activeVariant === "ghost" ? "✓ 目前套用中" : "套用原方案 2 (Ghost)"}
            </Button>
          </div>

        </div>
      )}
    </div>
  );
}
