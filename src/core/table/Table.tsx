import type { TableHTMLAttributes, ThHTMLAttributes, TdHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

export function Table({ className, ...props }: TableHTMLAttributes<HTMLTableElement>) {
  return <div data-slot="table-container" className="relative w-full overflow-x-auto"><table data-slot="table" className={cn("w-full caption-bottom text-sm", className)} {...props} /></div>;
}
export function TableHeader({ className, ...props }: TableHTMLAttributes<HTMLTableSectionElement>) { return <thead data-slot="table-header" className={cn("[&_tr]:border-b", className)} {...props} />; }
export function TableBody({ className, ...props }: TableHTMLAttributes<HTMLTableSectionElement>) { return <tbody data-slot="table-body" className={cn("[&_tr:last-child]:border-0", className)} {...props} />; }
export function TableFooter({ className, ...props }: TableHTMLAttributes<HTMLTableSectionElement>) { return <tfoot data-slot="table-footer" className={cn("border-t bg-muted/50 font-medium", className)} {...props} />; }
export function TableRow({ className, ...props }: TableHTMLAttributes<HTMLTableRowElement>) { return <tr data-slot="table-row" className={cn("border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted", className)} {...props} />; }
export function TableHead({ className, ...props }: ThHTMLAttributes<HTMLTableCellElement>) { return <th data-slot="table-head" className={cn("h-10 px-2 text-left align-middle font-medium whitespace-nowrap", className)} {...props} />; }
export function TableCell({ className, ...props }: TdHTMLAttributes<HTMLTableCellElement>) { return <td data-slot="table-cell" className={cn("p-2 align-middle whitespace-nowrap", className)} {...props} />; }
export function TableCaption({ className, ...props }: TableHTMLAttributes<HTMLTableCaptionElement>) { return <caption data-slot="table-caption" className={cn("mt-4 text-sm text-muted-foreground", className)} {...props} />; }
