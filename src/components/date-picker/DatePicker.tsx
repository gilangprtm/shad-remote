import { useState } from "react";
import { Button } from "../../core/button/Button";
import { Input } from "../../core/input/Input";
import type { DatePickerPropsContract } from "../../contracts/calendar";

function toInputValue(date?: Date) { return date ? date.toISOString().slice(0, 10) : ""; }
function fromInputValue(value: string) { if (!value) return undefined; const date = new Date(`${value}T00:00:00`); return Number.isNaN(date.getTime()) ? undefined : date; }

export function DatePicker({ value, defaultValue, minDate, maxDate, disabledDates, onChange }: DatePickerPropsContract) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const current = value ?? internalValue;
  const handleChange = (next?: Date) => { if (value === undefined) setInternalValue(next); onChange(next); };
  const isDisabled = (date?: Date) => !date || (minDate && date < minDate) || (maxDate && date > maxDate) || Boolean(date && disabledDates?.(date));
  return <div className="flex items-center gap-2"><Input type="date" value={toInputValue(current)} min={toInputValue(minDate)} max={toInputValue(maxDate)} onChange={(event) => { const next = fromInputValue(event.target.value); if (!isDisabled(next)) handleChange(next); }} /><Button type="button" size="sm" variant="ghost" disabled={!current} onClick={() => handleChange(undefined)}>Clear</Button></div>;
}
