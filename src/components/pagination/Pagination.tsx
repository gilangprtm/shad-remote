import { Button } from "../../core/button/Button";

export function Pagination({ page, pageCount, onPageChange }: { page: number; pageCount: number; onPageChange: (page: number) => void }) {
  const canPrevious = page > 1;
  const canNext = page < pageCount;
  return <nav aria-label="Pagination" className="flex items-center justify-between gap-3"><span className="text-sm text-muted-foreground">Page {page} of {pageCount}</span><div className="flex gap-2"><Button size="sm" variant="outline" disabled={!canPrevious} onClick={() => onPageChange(page - 1)}>Previous</Button><Button size="sm" variant="outline" disabled={!canNext} onClick={() => onPageChange(page + 1)}>Next</Button></div></nav>;
}
