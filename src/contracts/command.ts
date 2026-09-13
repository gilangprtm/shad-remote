import type { ReactNode } from "react";

export type CommandItem = {
  id: string;
  label: string;
  keywords?: string[];
  group?: string;
  icon?: ReactNode;
  disabled?: boolean;
  onSelect: () => void;
};

export type CommandPaletteProps = {
  commands: CommandItem[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  placeholder?: string;
};
