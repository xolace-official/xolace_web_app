"use client";

import { useCallback } from "react";
import { useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CONTENT_MAX_LENGTH, CONTENT_MIN_LENGTH } from "../composer-constants";
import { useComposerForm } from "../composer-context";

function CharCounter() {
  const { form } = useComposerForm();
  const contentText = useWatch({ control: form.control, name: "content_text" });
  const charCount = contentText.length;

  return (
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
  );
}

function SubmitButton() {
  const { form } = useComposerForm();
  const contentText = useWatch({ control: form.control, name: "content_text" });
  const isSubmitting = form.formState.isSubmitting;
  const isValid = contentText.length >= CONTENT_MIN_LENGTH && !isSubmitting;

  return (
    <Button
      type="submit"
      size="sm"
      disabled={!isValid || isSubmitting}
      className="min-w-[80px]"
    >
      {isSubmitting ? "Posting..." : "Post"}
    </Button>
  );
}

function DisplayModeToggle() {
  const { form } = useComposerForm();
  const displayMode = useWatch({
    control: form.control,
    name: "author_display_mode",
  });

  const toggleDisplayMode = useCallback(() => {
    const current = form.getValues("author_display_mode");
    form.setValue(
      "author_display_mode",
      current === "attributed" ? "anonymous" : "attributed",
    );
  }, [form]);

  return (
    <button
      type="button"
      onClick={toggleDisplayMode}
      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
    >
      {displayMode === "anonymous" ? "Anonymous" : "Public"}
    </button>
  );
}

export function ComposerFooter() {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="flex items-center gap-3">
        <CharCounter />
        <DisplayModeToggle />
      </div>
      <SubmitButton />
    </div>
  );
}
