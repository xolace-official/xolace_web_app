"use client";

import { MoreHorizontal, Pin, PinOff, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { CollectionDetail } from "../collections.types";

interface CollectionHeaderProps {
  collection: CollectionDetail;
  itemCount: number;
  onDelete?: () => void;
  onTogglePin?: () => void;
  isDeleting?: boolean;
}

export function CollectionHeader({
  collection,
  itemCount,
  onDelete,
  onTogglePin,
  isDeleting = false,
}: CollectionHeaderProps) {
  const isFavorites = collection.name.toLowerCase() === "favorites";

  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-center gap-4 min-w-0">
        {/* Icon */}
        <div
          className={cn(
            "flex h-14 w-14 shrink-0 items-center justify-center rounded-xl",
            isFavorites ? "bg-amber-500/10" : "bg-muted",
          )}
        >
          {isFavorites ? (
            <Star className="h-7 w-7 text-amber-500" />
          ) : (
            <span className="text-2xl font-medium text-foreground">
              {collection.name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        {/* Title and count */}
        <div className="min-w-0">
          <h1 className="text-xl font-semibold text-foreground truncate">
            {collection.name}
          </h1>
          <p className="text-sm text-muted-foreground">
            {itemCount} {itemCount === 1 ? "item" : "items"}
            {collection.is_pinned && (
              <span className="ml-2 inline-flex items-center gap-1">
                <Pin className="h-3 w-3" />
                Pinned
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Actions */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="shrink-0">
            <MoreHorizontal className="h-5 w-5" />
            <span className="sr-only">Collection options</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {onTogglePin && (
            <DropdownMenuItem onClick={onTogglePin}>
              {collection.is_pinned ? (
                <>
                  <PinOff className="mr-2 h-4 w-4" />
                  Unpin collection
                </>
              ) : (
                <>
                  <Pin className="mr-2 h-4 w-4" />
                  Pin collection
                </>
              )}
            </DropdownMenuItem>
          )}

          {onDelete && (
            <>
              {onTogglePin && <DropdownMenuSeparator />}
              <DropdownMenuItem
                onClick={onDelete}
                disabled={isDeleting}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {isDeleting ? "Deleting..." : "Delete collection"}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
