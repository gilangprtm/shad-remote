import { useMemo, useState, type ReactNode } from "react";
import { DataTable, type DataColumn } from "./DataTable";
import { FilterBar } from "../filter-bar/FilterBar";
import { Pagination } from "../pagination/Pagination";

export function ResourceTable<T extends Record<string, unknown>>({ data, columns, pageSize = 5, filterKeys = [], renderToolbar }: { data: T[]; columns: DataColumn<T>[]; pageSize?: number; filterKeys?: string[]; renderToolbar?: ReactNode }) {
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const filtered = useMemo(() => { const query = filter.trim().toLowerCase(); if (!query) return data; return data.filter((row) => filterKeys.some((key) => String(row[key] ?? "").toLowerCase().includes(query))); }, [data, filter, filterKeys]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const visible = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  return <div className="grid gap-3"><FilterBar value={filter} onValueChange={(value) => { setFilter(value); setPage(1); }} onReset={() => { setFilter(""); setPage(1); }}>{renderToolbar}</FilterBar><DataTable data={visible} columns={columns} emptyMessage="Tidak ada data yang cocok dengan filter." /><Pagination page={currentPage} pageCount={pageCount} onPageChange={setPage} /></div>;
}
