import { forwardRef, useState, useEffect } from "react";
import { Input } from "./input";

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

/**
 * 預設使用者圖示 (16x16)
 */
export function UserIcon({ className = "w-16 h-16", ...props }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M1.5 14c0-3.1 2.9-5 6.5-5s6.5 1.9 6.5 5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * 預設說明問號圖示 (16x16)
 */
export function HelpIcon({ className = "w-16 h-16", ...props }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <circle cx="8" cy="8" r="6.1" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M6.3 6.1a1.7 1.7 0 1 1 2.5 1.5c-.8.4-.8.8-.8 1.6"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <circle cx="8" cy="11.2" r=".65" fill="currentColor" />
    </svg>
  );
}

/**
 * Body / BodyCell (表格主體單元格元件)
 *
 * 設計規格：
 * - type: "Default" | "Checkbox" | "Instance"
 *   - Default: 文字單元格，支援 16px 頭像，最小寬度 60px，高度 38px
 *   - Checkbox: 勾選單元格，最小寬度 40px，高度 38px
 *   - Instance: 元件實例單元格，使用專案標準 Input (22px 圓角、陰影、前後綴圖示)，高度 48px，最小寬度 178px
 * - status: "Default" | "Hover" | "Selected"
 *   - Default: 白色底色，懸停時 #F0F1F2
 *   - Hover: 固定 #F0F1F2 懸停底色
 *   - Selected: 選中底色 #EFF3F6
 * - 底邊框：shadow-[inset_0_-1px_0_#CBD5E1] (專案 stroke 色)
 * - 字級：text-body-3 (15px / 20px / -0.24px)，顏色 text-fontcolor (#52525B)
 * - 支援受控與非受控狀態 (checked / onCheckedChange, check: "Yes" | "No")
 */
