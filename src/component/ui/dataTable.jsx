import { forwardRef, useState, useMemo } from "react";
import { Body } from "./bodyCell";

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

/**
 * 預設 7 個欄位規範 (對齊 Figma 設計稿)
 */
export const DEFAULT_COLUMNS = [
  { key: "col1", title: "Header" },
  { key: "col2", title: "Header" },
  { key: "col3", title: "Header" },
  { key: "col4", title: "Header" },
  { key: "col5", title: "Header" },
  { key: "col6", title: "Header" },
  { key: "col7", title: "Header" },
];

/**
 * 預設 6 列資料列 (對齊 Figma 設計稿)
 */
export const DEFAULT_DATA = Array.from({ length: 6 }, (_, index) => ({
  id: `row-${index + 1}`,
  col1: "Body",
  col2: "Body",
  col3: "Body",
  col4: "Body",
  col5: "Body",
  col6: "Body",
  col7: "Body",
}));

/**
 * DataTable 表格元件 (Figma ❖ DataTable 規範)
 *
 * 設計規格：
 * - 圓角：固定 22px (rounded-[22px] / rounded-4xl)
 * - 外邊框：border border-stroke (#CBD5E1)
 * - 陰影：shadow-drop-s (0px 2px 6px -1px rgba(0, 0, 0, 0.07))
 * - 表頭：高度 38px，淺色底 (#F8FAFC)，標題 text-[15px] font-medium
 * - 資料列：高度 38px，使用專案標準 Body / TableCell 元件
 * - 支援全選／個別勾選 (Select All / Indeterminate / Individual Checkbox)
 * - 行懸停 (hover:bg-[#F0F1F2]) 與選中狀態 (bg-[#EFF3F6])
 */
