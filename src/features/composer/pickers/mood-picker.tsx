"use client";

import { useComposerForm } from "../composer-context";
import { MOOD_OPTIONS } from "../composer-constants";
import { cn } from "@/lib/utils";
import type { PostMood } from "../composer-types";

interface MoodPickerProps {
  onSelect?: () => void;
}

export function MoodPicker({ onSelect }: MoodPickerProps) {
  const { form } = useComposerForm();
  const mood = form.watch("mood");

  const handleSelect = (value: PostMood) => {
    form.setValue("mood", value);
    onSelect?.();
  };

  return (
    <div className="grid grid-cols-4 gap-1">
      {MOOD_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => handleSelect(option.value)}
          className={cn(
            "flex flex-col items-center gap-0.5 rounded-lg px-2 py-2 text-center transition-colors hover:bg-accent",
            mood === option.value && "bg-accent ring-1 ring-primary/20",
          )}
        >
          <span className="text-lg">{option.emoji}</span>
          <span className="text-[10px] leading-tight text-muted-foreground">
            {option.label}
          </span>
        </button>
      ))}
    </div>
  );
}
