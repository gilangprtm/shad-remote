export type RemoteError = {
  code: string;
  message: string;
  retryable?: boolean;
  cause?: unknown;
};

export type RemoteAsyncState<T> =
  | { status: "loading" }
  | { status: "error"; error: RemoteError; onRetry?: () => void }
  | { status: "empty"; emptyState?: unknown }
  | { status: "ready"; data: T };
