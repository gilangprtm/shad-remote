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
