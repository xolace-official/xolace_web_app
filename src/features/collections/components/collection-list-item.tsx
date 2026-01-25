"use client";

import { cn } from "@/lib/utils";
import { Check, Loader2, Pin, Star } from "lucide-react";
import type { CollectionListItem as CollectionListItemType } from "../collections.types";

interface CollectionListItemProps {
  collection: CollectionListItemType;
  onClick: () => void;
  isLoading?: boolean;
  isSelected?: boolean;
}

export function CollectionListItem({
  collection,
  onClick,
  isLoading = false,
  isSelected = false,
}: CollectionListItemProps) {
  const isFavorites = collection.name.toLowerCase() === "favorites";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLoading}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl px-4 py-3",
        "text-left transition-colors",
        "hover:bg-muted/50 active:bg-muted",
        "disabled:cursor-not-allowed disabled:opacity-50",
        isSelected && "bg-muted",
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
          isFavorites ? "bg-amber-500/10" : "bg-muted",
        )}
      >
        {isFavorites ? (
          <Star className="h-5 w-5 text-amber-500" />
        ) : collection.is_pinned ? (
          <Pin className="h-5 w-5 text-muted-foreground" />
        ) : (
          <span className="text-lg">
            {collection.name.charAt(0).toUpperCase()}
          </span>
        )}
      </div>

      {/* Name and count */}
      <div className="flex-1 min-w-0">
        <p className="truncate font-medium text-foreground">
          {collection.name}
        </p>
        <p className="text-sm text-muted-foreground">
          {collection.item_count}{" "}
          {collection.item_count === 1 ? "item" : "items"}
        </p>
      </div>

      {/* Status indicator */}
      <div className="shrink-0">
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        ) : isSelected ? (
          <Check className="h-5 w-5 text-primary" />
        ) : null}
      </div>
    </button>
  );
}
