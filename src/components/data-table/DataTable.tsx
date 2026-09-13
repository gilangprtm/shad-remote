import type { KeyboardEvent, ReactNode } from "react";

export type DataColumn<T> = { key: string; header: string; cell?: (row: T) => ReactNode };

export function DataTable<T extends Record<string, unknown>>({ data, columns, emptyMessage = "No records found", onRowClick }: { data: T[]; columns: DataColumn<T>[]; emptyMessage?: string; onRowClick?: (row: T) => void }) {
  const handleRowKeyDown = (event: KeyboardEvent<HTMLTableRowElement>, row: T) => {
    if (!onRowClick || (event.key !== "Enter" && event.key !== " ")) return;
    event.preventDefault();
    onRowClick(row);
  };
  return <div className="edjavu-table-wrap"><table className="edjavu-table"><thead><tr>{columns.map((column) => <th key={column.key}>{column.header}</th>)}</tr></thead><tbody>{data.length ? data.map((row, index) => <tr key={index} onClick={() => onRowClick?.(row)} onKeyDown={(event) => handleRowKeyDown(event, row)} tabIndex={onRowClick ? 0 : -1}>{columns.map((column) => <td key={column.key}>{column.cell ? column.cell(row) : String(row[column.key] ?? "")}</td>)}</tr>) : <tr><td colSpan={columns.length} className="edjavu-empty">{emptyMessage}</td></tr>}</tbody></table></div>;
}
