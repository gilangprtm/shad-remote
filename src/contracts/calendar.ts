export type CalendarView = "month" | "week" | "day";

export type CalendarEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color?: string;
  allDay?: boolean;
  metadata?: Record<string, unknown>;
};

export type DatePickerPropsContract = {
  value?: Date;
  defaultValue?: Date;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: (date: Date) => boolean;
  onChange: (date: Date | undefined) => void;
};

export type EventCalendarContract = {
  events: CalendarEvent[];
  view: CalendarView;
  date: Date;
  onDateChange: (date: Date) => void;
  onViewChange: (view: CalendarView) => void;
  onEventClick?: (event: CalendarEvent) => void;
  onSlotClick?: (date: Date) => void;
};

export type CalendarSelectionMode = "single" | "range";

export type CalendarDateRange = {
  from?: Date;
  to?: Date;
};

export type CalendarMatcher = Date | Date[] | ((date: Date) => boolean);

export type CalendarCellContext = {
  date: Date;
  selected: boolean;
  rangeStart: boolean;
  rangeEnd: boolean;
  inRange: boolean;
  outside: boolean;
  disabled: boolean;
  booked: boolean;
};

import type { ReactNode } from "react";

export type CalendarGridProps = {
  mode?: CalendarSelectionMode;
  selected?: Date | CalendarDateRange;
  defaultSelected?: Date | CalendarDateRange;
  onSelect?: (selection: Date | CalendarDateRange | undefined) => void;
  month?: Date;
  defaultMonth?: Date;
  onMonthChange?: (month: Date) => void;
  disabled?: CalendarMatcher;
  booked?: CalendarMatcher;
  minDate?: Date;
  maxDate?: Date;
  weekNumbers?: boolean;
  fixedWeeks?: boolean;
  showOutsideDays?: boolean;
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  locale?: string;
  dir?: "ltr" | "rtl";
  cellSize?: "sm" | "md" | "lg";
  renderCell?: (context: CalendarCellContext) => ReactNode;
  className?: string;
  "aria-label"?: string;
};
