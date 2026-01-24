"use client";

import { useWatch } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { MOOD_OPTIONS } from "../composer-constants";
import { useComposerForm } from "../composer-context";

export function ComposerMoodIndicator() {
  const { form } = useComposerForm();
  const mood = useWatch({ control: form.control, name: "mood" });

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
