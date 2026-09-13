import { useMemo, useState, type KeyboardEvent, type ReactNode } from "react";
import { Button } from "../../core/button/Button";
import type { CalendarCellContext, CalendarDateRange, CalendarGridProps, CalendarMatcher } from "../../contracts/calendar";
import { cn } from "../../lib/cn";
import { addDays, isSameDay, startOfDay } from "./calendar-utils";

const weekLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const monthFormatter = (locale?: string) => new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" });
const dayFormatter = (locale?: string) => new Intl.DateTimeFormat(locale, { day: "numeric" });

function startOfWeek(date: Date, weekStartsOn: number) {
  const result = startOfDay(date);
  result.setDate(result.getDate() - (result.getDay() - weekStartsOn + 7) % 7);
  return result;
}

function matches(matcher: CalendarMatcher | undefined, date: Date) {
  if (!matcher) return false;
  if (typeof matcher === "function") return matcher(date);
  return Array.isArray(matcher) ? matcher.some((item) => isSameDay(item, date)) : isSameDay(matcher, date);
}

function sameOrBefore(left: Date, right: Date) { return startOfDay(left).getTime() <= startOfDay(right).getTime(); }
function sameOrAfter(left: Date, right: Date) { return startOfDay(left).getTime() >= startOfDay(right).getTime(); }

function rangeValue(value: CalendarGridProps["selected"]): CalendarDateRange {
  if (!value) return {};
  return value instanceof Date ? { from: value, to: value } : value;
}

function dateIsDisabled(date: Date, props: CalendarGridProps) {
  return matches(props.disabled, date) || matches(props.booked, date)
    || (props.minDate ? !sameOrAfter(date, props.minDate) : false)
    || (props.maxDate ? !sameOrBefore(date, props.maxDate) : false);
}

