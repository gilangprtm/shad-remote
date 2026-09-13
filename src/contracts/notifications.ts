export type ToastVariant = "default" | "success" | "warning" | "error";

export type ToastOptions = {
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
};

export type ToastController = {
  show: (options: ToastOptions) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
};
