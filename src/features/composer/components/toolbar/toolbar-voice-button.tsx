"use client";

import { VoiceInput } from "@/components/ui/voice-input";
import { useComposer } from "../../composer-context";

export function ToolbarVoiceButton() {
  const { insertAtCursor } = useComposer();

  return (
    <VoiceInput
      onTranscriptionComplete={(text) => insertAtCursor(text + " ")}
    />
  );
}
