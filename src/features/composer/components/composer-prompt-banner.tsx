"use client";

import { Lightbulb, X } from "lucide-react";
import { useComposer } from "../composer-context";

export function ComposerPromptBanner() {
  const { activePrompt, dismissPrompt, applyPrompt } = useComposer();

  if (!activePrompt) return null;

  return (
    <div className="mb-3 flex items-center gap-2 rounded-xl bg-muted/50 px-3 py-2.5">
      <Lightbulb size={14} className="shrink-0 text-muted-foreground" />
      <button
        type="button"
        onClick={() => applyPrompt(activePrompt)}
        className="flex-1 text-left text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        {activePrompt}
      </button>
      <button
        type="button"
        onClick={dismissPrompt}
        className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Dismiss prompt"
      >
        <X size={14} />
      </button>
    </div>
  );
}
