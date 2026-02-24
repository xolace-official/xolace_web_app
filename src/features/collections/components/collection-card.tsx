"use client";

import { Pin, Star } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { CollectionListItem } from "../collections.types";

interface CollectionCardProps {
  collection: CollectionListItem;
  className?: string;
}

export function CollectionCard({ collection, className }: CollectionCardProps) {
  const isFavorites = collection.name.toLowerCase() === "favorites";

  return (
    <Link
      href={`/collections/${collection.id}`}
      className={cn(
        "group relative flex flex-col rounded-xl border bg-card p-4",
        "transition-colors hover:bg-accent/50",
        className,
      )}
    >
      {/* Pinned indicator */}
      {collection.is_pinned && (
        <div className="absolute top-3 right-3">
          <Pin className="h-4 w-4 text-muted-foreground" />
        </div>
      )}

      {/* Icon */}
      <div
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-lg mb-3",
          isFavorites ? "bg-amber-500/10" : "bg-muted",
        )}
      >
        {isFavorites ? (
          <Star className="h-6 w-6 text-amber-500" />
        ) : (
          <span className="text-xl font-medium text-foreground">
            {collection.name.charAt(0).toUpperCase()}
          </span>
        )}
      </div>

      {/* Name */}
      <h3 className="font-medium text-foreground truncate mb-1">
        {collection.name}
      </h3>

      {/* Item count */}
      <p className="text-sm text-muted-foreground">
        {collection.item_count} {collection.item_count === 1 ? "item" : "items"}
      </p>
    </Link>
  );
}