export const Body = forwardRef(function Body(
  {
    type = "Default",
    status = "Default",
    check = "No",
    text = "Body",
    showBodyText = false,
    showAvatar = false,
    avatar = null,
    instance,
    checked: controlledChecked,
    onCheckedChange,
    placeholder = "Placeholder",
    inputProps = {},
    checkboxProps = {},
    className = "",
    style,
    ...rest
  },
  ref,
) {
  // 正規化型態與狀態字串 (相容大小寫)
  const normType = (type || "Default").charAt(0).toUpperCase() + (type || "Default").slice(1).toLowerCase();
  const normStatus = (status || "Default").charAt(0).toUpperCase() + (status || "Default").slice(1).toLowerCase();
  const initialChecked = (check || "No").toLowerCase() === "yes";

  // Checkbox 狀態管理 (相容受控與非受控模式)
  const [internalChecked, setInternalChecked] = useState(
    controlledChecked !== undefined ? controlledChecked : initialChecked,
  );

  useEffect(() => {
    if (controlledChecked !== undefined) {
      setInternalChecked(controlledChecked);
    }
  }, [controlledChecked]);

  const isChecked = controlledChecked !== undefined ? controlledChecked : internalChecked;

  const { onChange: onCheckboxChange, ...nativeCheckboxProps } = checkboxProps;

  const handleCheckboxChange = (e) => {
    if (controlledChecked === undefined) {
      setInternalChecked(e.target.checked);
    }
    onCheckboxChange?.(e);
    onCheckedChange?.(e.target.checked, e);
  };

  // 狀態對應背景顏色
  const statusClasses = {
    Default: "bg-white hover:bg-[#F0F1F2]",
    Hover: "bg-[#F0F1F2]",
    Selected: "bg-[#EFF3F6]",
  };

  // 類型對應尺寸與內距
  const typeClasses = {
    Default: "min-w-[60px] h-[38px] py-8 px-12",
    Checkbox: "min-w-[40px] h-[38px] py-8 px-12",
    Instance: "min-w-[178px] h-[48px] py-6 px-12",
  };

  const isHoverOrSelected = normStatus === "Hover" || normStatus === "Selected";

  return (
    <div
      ref={ref}
      {...rest}
      data-type={normType}
      data-status={normStatus}
      style={style}
      className={cx(
        "group box-border inline-flex flex-none items-center gap-8 border-0 rounded-none align-middle select-none",
        "shadow-[inset_0_-1px_0_#CBD5E1] font-primary text-body-3 text-fontcolor transition-colors duration-150",
        typeClasses[normType] || typeClasses.Default,
        statusClasses[normStatus] || statusClasses.Default,
        className,
      )}
    >
      {/* 1. Default 文字與頭像類型 */}
      {normType === "Default" && (
        <>
          {showAvatar && avatar != null && (
            <span className="inline-flex items-center justify-center w-16 h-16 flex-none rounded-full overflow-hidden shrink-0">
              {avatar}
            </span>
          )}
          <span className="whitespace-nowrap select-none">{text}</span>
        </>
      )}

      {/* 2. Checkbox 類型 */}
      {normType === "Checkbox" && (
        <label className="relative inline-flex items-center justify-center w-16 h-16 flex-none cursor-pointer">
          <input
            aria-label="Select item"
            {...nativeCheckboxProps}
            type="checkbox"
            checked={isChecked}
            onChange={handleCheckboxChange}
            className="peer absolute inset-0 w-full h-full m-0 opacity-0 cursor-pointer disabled:cursor-not-allowed focus-visible:outline-none"
          />

          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            aria-hidden="true"
            className={cx(
              "block pointer-events-none transition-colors duration-150 peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2 peer-focus-visible:rounded-[3px]",
              isChecked
                ? "text-primary"
                : isHoverOrSelected
                ? "text-primary"
                : "text-fontcolor group-hover:text-primary",
            )}
          >
            <rect
              x="2"
              y="2"
              width="12"
              height="12"
              rx="2"
              className={cx(
                "stroke-[1.33]",
                isChecked ? "fill-current stroke-current" : "fill-none stroke-current",
              )}
            />
            {isChecked && (
              <path
                d="m4.8 8 2.1 2.1 4.3-4.3"
                fill="none"
                stroke="white"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
          </svg>
        </label>
      )}

      {/* 3. Instance 類型 (替換為專案標準 Input 元件) */}
      {normType === "Instance" && (
        instance !== undefined ? (
          instance
        ) : (
          <Input
            prefixIcon={<UserIcon className="w-16 h-16 text-description" />}
            suffixIcon={<HelpIcon className="w-16 h-16 text-description" />}
            placeholder={inputProps.placeholder ?? placeholder}
            containerClassName={cx("w-[154px] shrink-0", inputProps.containerClassName)}
            className={cx(
              "!h-[36px] !rounded-4xl shadow-drop-s text-body-3",
              inputProps.className,
            )}
            {...inputProps}
          />
        )
      )}

      {/* 非 Default 類型時，若開啟 showBodyText 則顯示文字 */}
      {normType !== "Default" && showBodyText && (
        <span className="whitespace-nowrap select-none">{text}</span>
      )}
    </div>
  );
});

// 別名導出相容 TableCell / BodyCell
export const BodyCell = Body;
export const TableCell = Body;
export default Body;

/**
 * 預覽全部 12 個變體 (Figma 設計稿 3x4 矩陣)
 */
export function BodyVariants({ className = "" }) {
  const statuses = ["Default", "Selected", "Hover"];

  const rows = [
    { type: "Default" },
    { type: "Checkbox", check: "Yes" },
    { type: "Checkbox", check: "No" },
    { type: "Instance" },
  ];

  return (
    <div
      className={cx(
        "grid grid-cols-3 gap-x-[44px] gap-y-20 items-center w-max p-20 bg-transparent",
        className,
      )}
    >
      {rows.flatMap((row) =>
        statuses.map((status) => (
          <Body
            key={`${row.type}-${row.check || "No"}-${status}`}
            {...row}
            status={status}
          />
        )),
      )}
    </div>
  );
}

