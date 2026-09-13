import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { Button } from "../../core/button/Button";
import { Progress } from "../../core/progress/Progress";
import type { FileUploaderProps, UploadFile } from "../../contracts/files";

function formatSize(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

type RejectedFile = { file: File; reason: string };

export function FileUploader({ files, accept, multiple = true, maxFiles, maxSize, onFilesSelected, onRemove, onRetry, onCancel, onFilesRejected, onUpload }: FileUploaderProps & { onFilesRejected?: (files: RejectedFile[]) => void; onUpload?: (file: UploadFile) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const acceptFiles = (selected: File[]) => {
    const rejected: RejectedFile[] = [];
    const accepted = selected.filter((file) => {
      const reason = accept?.length && !accept.includes(file.type) ? "File type is not accepted." : maxSize && file.size > maxSize ? "File exceeds the maximum size." : "";
      if (reason) rejected.push({ file, reason });
      return !reason;
    });
    onFilesRejected?.(rejected);
    onFilesSelected(maxFiles ? accepted.slice(0, maxFiles) : accepted);
  };
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => { acceptFiles(Array.from(event.target.files ?? [])); event.target.value = ""; };
  const handleDrop = (event: DragEvent<HTMLButtonElement>) => { event.preventDefault(); setDragging(false); acceptFiles(Array.from(event.dataTransfer.files)); };
  return <div className="grid gap-3"><input ref={inputRef} type="file" hidden multiple={multiple} accept={accept?.join(",")} onChange={handleChange} /><button type="button" className={`rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground hover:bg-muted/40 ${dragging ? "border-primary bg-muted" : ""}`} onClick={() => inputRef.current?.click()} onDragEnter={(event) => { event.preventDefault(); setDragging(true); }} onDragOver={(event) => event.preventDefault()} onDragLeave={() => setDragging(false)} onDrop={handleDrop}>Drop {multiple ? "files" : "a file"} here or choose from device</button>{files.length > 0 && <div className="grid gap-2" aria-live="polite">{files.map((item: UploadFile) => <div className="grid gap-2 rounded-md border p-3" key={item.id}><div className="flex items-center gap-3">{item.previewUrl && <img src={item.previewUrl} alt="" className="size-10 rounded object-cover" /> }<div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-3"><span className="truncate text-sm">{item.name} <span className="text-xs text-muted-foreground">({formatSize(item.size)})</span></span><span className="text-xs text-muted-foreground">{item.status}</span></div>{item.status === "uploading" && <Progress value={item.progress} />}{item.error && <p className="text-xs text-destructive">{item.error}</p>}</div></div><div className="flex gap-2">{(item.status === "queued" || item.status === "cancelled") && onUpload && <Button size="sm" variant="outline" onClick={() => onUpload(item)}>Upload</Button>}{item.status === "error" && <Button size="sm" variant="outline" onClick={() => onRetry(item.id)}>Retry</Button>}{item.status === "uploading" && <Button size="sm" variant="outline" onClick={() => onCancel(item.id)}>Cancel</Button>}<Button size="sm" variant="ghost" onClick={() => onRemove(item.id)}>Remove</Button></div></div>)}</div>}</div>;
}
