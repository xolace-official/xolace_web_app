"use client";

import { FileText, Loader2, Trash2, Video, VolumeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDateTime, formatDuration } from "@/utils";
import type {
  CollectionEntityType,
  CollectionItemHydrated,
  HydratedPost,
  HydratedVideo,
  HydratedVoice,
} from "../collections.types";

interface CollectionItemsListProps {
  items: CollectionItemHydrated[];
  onUnsave?: (item: CollectionItemHydrated) => void;
  isUnsaving?: string | null;
  isLoading?: boolean;
  hasNextPage?: boolean;
  onLoadMore?: () => void;
}

export function CollectionItemsList({
  items,
  onUnsave,
  isUnsaving,
  isLoading = false,
  hasNextPage = false,
  onLoadMore,
}: CollectionItemsListProps) {
  if (items.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-sm text-muted-foreground">
          No items in this collection yet
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <CollectionItemCard
          key={item.id}
          item={item}
          onUnsave={onUnsave ? () => onUnsave(item) : undefined}
          isUnsaving={isUnsaving === item.id}
        />
      ))}

      {isLoading && (
        <div className="flex items-center justify-center py-6">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {hasNextPage && !isLoading && onLoadMore && (
        <Button variant="outline" className="w-full" onClick={onLoadMore}>
          Load more
        </Button>
      )}
    </div>
  );
}

// ============================================================================
// Item Card
// ============================================================================

interface CollectionItemCardProps {
  item: CollectionItemHydrated;
  onUnsave?: () => void;
  isUnsaving?: boolean;
}

function CollectionItemCard({
  item,
  onUnsave,
  isUnsaving = false,
}: CollectionItemCardProps) {
  // Handle missing entity (orphaned item)
  if (!item.entity) {
    return (
      <div className="rounded-lg border border-dashed bg-muted/50 p-4">
        <p className="text-sm text-muted-foreground">
          This item is no longer available
        </p>
      </div>
    );
  }

  return (
    <div className="group relative rounded-lg border bg-card p-4 transition-colors hover:bg-accent/50">
      <div className="flex gap-4">
        {/* Type icon */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
          <EntityTypeIcon type={item.entity_type} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <EntityContent entity={item.entity} type={item.entity_type} />
        </div>

        {/* Unsave button */}
        {onUnsave && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onUnsave}
            disabled={isUnsaving}
            className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
          >
            {isUnsaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4 text-muted-foreground" />
            )}
            <span className="sr-only">Remove from collection</span>
          </Button>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Helpers
// ============================================================================

function EntityTypeIcon({ type }: { type: CollectionEntityType }) {
  switch (type) {
    case "post":
      return <FileText className="h-5 w-5 text-muted-foreground" />;
    case "video":
      return <Video className="h-5 w-5 text-muted-foreground" />;
    case "voice":
      return <VolumeIcon className="h-5 w-5 text-muted-foreground" />;
    default:
      return <FileText className="h-5 w-5 text-muted-foreground" />;
  }
}

interface EntityContentProps {
  entity: CollectionItemHydrated["entity"];
  type: CollectionEntityType;
}

/**
 * Renders a compact preview of a collection entity for use in a list card.
 *
 * For `post` and `voice` types, displays the entity's `content_text` and a line with
 * the author's name snapshot and a formatted creation timestamp. For `video`, displays
 * the title (or "Untitled video" if missing), an optional description, and a line with
 * the author's display name and a formatted duration.
 *
 * @param entity - The hydrated entity to render; when falsy the component returns `null`
 * @param type - The collection entity type that determines which preview layout to render
 * @returns A JSX element containing the entity preview, or `null` if `entity` is falsy or the `type` is unsupported
 */
function EntityContent({ entity, type }: EntityContentProps) {
  if (!entity) return null;

  switch (type) {
    case "post":
    case "voice": {
      const post = entity as HydratedPost | HydratedVoice;
      return (
        <>
          <p className="text-sm text-foreground line-clamp-2">
            {post.content_text}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {post.author_name_snapshot} • {formatDateTime(post.created_at)}
          </p>
        </>
      );
    }

    case "video": {
      const video = entity as HydratedVideo;
      return (
        <>
          <p className="text-sm font-medium text-foreground line-clamp-1">
            {video.title || "Untitled video"}
          </p>
          {video.description && (
            <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
              {video.description}
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            {video.author_display_name} •{" "}
            {formatDuration(video.duration_seconds)}
          </p>
        </>
      );
    }

    default:
      return null;
  }
}
