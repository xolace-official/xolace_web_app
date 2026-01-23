"use client";

import { ToolbarImageButton } from "./toolbar-image-button";
import { ToolbarMoodButton } from "./toolbar-mood-button";
import { ToolbarEmojiButton } from "./toolbar-emoji-button";
import { ToolbarVoiceButton } from "./toolbar-voice-button";
import { ToolbarCampfireButton } from "./toolbar-campfire-button";
import { ToolbarMoreButton } from "./toolbar-more-button";

export function ComposerToolbar() {
  return (
    <div className="flex items-center gap-0.5 border-t px-2 py-1.5">
      <ToolbarImageButton />
      <ToolbarMoodButton />
      <ToolbarEmojiButton />
      <ToolbarVoiceButton />
      <ToolbarCampfireButton />
      <div className="ml-auto">
        <ToolbarMoreButton />
      </div>
    </div>
  );
}
