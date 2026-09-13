import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  ImgHTMLAttributes,
  ReactElement,
  ReactNode,
} from "react";
import { cloneElement, forwardRef, isValidElement } from "react";
import { cn } from "../../lib/cn";
import { Button, type ButtonProps } from "../button/Button";

export type AttachmentState = "idle" | "uploading" | "processing" | "error" | "done";
export type AttachmentSize = "default" | "sm" | "xs";
export type AttachmentOrientation = "horizontal" | "vertical";

export type AttachmentProps = HTMLAttributes<HTMLDivElement> & {
  name?: string;
  size?: AttachmentSize | string;
  type?: string;
  action?: ReactNode;
  state?: AttachmentState;
  orientation?: AttachmentOrientation;
};

const attachmentSizes: Record<AttachmentSize, string> = {
  default: "min-h-16 gap-3 p-3",
  sm: "min-h-14 gap-2 p-2.5",
  xs: "min-h-10 gap-2 p-2",
};

/** The attachment shell. The name/type/action props remain supported for existing consumers. */
export const Attachment = forwardRef<HTMLDivElement, AttachmentProps>(function Attachment(
  { name, size = "default", type, action, state = "done", orientation = "horizontal", className, children, ...props },
  ref,
) {
  const legacy = children == null && name != null;
  return (
    <div
      ref={ref}
      data-slot="attachment"
      data-state={state}
      data-size={size}
      data-orientation={orientation}
      className={cn(
        "relative flex overflow-hidden rounded-lg border border-border bg-background text-foreground",
        attachmentSizes[size as AttachmentSize] ?? attachmentSizes.default,
        orientation === "vertical" && "flex-col items-stretch",
        state === "error" && "border-destructive/60 bg-destructive/5",
        className,
      )}
      {...props}
    >
      {legacy ? (
        <>
          <AttachmentContent>
            <AttachmentTitle>{name}</AttachmentTitle>
            {(type || (typeof size === "string" && !isAttachmentSize(size))) && (
              <AttachmentDescription>{[type, !isAttachmentSize(size) ? size : undefined].filter(Boolean).join(" · ")}</AttachmentDescription>
            )}
          </AttachmentContent>
          {action && <AttachmentActions>{action}</AttachmentActions>}
        </>
      ) : children}
    </div>
  );
});

function isAttachmentSize(value: string): value is AttachmentSize {
  return value === "default" || value === "sm" || value === "xs";
}

export type AttachmentMediaProps = HTMLAttributes<HTMLDivElement> & {
  variant?: "icon" | "image";
};

export function AttachmentMedia({ variant = "icon", className, children, ...props }: AttachmentMediaProps) {
  return (
    <div
      data-slot="attachment-media"
      data-variant={variant}
      className={cn(
        "flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted text-muted-foreground [&>svg]:size-5",
        variant === "image" && "size-16 rounded-sm [&>img]:size-full [&>img]:object-cover",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function AttachmentContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="attachment-content" className={cn("min-w-0 flex-1 self-center", className)} {...props} />;
}

export function AttachmentTitle({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="attachment-title"
      className={cn(
        "truncate text-sm font-medium",
        "data-[state=uploading]:animate-pulse data-[state=processing]:animate-pulse",
        className,
      )}
      {...props}
    />
  );
}

export function AttachmentDescription({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="attachment-description" className={cn("truncate text-xs text-muted-foreground", className)} {...props} />;
}

export function AttachmentActions({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="attachment-actions" className={cn("relative z-10 flex shrink-0 items-center gap-1", className)} {...props} />;
}

export type AttachmentActionProps = ButtonProps;

export function AttachmentAction({ className, size = "xs", ...props }: AttachmentActionProps) {
  return <Button data-slot="attachment-action" size={size} className={cn("relative z-10", className)} {...props} />;
}

type RenderableElement = ReactElement<{ className?: string }>;

export type AttachmentTriggerProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  render?: RenderableElement;
};

export function AttachmentTrigger({ render, className, ...props }: AttachmentTriggerProps) {
  const triggerClassName = cn(
    "absolute inset-0 z-0 rounded-[inherit] text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
    className,
  );
  if (render && isValidElement(render)) {
    return cloneElement(render, { ...props, className: cn(render.props.className, triggerClassName) });
  }
  return <button type="button" data-slot="attachment-trigger" className={triggerClassName} {...props} />;
}

export function AttachmentGroup({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="attachment-group"
      role={props.role ?? "group"}
      className={cn(
        "flex max-w-full gap-3 overflow-x-auto overscroll-contain py-1 [scroll-snap-type:x_mandatory] [&>[data-slot=attachment]]:min-w-64 [&>[data-slot=attachment]]:shrink-0 [&>[data-slot=attachment]]:snap-start",
        className,
      )}
      {...props}
    />
  );
}

export type AttachmentImageProps = ImgHTMLAttributes<HTMLImageElement>;

export function AttachmentImage(props: AttachmentImageProps) {
  return <img data-slot="attachment-image" {...props} />;
}

export function Bubble({ children, role = "user", timestamp, className }: { children: ReactNode; role?: "user" | "assistant" | "system"; timestamp?: ReactNode; className?: string }) {
  return <div className={cn("max-w-[min(36rem,85%)] rounded-2xl border px-4 py-3 text-sm", role === "user" ? "ml-auto bg-primary text-primary-foreground" : role === "system" ? "mx-auto bg-muted" : "mr-auto bg-background", className)}><div>{children}</div>{timestamp && <time className="mt-1 block text-xs opacity-70">{timestamp}</time>}</div>;
}

export type QuestionnaireOption = { value: string; label: ReactNode; description?: ReactNode };
export function Questionnaire({ question, options, value, onValueChange, name, className }: { question: ReactNode; options: QuestionnaireOption[]; value?: string; onValueChange: (value: string) => void; name: string; className?: string }) {
  return <fieldset className={cn("grid gap-3", className)}><legend className="text-sm font-medium">{question}</legend>{options.map((option) => <label key={option.value} className="flex cursor-pointer items-start gap-3 rounded-lg border p-3 has-[:checked]:border-primary"><input type="radio" name={name} value={option.value} checked={value === option.value} onChange={() => onValueChange(option.value)} className="mt-1" /><span><strong className="block text-sm">{option.label}</strong>{option.description && <span className="text-xs text-muted-foreground">{option.description}</span>}</span></label>)}</fieldset>;
}
