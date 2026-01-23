"use client";

import { useComposer } from "../composer-context";
import { MOOD_OPTIONS } from "../composer-constants";
import { cn } from "@/lib/utils";

interface MoodPickerProps {
  onSelect?: () => void;
}

export function MoodPicker({ onSelect }: MoodPickerProps) {
  const { mood, setMood } = useComposer();

  return (
    <div className="grid grid-cols-4 gap-1">
      {MOOD_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => {
            setMood(option.value);
            onSelect?.();
          }}
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
