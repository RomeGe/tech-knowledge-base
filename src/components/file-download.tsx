// File download card showing file name, size, type icon

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

function getFileIcon(name: string): string {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (["pdf"].includes(ext)) return "pdf";
  if (["zip", "rar", "7z", "tar", "gz"].includes(ext)) return "archive";
  if (["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(ext)) return "image";
  if (["mp3", "wav", "ogg", "flac"].includes(ext)) return "audio";
  if (["mp4", "webm", "avi", "mov"].includes(ext)) return "video";
  if (["doc", "docx", "txt", "md"].includes(ext)) return "doc";
  if (["xls", "xlsx", "csv"].includes(ext)) return "sheet";
  if (["ppt", "pptx"].includes(ext)) return "slide";
  if (["js", "ts", "py", "c", "h", "cpp", "rs", "go", "java", "sh"].includes(ext))
    return "code";
  return "file";
}

function FileIcon({ type }: { type: string }) {
  const iconColor = {
    pdf: "text-red-500",
    archive: "text-amber-500",
    image: "text-emerald-500",
    audio: "text-purple-500",
    video: "text-blue-500",
    doc: "text-blue-600",
    sheet: "text-emerald-600",
    slide: "text-orange-500",
    code: "text-text-secondary",
    file: "text-text-tertiary",
  }[type] ?? "text-text-tertiary";

  return (
    <svg
      className={`w-8 h-8 ${iconColor}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
      />
    </svg>
  );
}

export function FileDownload({
  name,
  url,
  size,
}: {
  name: string;
  url: string;
  size?: number;
}) {
  const iconType = getFileIcon(name);

  return (
    <a
      href={url}
      download={name}
      className="flex items-center gap-3 my-4 p-3 bg-surface border border-border rounded-lg hover:bg-surface-hover hover:border-text-tertiary transition-colors group"
    >
      <FileIcon type={iconType} />
      <div className="flex-1 min-w-0">
        <div className="text-sm text-text-primary truncate group-hover:text-accent transition-colors">
          {name}
        </div>
        {size !== undefined && (
          <div className="text-xs text-text-tertiary mt-0.5">
            {formatFileSize(size)}
          </div>
        )}
      </div>
      <svg
        className="w-4 h-4 text-text-tertiary group-hover:text-accent transition-colors shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
        />
      </svg>
    </a>
  );
}
