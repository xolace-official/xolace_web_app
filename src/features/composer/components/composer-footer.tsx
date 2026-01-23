"use client";

import { Button } from "@/components/ui/button";
import { useComposer } from "../composer-context";
import { CONTENT_MAX_LENGTH, CONTENT_MIN_LENGTH } from "../composer-constants";
import { cn } from "@/lib/utils";

export function ComposerFooter() {
  const { charCount, isValid, displayMode, setDisplayMode, form } =
    useComposer();

  const isSubmitting = form.formState.isSubmitting;

  return (
    <div className="flex items-center justify-between px-4 py-3">
      {/* Character counter */}
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "text-xs tabular-nums",
            charCount === 0
              ? "text-muted-foreground"
              : charCount < CONTENT_MIN_LENGTH
                ? "text-amber-500"
                : charCount > CONTENT_MAX_LENGTH * 0.9
                  ? "text-destructive"
                  : "text-muted-foreground",
          )}
        >
          {charCount}/{CONTENT_MAX_LENGTH}
        </span>

        {/* Display mode toggle */}
        <button
          type="button"
          onClick={() =>
            setDisplayMode(
              displayMode === "attributed" ? "anonymous" : "attributed",
            )
          }
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {displayMode === "anonymous" ? "Anonymous" : "Public"}
        </button>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        size="sm"
        disabled={!isValid || isSubmitting}
        className="min-w-[80px]"
      >
        {isSubmitting ? "Posting..." : "Post"}
      </Button>
    </div>
  );
}