export const DataTable = forwardRef(function DataTable(
  {
    columns = DEFAULT_COLUMNS,
    data = DEFAULT_DATA,
    selectable = true,
    selectedRowKeys: controlledSelectedRowKeys,
    onSelectionChange,
    onRowClick,
    showLabel = false,
    label = "DataTable",
    className = "",
    containerClassName = "",
    headerClassName = "",
    rowClassName = "",
    emptyText = "暫無資料",
    rowKey = "id",
    hoverable = true,
    ...props
  },
  ref,
) {
  // 非受控選中狀態管理
  const [internalSelectedKeys, setInternalSelectedKeys] = useState([]);
  const isControlled = controlledSelectedRowKeys !== undefined;
  const currentSelectedKeys = isControlled ? controlledSelectedRowKeys : internalSelectedKeys;

  // 計算選中狀態 (全選 / 部分選中)
  const allRowKeys = useMemo(() => {
    return data.map((item, index) =>
      typeof rowKey === "function" ? rowKey(item, index) : item[rowKey] ?? `row-${index}`,
    );
  }, [data, rowKey]);

  const isAllSelected = useMemo(() => {
    if (allRowKeys.length === 0) return false;
    return allRowKeys.every((key) => currentSelectedKeys.includes(key));
  }, [allRowKeys, currentSelectedKeys]);

  const isIndeterminate = useMemo(() => {
    if (isAllSelected || currentSelectedKeys.length === 0) return false;
    return allRowKeys.some((key) => currentSelectedKeys.includes(key));
  }, [allRowKeys, currentSelectedKeys, isAllSelected]);

  // 全選／全不選切換
  const handleSelectAll = (checked) => {
    const newSelectedKeys = checked ? [...allRowKeys] : [];
    if (!isControlled) {
      setInternalSelectedKeys(newSelectedKeys);
    }
    const newSelectedRows = checked ? [...data] : [];
    onSelectionChange?.(newSelectedKeys, newSelectedRows);
  };

  // 單列選取切換
  const handleSelectRow = (key, checked, record) => {
    let nextKeys = [];
    if (checked) {
      nextKeys = [...currentSelectedKeys, key];
    } else {
      nextKeys = currentSelectedKeys.filter((k) => k !== key);
    }

    if (!isControlled) {
      setInternalSelectedKeys(nextKeys);
    }

    const nextRows = data.filter((item, index) => {
      const k = typeof rowKey === "function" ? rowKey(item, index) : item[rowKey] ?? `row-${index}`;
      return nextKeys.includes(k);
    });

    onSelectionChange?.(nextKeys, nextRows);
  };

  return (
    <div className={cx("flex flex-col font-primary text-left", containerClassName)} ref={ref}>
      {/* Figma 元件標籤 (可選) */}
      {showLabel && (
        <div className="flex items-center gap-6 mb-8 text-[#8B5CF6] font-semibold text-body-3 select-none">
          <span className="text-sm">❖</span>
          <span>{label}</span>
        </div>
      )}

      {/* 表格本體容器 (22px 圓角與描邊陰影) */}
      <div
        className={cx(
          "w-full overflow-hidden rounded-[22px] rounded-4xl border border-stroke bg-white shadow-drop-s",
          className,
        )}
        {...props}
      >
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left font-primary text-body-3">
            {/* 表頭 (Header Row) */}
            <thead>
              <tr className={cx("h-[38px] border-b border-stroke bg-[#F8FAFC]", headerClassName)}>
                {/* 1. 勾選全選欄位 */}
                {selectable && (
                  <th className="w-[48px] min-w-[48px] max-w-[48px] p-0 text-center font-normal">
                    <label className="relative inline-flex items-center justify-center w-16 h-16 flex-none cursor-pointer">
                      <input
                        type="checkbox"
                        aria-label="Select all rows"
                        checked={isAllSelected}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="peer absolute inset-0 w-full h-full m-0 opacity-0 cursor-pointer disabled:cursor-not-allowed focus-visible:outline-none"
                      />
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        aria-hidden="true"
                        className={cx(
                          "block pointer-events-none transition-colors duration-150 peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2 peer-focus-visible:rounded-[3px]",
                          isAllSelected || isIndeterminate
                            ? "text-primary"
                            : "text-fontcolor hover:text-primary",
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
                            isAllSelected || isIndeterminate
                              ? "fill-current stroke-current"
                              : "fill-none stroke-current",
                          )}
                        />
                        {isAllSelected && (
                          <path
                            d="m4.8 8 2.1 2.1 4.3-4.3"
                            fill="none"
                            stroke="white"
                            strokeWidth="1.3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        )}
                        {!isAllSelected && isIndeterminate && (
                          <path
                            d="M4.5 8h7"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                        )}
                      </svg>
                    </label>
                  </th>
                )}

                {/* 2. 各資料欄表頭 */}
                {columns.map((col, colIdx) => (
                  <th
                    key={col.key || colIdx}
                    style={col.width ? { width: col.width } : undefined}
                    className={cx(
                      "h-[38px] px-12 py-8 text-[15px] font-medium text-fontcolor whitespace-nowrap select-none",
                      col.align === "center" && "text-center",
                      col.align === "right" && "text-right",
                      col.headerClassName,
                    )}
                  >
                    {col.title ?? col.label ?? "Header"}
                  </th>
                ))}
              </tr>
            </thead>

            {/* 表格資料內容 (Body Rows) */}
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (selectable ? 1 : 0)}
                    className="h-[120px] text-center text-description text-label-3"
                  >
                    {emptyText}
                  </td>
                </tr>
              ) : (
                data.map((row, rowIndex) => {
                  const key =
                    typeof rowKey === "function"
                      ? rowKey(row, rowIndex)
                      : row[rowKey] ?? `row-${rowIndex}`;
                  const isSelected = currentSelectedKeys.includes(key);
                  const isLastRow = rowIndex === data.length - 1;

                  return (
                    <tr
                      key={key}
                      onClick={(e) => onRowClick?.(row, rowIndex, e)}
                      className={cx(
                        "h-[38px] transition-colors duration-150 border-b border-stroke last:border-b-0",
                        isSelected
                          ? "bg-[#EFF3F6]"
                          : hoverable
                          ? "bg-white hover:bg-[#F0F1F2]"
                          : "bg-white",
                        typeof rowClassName === "function"
                          ? rowClassName(row, rowIndex)
                          : rowClassName,
                      )}
                    >
                      {/* Checkbox 欄位 (使用 Body Checkbox 元件) */}
                      {selectable && (
                        <td className="w-[48px] min-w-[48px] max-w-[48px] p-0 text-center">
                          <Body
                            type="Checkbox"
                            checked={isSelected}
                            status={isSelected ? "Selected" : "Default"}
                            onCheckedChange={(checked) => handleSelectRow(key, checked, row)}
                            className="w-full justify-center !shadow-none !bg-transparent"
                          />
                        </td>
                      )}

                      {/* 資料欄位 (使用 Body Default / Instance 元件) */}
                      {columns.map((col, colIdx) => {
                        const cellValue = row[col.key];

                        return (
                          <td
                            key={col.key || colIdx}
                            className={cx(
                              "p-0 text-fontcolor",
                              col.align === "center" && "text-center",
                              col.align === "right" && "text-right",
                            )}
                          >
                            {col.render ? (
                              <div className="box-border flex h-[38px] items-center px-12 py-8 text-[15px] font-normal text-fontcolor">
                                {col.render(cellValue, row, rowIndex)}
                              </div>
                            ) : (
                              <Body
                                type={col.type || "Default"}
                                text={cellValue !== undefined ? String(cellValue) : "Body"}
                                status={isSelected ? "Selected" : "Default"}
                                instance={col.type === "Instance" ? col.instance : undefined}
                                avatar={col.avatar ? col.avatar(row, rowIndex) : undefined}
                                showAvatar={Boolean(col.showAvatar)}
                                placeholder={col.placeholder}
                                inputProps={col.inputProps}
                                className="w-full !shadow-none !bg-transparent"
                              />
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
});

export default DataTable;
