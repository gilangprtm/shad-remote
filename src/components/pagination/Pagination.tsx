import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "../../core/button/Button";

type PaginationProps = {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  iconOnly?: boolean;
};

export function Pagination({ page, pageCount, onPageChange, iconOnly = false }: PaginationProps) {
  const canPrevious = page > 1;
  const canNext = page < pageCount;
  return <nav aria-label="Pagination" className="flex items-center justify-between gap-3"><span className="text-sm text-muted-foreground">Page {page} of {pageCount}</span><div className="flex gap-2"><Button size={iconOnly ? "icon-sm" : "sm"} variant="outline" aria-label="Previous page" disabled={!canPrevious} onClick={() => onPageChange(page - 1)}>{iconOnly ? <ArrowLeft aria-hidden="true" /> : "Previous"}</Button><Button size={iconOnly ? "icon-sm" : "sm"} variant="outline" aria-label="Next page" disabled={!canNext} onClick={() => onPageChange(page + 1)}>{iconOnly ? <ArrowRight aria-hidden="true" /> : "Next"}</Button></div></nav>;
}
