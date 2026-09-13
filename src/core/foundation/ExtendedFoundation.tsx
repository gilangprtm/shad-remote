import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

export function Attachment({ name, size, type, action, className }: { name: string; size?: string; type?: string; action?: ReactNode; className?: string }) {
  return <div className={cn("flex items-center justify-between gap-3 rounded-lg border p-3", className)}><div className="min-w-0"><strong className="block truncate text-sm">{name}</strong><span className="text-xs text-muted-foreground">{[type, size].filter(Boolean).join(" · ")}</span></div>{action}</div>;
}

export function Bubble({ children, role = "user", timestamp, className }: { children: ReactNode; role?: "user" | "assistant" | "system"; timestamp?: ReactNode; className?: string }) {
  return <div className={cn("max-w-[min(36rem,85%)] rounded-2xl border px-4 py-3 text-sm", role === "user" ? "ml-auto bg-primary text-primary-foreground" : role === "system" ? "mx-auto bg-muted" : "mr-auto bg-background", className)}><div>{children}</div>{timestamp && <time className="mt-1 block text-xs opacity-70">{timestamp}</time>}</div>;
}

export type QuestionnaireOption = { value: string; label: ReactNode; description?: ReactNode };
export function Questionnaire({ question, options, value, onValueChange, name, className }: { question: ReactNode; options: QuestionnaireOption[]; value?: string; onValueChange: (value: string) => void; name: string; className?: string }) {
  return <fieldset className={cn("grid gap-3", className)}><legend className="text-sm font-medium">{question}</legend>{options.map((option) => <label key={option.value} className="flex cursor-pointer items-start gap-3 rounded-lg border p-3 has-[:checked]:border-primary"><input type="radio" name={name} value={option.value} checked={value === option.value} onChange={() => onValueChange(option.value)} className="mt-1" /><span><strong className="block text-sm">{option.label}</strong>{option.description && <span className="text-xs text-muted-foreground">{option.description}</span>}</span></label>)}</fieldset>;
}
