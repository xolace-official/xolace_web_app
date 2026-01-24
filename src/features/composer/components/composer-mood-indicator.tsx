"use client";

import { useComposerForm } from "../composer-context";
import { MOOD_OPTIONS } from "../composer-constants";
import { Badge } from "@/components/ui/badge";

export function ComposerMoodIndicator() {
  const { form } = useComposerForm();
  const mood = form.watch("mood");

  if (mood === "neutral") return null;

  const moodOption = MOOD_OPTIONS.find((m) => m.value === mood);
  if (!moodOption) return null;

  return (
    <div className="px-4 pb-2">
      <Badge variant="secondary" className="gap-1 text-xs">
        <span>{moodOption.emoji}</span>
        <span>{moodOption.label}</span>
      </Badge>
    </div>
  );
}
