export type ChartKind = "line" | "bar" | "area" | "pie" | "donut";

export type ChartSeries<TData extends Record<string, unknown>> = {
  key: keyof TData | string;
  label: string;
  color?: string;
};

export type ChartDefinition<TData extends Record<string, unknown>> = {
  kind: ChartKind;
  data: TData[];
  series: ChartSeries<TData>[];
  title?: string;
  description?: string;
  height?: number;
  valueFormatter?: (value: number) => string;
  accessibleDataTable?: boolean;
};
