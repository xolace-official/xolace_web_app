"use client";

import { AlertTriangle, Clock } from "lucide-react";
import { useComposer } from "../composer-context";
import { cn } from "@/lib/utils";

export function PostToolsMenu() {
  const { isSensitive, setIsSensitive, autoExpiry, setAutoExpiry } =
    useComposer();

  return (
    <div className="flex flex-col gap-0.5">
      <button
        type="button"
        onClick={() => setIsSensitive(!isSensitive)}
        className={cn(
          "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm transition-colors hover:bg-accent/20",
          isSensitive && "bg-accent/20",
        )}
      >
        <AlertTriangle size={15} className="shrink-0 text-amber-500" />
        <div className="flex flex-1 flex-col">
          <span className="text-sm">Sensitive content</span>
          <span className="text-[11px] text-muted-foreground">
            Adds a content warning
          </span>
        </div>
        <div
          className={cn(
            "h-4 w-7 rounded-full transition-colors",
            isSensitive ? "bg-primary/20" : "bg-muted",
          )}
        >
          <div
            className={cn(
              "h-4 w-4 rounded-full border-2 bg-background transition-transform",
              isSensitive
                ? "translate-x-3 border-primary"
                : "translate-x-0 border-muted-foreground/30",
            )}
          />
        </div>
      </button>

      <button
        type="button"
        onClick={() => setAutoExpiry(!autoExpiry)}
        className={cn(
          "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm transition-colors hover:bg-accent/20",
          autoExpiry && "bg-accent/20",
        )}
      >
        <Clock size={15} className="shrink-0 text-blue-500" />
        <div className="flex flex-1 flex-col">
          <span className="text-sm">24-hour post</span>
          <span className="text-[11px] text-muted-foreground">
            Auto-deletes after 24h
          </span>
        </div>
        <div
          className={cn(
            "h-4 w-7 rounded-full transition-colors",
            autoExpiry ? "bg-primary/20" : "bg-muted",
          )}
        >
          <div
            className={cn(
              "h-4 w-4 rounded-full border-2 bg-background transition-transform",
              autoExpiry
                ? "translate-x-3 border-primary"
                : "translate-x-0 border-muted-foreground/30",
            )}
          />
        </div>
      </button>
    </div>
  );
}
