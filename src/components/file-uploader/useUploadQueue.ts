import { useCallback, useRef } from "react";
import type { UploadAdapter, UploadFile } from "../../contracts/files";

export function useUploadQueue(adapter?: UploadAdapter) {
  const controllers = useRef(new Map<string, AbortController>());
  const upload = useCallback(async (item: UploadFile, onUpdate: (patch: Partial<UploadFile>) => void) => {
    if (!adapter) return;
    const controller = new AbortController();
    controllers.current.set(item.id, controller);
    onUpdate({ status: "uploading", progress: 0, error: undefined });
    try {
      await adapter.upload(item.file, { signal: controller.signal, onProgress: (progress) => onUpdate({ progress }) });
      onUpdate({ status: "success", progress: 100 });
    } catch (error) {
      if (controller.signal.aborted) onUpdate({ status: "cancelled" });
      else onUpdate({ status: "error", error: error instanceof Error ? error.message : "Upload failed" });
    } finally {
      controllers.current.delete(item.id);
    }
  }, [adapter]);
  const cancel = useCallback(async (item: UploadFile) => {
    controllers.current.get(item.id)?.abort();
    await adapter?.cancel?.(item.id);
  }, [adapter]);
  return { upload, cancel };
}
