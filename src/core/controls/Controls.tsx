import {
  Children,
  createContext,
  isValidElement,
  useContext,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";

export function ButtonGroup({ children, className }: { children: ReactNode; className?: string }) {
  return <div role="group" className={cn("inline-flex items-center [&>button:not(:first-child)]:rounded-l-none [&>button:not(:last-child)]:rounded-r-none", className)}>{children}</div>;
}

type ToggleGroupType = "single" | "multiple";
type ToggleGroupOrientation = "horizontal" | "vertical";
type ToggleGroupValue = string | string[];

type ToggleGroupContextValue = {
  type: ToggleGroupType;
  value: ToggleGroupValue;
  disabled: boolean;
  size: ToggleGroupSize;
  variant: ToggleGroupVariant;
  select: (itemValue: string) => void;
};

const ToggleGroupContext = createContext<ToggleGroupContextValue | null>(null);

const toggleGroupVariants = cva("inline-flex items-center gap-1 rounded-lg bg-muted p-1", {
  variants: {
    orientation: { horizontal: "flex-row", vertical: "flex-col items-stretch" },
  },
  defaultVariants: { orientation: "horizontal" },
});

const toggleGroupItemVariants = cva("inline-flex items-center justify-center rounded-md font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50", {
  variants: {
    variant: {
      default: "hover:bg-background data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:shadow-sm",
      outline: "border border-border bg-background/50 hover:bg-background data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:shadow-sm",
    },
    size: {
      default: "h-8 px-3 text-sm",
      sm: "h-7 px-2.5 text-xs",
      lg: "h-9 px-3.5 text-sm",
    },
  },
  defaultVariants: { variant: "default", size: "default" },
});

type ToggleGroupSize = NonNullable<VariantProps<typeof toggleGroupItemVariants>["size"]>;
type ToggleGroupVariant = NonNullable<VariantProps<typeof toggleGroupItemVariants>["variant"]>;

type ToggleGroupBaseProps = Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> & {
  children: ReactNode;
  orientation?: ToggleGroupOrientation;
  disabled?: boolean;
  size?: ToggleGroupSize;
  variant?: ToggleGroupVariant;
};

type ToggleGroupSingleProps = ToggleGroupBaseProps & {
  type?: "single";
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
};

type ToggleGroupMultipleProps = ToggleGroupBaseProps & {
  type: "multiple";
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
};

export type ToggleGroupProps = ToggleGroupSingleProps | ToggleGroupMultipleProps;

export function ToggleGroup(props: ToggleGroupProps) {
  const {
    type = "single",
    value,
    defaultValue,
    onValueChange,
    children,
    className,
    orientation = "horizontal",
    disabled = false,
    size = "default",
    variant = "default",
    ...divProps
  } = props;
  const [internalValue, setInternalValue] = useState<ToggleGroupValue>(defaultValue ?? (type === "multiple" ? [] : ""));
  const currentValue = value ?? internalValue;

  const select = (itemValue: string) => {
    const next: ToggleGroupValue = type === "multiple"
      ? (Array.isArray(currentValue) && currentValue.includes(itemValue)
        ? currentValue.filter((entry) => entry !== itemValue)
        : [...(Array.isArray(currentValue) ? currentValue : []), itemValue])
      : currentValue === itemValue ? "" : itemValue;
    if (value === undefined) setInternalValue(next);
    (onValueChange as ((nextValue: ToggleGroupValue) => void) | undefined)?.(next);
  };

  return (
    <ToggleGroupContext.Provider value={{ type, value: currentValue, disabled, size, variant, select }}>
      <div
        role="group"
        aria-orientation={orientation}
        data-orientation={orientation}
        data-disabled={disabled ? "" : undefined}
        className={cn(toggleGroupVariants({ orientation }), className)}
        {...divProps}
      >
        {Children.map(children, (child) => {
          if (!isValidElement(child)) return child;
          return child;
        })}
      </div>
    </ToggleGroupContext.Provider>
  );
}

export type ToggleGroupItemProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  value: string;
  selected?: boolean;
  onSelect?: (value: string) => void;
  size?: ToggleGroupSize;
  variant?: ToggleGroupVariant;
};

export function ToggleGroupItem({ value, selected, onSelect, children, className, disabled, size: itemSize, variant: itemVariant, onClick, ...props }: ToggleGroupItemProps) {
  const context = useContext(ToggleGroupContext);
  const active = selected ?? (context ? (Array.isArray(context.value) ? context.value.includes(value) : context.value === value) : false);
  const isDisabled = disabled || context?.disabled;
  const next = () => {
    if (isDisabled) return;
    if (context) context.select(value);
    onSelect?.(value);
  };

  return (
    <button
      type="button"
      role={context?.type === "multiple" ? "checkbox" : "radio"}
      aria-checked={active}
      aria-pressed={active}
      data-state={active ? "on" : "off"}
      data-disabled={isDisabled ? "" : undefined}
      disabled={isDisabled}
      className={cn(toggleGroupItemVariants({ size: itemSize ?? context?.size, variant: itemVariant ?? context?.variant }), className)}
      onClick={(event) => { next(); onClick?.(event); }}
      {...props}
    >
      {children}
    </button>
  );
}

export function Slider({ value, defaultValue = 0, min = 0, max = 100, step = 1, onValueChange, className, orientation = "horizontal", disabled = false, ...props }: { value?: number | number[]; defaultValue?: number | number[]; min?: number; max?: number; step?: number; onValueChange?: (value: number | number[]) => void; className?: string; orientation?: "horizontal" | "vertical"; disabled?: boolean } & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "defaultValue" | "onChange" | "min" | "max" | "step">) {
  const initial = Array.isArray(defaultValue) ? defaultValue[0] ?? min : defaultValue;
  const [internal, setInternal] = useState(initial);
  const current = Array.isArray(value) ? value[0] ?? min : value ?? internal;
  return <input aria-label="Slider" type="range" min={min} max={max} step={step} value={current} disabled={disabled} {...props} className={cn(orientation === "vertical" ? "h-32 w-2 [writing-mode:vertical-lr]" : "h-2 w-full", "accent-primary", className)} onChange={(event) => { const next = Number(event.target.value); if (value === undefined) setInternal(next); onValueChange?.(Array.isArray(value) || Array.isArray(defaultValue) ? [next] : next); }} />;
}
