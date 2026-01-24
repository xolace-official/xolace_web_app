"use client";

import Image from "next/image";
import type { FC } from "react";
import {
  Archive,
  FileCode,
  FileIcon,
  FileText,
  ImageIcon,
  Loader2,
  Music,
  Video,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface UploadedFile {
  id: string;
  url: string;
  name: string;
  type: string;
  description?: string;
  isUploading?: boolean;
}

export interface FilePreviewProps {
  files: UploadedFile[];
  onRemove?: (id: string) => void;
  className?: string;
}

const getFileExtension = (fileName: string): string => {
  const parts = fileName.split(".");
  return parts.length > 1 ? parts[parts.length - 1] : "";
};

const getFileIcon = (fileType: string, fileName: string) => {
  const extension = getFileExtension(fileName).toLowerCase();
  const iconSize = 24;

  // Image files
  if (fileType.startsWith("image/"))
    return (
      <ImageIcon
        size={iconSize}
        className="text-emerald-500 dark:text-emerald-400"
      />
    );

  // Document files
  if (fileType === "application/pdf" || extension === "pdf")
    return (
      <FileText size={iconSize} className="text-red-500 dark:text-red-400" />
    );

  if (
    ["doc", "docx", "odt", "rtf"].includes(extension) ||
    fileType.includes("wordprocessing") ||
    fileType.includes("msword")
  )
    return (
      <FileText size={iconSize} className="text-blue-500 dark:text-blue-400" />
    );

  // Spreadsheet files
  if (
    ["xls", "xlsx", "csv", "ods"].includes(extension) ||
    fileType.includes("spreadsheet") ||
    fileType.includes("excel")
  )
    return (
      <FileText
        size={iconSize}
        className="text-green-500 dark:text-green-400"
      />
    );

  // Code/text files
  if (["txt", "md"].includes(extension) || fileType === "text/plain")
    return (
      <FileText size={iconSize} className="text-zinc-500 dark:text-zinc-400" />
    );

  if (
    [
      "js",
      "ts",
      "jsx",
      "tsx",
      "py",
      "java",
      "c",
      "cpp",
      "html",
      "css",
    ].includes(extension) ||
    fileType.includes("javascript") ||
    fileType.includes("typescript")
  )
    return (
      <FileCode
        size={iconSize}
        className="text-yellow-500 dark:text-yellow-400"
      />
    );

  if (["json", "xml", "yaml", "yml"].includes(extension))
    return (
      <FileCode size={iconSize} className="text-zinc-500 dark:text-zinc-400" />
    );

  // Media files
  if (
    fileType.startsWith("video/") ||
    ["mp4", "avi", "mov", "mkv"].includes(extension)
  )
    return (
      <Video size={iconSize} className="text-purple-500 dark:text-purple-400" />
    );

  if (
    fileType.startsWith("audio/") ||
    ["mp3", "wav", "ogg"].includes(extension)
  )
    return (
      <Music size={iconSize} className="text-pink-500 dark:text-pink-400" />
    );

  // Archive files
  if (
    ["zip", "rar", "tar", "gz", "7z"].includes(extension) ||
    fileType.includes("archive") ||
    fileType.includes("compressed")
  )
    return (
      <Archive size={iconSize} className="text-amber-500 dark:text-amber-400" />
    );

  // Default fallback
  return (
    <FileIcon size={iconSize} className="text-zinc-500 dark:text-zinc-400" />
  );
};

const getFormattedFileType = (fileType: string, fileName: string): string => {
  const ext = getFileExtension(fileName).toUpperCase();

  if (fileType.includes("msword") || fileType.includes("wordprocessing"))
    return "DOC";

  if (fileType.includes("spreadsheet") || fileType.includes("excel"))
    return "SPREADSHEET";

  const typePart = fileType.split("/")[1];

  if (!typePart || typePart === "octet-stream") {
    return ext || "FILE";
  }

  const cleanType = typePart
    .replace("vnd.openxmlformats-officedocument.", "")
    .replace("vnd.ms-", "")
    .replace("x-", "")
    .replace("document.", "")
    .replace("presentation.", "")
    .replace("application.", "")
    .split(".")[0];

  return cleanType.toUpperCase().substring(0, 8);
};

export const FilePreview: FC<FilePreviewProps> = ({
  files,
  onRemove,
  className,
}) => {
  if (files.length === 0) return null;

  return (
    <div className={cn("flex w-full flex-col gap-2 rounded-xl p-2", className)}>
      <div className="flex w-full flex-wrap gap-2">
        {files.map((file) => (
          <div
            key={file.id}
            className={cn(
              "group/file relative flex items-center rounded-xl transition-all",
              "bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-700 dark:hover:bg-zinc-600",
              file.type.startsWith("image/")
                ? "h-14 w-14 justify-center"
                : "min-w-[180px] max-w-[220px] p-2 pr-8",
            )}
          >
            {/* Loading overlay */}
            {file.isUploading && (
              <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/30">
                <Loader2 size={20} className="animate-spin text-white" />
              </div>
            )}

            {/* Remove button */}
            {onRemove && !file.isUploading && (
              <button
                type="button"
                onClick={() => onRemove(file.id)}
                className={cn(
                  "absolute z-10 flex items-center justify-center rounded-full",
                  "bg-zinc-300 text-zinc-600 hover:bg-zinc-400",
                  "dark:bg-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-500",
                  "opacity-0 transition-opacity group-hover/file:opacity-100",
                  file.type.startsWith("image/")
                    ? "-right-1.5 -top-1.5 h-5 w-5"
                    : "right-1.5 top-1.5 h-5 w-5",
                )}
                aria-label={`Remove ${file.name}`}
              >
                <X size={12} />
              </button>
            )}

            {/* Image preview */}
            {file.type.startsWith("image/") ? (
              <div className="relative h-full w-full overflow-hidden rounded-xl">
                <Image
                  src={file.url}
                  alt={file.description || file.name}
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              </div>
            ) : (
              /* Non-image file preview */
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="flex-shrink-0">
                  {getFileIcon(file.type, file.name)}
                </div>
                <div className="flex min-w-0 flex-col">
                  <span className="truncate text-xs font-medium text-zinc-800 dark:text-zinc-200">
                    {file.name}
                  </span>
                  <span className="text-[10px] text-zinc-500 dark:text-zinc-400">
                    {getFormattedFileType(file.type, file.name)}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
