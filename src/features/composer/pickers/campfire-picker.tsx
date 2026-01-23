"use client";

import { Flame, X } from "lucide-react";
import { useComposer } from "../composer-context";
import type { CampfireSelection } from "../composer-types";
import { cn } from "@/lib/utils";

interface CampfirePickerProps {
  onSelect?: () => void;
}

// Placeholder list — in production this would come from a query/prop
const PLACEHOLDER_CAMPFIRES: CampfireSelection[] = [];

export function CampfirePicker({ onSelect }: CampfirePickerProps) {
  const { campfire, setCampfire } = useComposer();

  const handleSelect = (c: CampfireSelection) => {
    setCampfire(c);
    onSelect?.();
  };

  const handleClear = () => {
    setCampfire(null);
    onSelect?.();
  };

  if (PLACEHOLDER_CAMPFIRES.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-4 text-center">
        <Flame size={20} className="text-muted-foreground" />
        <p className="text-xs text-muted-foreground">No campfires available</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-0.5">
      {campfire && (
        <button
          type="button"
          onClick={handleClear}
          className="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-muted-foreground hover:bg-accent"
        >
          <X size={14} />
          <span>Clear selection</span>
        </button>
      )}
      {PLACEHOLDER_CAMPFIRES.map((c) => (
        <button
          key={c.id}
          type="button"
          onClick={() => handleSelect(c)}
          className={cn(
            "flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-accent",
            campfire?.id === c.id && "bg-accent",
          )}
        >
          <Flame size={14} className="shrink-0 text-orange-500" />
          <span className="truncate">{c.name}</span>
        </button>
      ))}
    </div>
  );
}
