export type UploadStatus = "queued" | "uploading" | "success" | "error" | "cancelled";

export type UploadFile = {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  progress: number;
  status: UploadStatus;
  error?: string;
  previewUrl?: string;
};

export type UploadContext = {
  signal?: AbortSignal;
  onProgress?: (progress: number) => void;
};

export type UploadResult = {
  id: string;
  url?: string;
};

export type UploadAdapter = {
  upload: (file: File, context: UploadContext) => Promise<UploadResult>;
  cancel?: (uploadId: string) => Promise<void>;
};

export type FileUploaderProps = {
  files: UploadFile[];
  accept?: string[];
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number;
  adapter?: UploadAdapter;
  onFilesSelected: (files: File[]) => void;
  onRemove: (fileId: string) => void;
  onRetry: (fileId: string) => void;
  onCancel: (fileId: string) => void;
};
