import { useState } from "react";
import { Button } from "../../core/button/Button";
import { Input } from "../../core/input/Input";
import { formatDateInput } from "../calendar/calendar-utils";

export type DateRange = { from?: Date; to?: Date };
export function DateRangePicker({ value, defaultValue, onChange }: { value?: DateRange; defaultValue?: DateRange; onChange: (range: DateRange) => void }) {
  const [internal, setInternal] = useState<DateRange>(defaultValue ?? {});
  const range = value ?? internal;
  const update = (next: DateRange) => { if (value === undefined) setInternal(next); onChange(next); };
  const parse = (raw: string) => { const date = raw ? new Date(`${raw}T00:00:00`) : undefined; return date && !Number.isNaN(date.getTime()) ? date : undefined; };
  return <div className="flex flex-wrap items-center gap-2"><Input aria-label="Start date" type="date" value={formatDateInput(range.from)} onChange={(event) => update({ ...range, from: parse(event.target.value) })} /><span className="text-sm text-muted-foreground">to</span><Input aria-label="End date" type="date" value={formatDateInput(range.to)} onChange={(event) => update({ ...range, to: parse(event.target.value) })} /><Button type="button" size="sm" variant="ghost" onClick={() => update({})}>Clear</Button></div>;
}
