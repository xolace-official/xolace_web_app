"use client";

import { FolderOpen, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CollectionEmptyStateProps {
  onCreateClick?: () => void;
}

export function CollectionEmptyState({
  onCreateClick,
}: CollectionEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
        <FolderOpen className="h-8 w-8 text-muted-foreground" />
      </div>

      <h3 className="text-lg font-semibold text-foreground mb-2">
        No collections yet
      </h3>

      <p className="text-sm text-muted-foreground mb-6 max-w-sm">
        Save posts, videos, and more to collections to easily find them later.
      </p>

      {onCreateClick && (
        <Button onClick={onCreateClick}>
          <Plus className="mr-2 h-4 w-4" />
          Create your first collection
        </Button>
      )}
    </div>
  );
}