export function CalendarGrid({
  mode = "single", selected, defaultSelected, onSelect, month, defaultMonth,
  onMonthChange, disabled, booked, minDate, maxDate, weekNumbers = false,
  fixedWeeks = true, showOutsideDays = true, weekStartsOn = 0, locale, dir = "ltr",
  cellSize = "md", renderCell, className, ...ariaProps
}: CalendarGridProps) {
  const controlledMonth = month !== undefined;
  const [internalMonth, setInternalMonth] = useState(() => defaultMonth ?? new Date());
  const visibleMonth = controlledMonth ? month : internalMonth;
  const controlledSelection = selected !== undefined;
  const [internalSelection, setInternalSelection] = useState(defaultSelected);
  const currentSelection = controlledSelection ? selected : internalSelection;
  const range = rangeValue(currentSelection);

  const days = useMemo(() => {
    const first = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1);
    const count = fixedWeeks ? 42 : Math.ceil((((first.getDay() - weekStartsOn + 7) % 7) + new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 0).getDate()) / 7) * 7;
    const start = startOfWeek(first, weekStartsOn);
    return Array.from({ length: count }, (_, index) => addDays(start, index));
  }, [fixedWeeks, visibleMonth, weekStartsOn]);

  const setMonth = (next: Date) => { if (!controlledMonth) setInternalMonth(next); onMonthChange?.(next); };
  const shiftMonth = (amount: number) => setMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + amount, 1));
  const choose = (date: Date) => {
    if (dateIsDisabled(date, { disabled, booked, minDate, maxDate })) return;
    const next = mode === "single" ? date : (() => {
      if (!range.from || range.to || !sameOrAfter(date, range.from)) return { from: date };
      return { from: range.from, to: date };
    })();
    if (!controlledSelection) setInternalSelection(next);
    onSelect?.(next);
  };
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const amount = event.key === "ArrowLeft" ? (dir === "rtl" ? 1 : -1) : event.key === "ArrowRight" ? (dir === "rtl" ? -1 : 1) : event.key === "ArrowUp" ? -7 : event.key === "ArrowDown" ? 7 : 0;
    if (!amount) return;
    event.preventDefault();
    const active = document.activeElement as HTMLElement | null;
    const dateValue = active?.dataset.calendarDate;
    const next = dateValue ? addDays(new Date(`${dateValue}T00:00:00`), amount) : visibleMonth;
    const target = document.querySelector<HTMLElement>(`[data-calendar-date="${next.toISOString().slice(0, 10)}"]`);
    target?.focus();
  };
  const sizeClass = cellSize === "sm" ? "h-8 w-8 text-xs" : cellSize === "lg" ? "h-12 w-12" : "h-10 w-10";
  const label = monthFormatter(locale).format(visibleMonth);
  const headings = Array.from({ length: 7 }, (_, index) => weekLabels[(index + weekStartsOn) % 7]);

  return <section dir={dir} aria-label={ariaProps["aria-label"] ?? "Calendar"} className={cn("grid max-w-sm gap-3 rounded-lg border bg-background p-3", className)} onKeyDown={handleKeyDown}>
    <header className="flex items-center justify-between gap-2">
      <Button type="button" size="sm" variant="outline" aria-label="Previous month" onClick={() => shiftMonth(-1)}>{dir === "rtl" ? "Next" : "Previous"}</Button>
      <h2 className="text-sm font-semibold" aria-live="polite">{label}</h2>
      <Button type="button" size="sm" variant="outline" aria-label="Next month" onClick={() => shiftMonth(1)}>{dir === "rtl" ? "Previous" : "Next"}</Button>
    </header>
    <div className={cn("grid gap-1", weekNumbers ? "grid-cols-[auto_repeat(7,minmax(0,1fr))]" : "grid-cols-7")}>
      {weekNumbers && <span aria-hidden="true" />}{headings.map((heading) => <span key={heading} className="text-center text-xs font-medium text-muted-foreground">{heading}</span>)}
      {days.map((date, index) => {
        const outside = date.getMonth() !== visibleMonth.getMonth();
        const disabledDate = dateIsDisabled(date, { disabled, booked, minDate, maxDate });
        const selectedDate = Boolean(range.from && isSameDay(range.from, date)) || Boolean(range.to && isSameDay(range.to, date));
        const inRange = Boolean(range.from && range.to && sameOrAfter(date, range.from) && sameOrBefore(date, range.to));
        const context: CalendarCellContext = { date, selected: selectedDate, rangeStart: Boolean(range.from && isSameDay(range.from, date)), rangeEnd: Boolean(range.to && isSameDay(range.to, date)), inRange, outside, disabled: disabledDate, booked: matches(booked, date) };
        const content: ReactNode = renderCell?.(context) ?? dayFormatter(locale).format(date);
        return <div key={date.toISOString()} className={cn("relative flex justify-center", weekNumbers && index % 7 === 0 && "col-start-2")}>
          {weekNumbers && index % 7 === 0 && <span className="absolute end-full me-1 self-center text-xs text-muted-foreground">{getWeekNumber(date)}</span>}
          <button type="button" data-calendar-date={date.toISOString().slice(0, 10)} tabIndex={selectedDate ? 0 : -1} disabled={disabledDate || (outside && !showOutsideDays)} aria-label={date.toLocaleDateString(locale)} aria-selected={selectedDate || inRange} className={cn(sizeClass, "rounded-md text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", outside && "text-muted-foreground/50", disabledDate && "cursor-not-allowed text-muted-foreground line-through opacity-50", inRange && "bg-primary/10", selectedDate && "bg-primary text-primary-foreground", matches(booked, date) && "border border-destructive/50")} onClick={() => choose(date)}>{content}</button>
        </div>;
      })}
    </div>
  </section>;
}

function getWeekNumber(date: Date) {
  const firstThursday = new Date(date.getFullYear(), 0, 4);
  const start = startOfWeek(firstThursday, 1);
  return Math.ceil(((startOfDay(date).getTime() - start.getTime()) / 86400000 + 4) / 7);
}
