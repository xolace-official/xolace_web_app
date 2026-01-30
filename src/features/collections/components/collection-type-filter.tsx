"use client";

import { cn } from "@/lib/utils";
import type { CollectionEntityType } from "../collections.types";

type FilterOption = CollectionEntityType | "all";

interface CollectionTypeFilterProps {
  value: FilterOption;
  onChange: (value: FilterOption) => void;
}

const OPTIONS: { value: FilterOption; label: string }[] = [
  { value: "all", label: "All" },
  { value: "post", label: "Posts" },
  { value: "video", label: "Videos" },
  { value: "voice", label: "Voice" },
];

export function CollectionTypeFilter({
  value,
  onChange,
}: CollectionTypeFilterProps) {
  return (
    <div className="flex gap-1 p-1 bg-muted rounded-lg">
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
            value === option.value
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export type { FilterOption };
