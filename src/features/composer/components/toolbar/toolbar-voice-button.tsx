"use client";

import { VoiceInput } from "@/components/ui/voice-input";
import { useComposerForm } from "../../composer-context";

export function ToolbarVoiceButton() {
  const { insertAtCursor } = useComposerForm();

  return (
    <VoiceInput
      onTranscriptionComplete={(text) => insertAtCursor(text + " ")}
    />
  );
}
