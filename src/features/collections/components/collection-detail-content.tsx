"use client";

import { useRouter } from "next/navigation";
import { use, useMemo, useState } from "react";
import type { CollectionEntityType } from "@/features/collections";
import type {
  CollectionDetail,
  CollectionItemHydrated,
  HydratedPost,
  HydratedVideo,
  HydratedVoice,
} from "../collections.types";
import { CollectionHeader } from "./collection-header";
import { CollectionItemsList } from "./collection-items-list";
import {
  CollectionTypeFilter,
  type FilterOption,
} from "./collection-type-filter";

// Dummy data for development
const DUMMY_COLLECTION: CollectionDetail = {
  id: "col-1",
  name: "My Favorites",
  is_pinned: true,
  position: 0,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const DUMMY_ITEMS: CollectionItemHydrated[] = [
  {
    id: "item-1",
    entity_type: "post",
    entity_id: "post-1",
    is_pinned: false,
    position: 0,
    created_at: new Date().toISOString(),
    entity: {
      id: "post-1",
      content_text:
        "This is a sample post about something interesting that happened today. It's a longer piece of content to show how it would look in the collection.",
      author_id: "user-2",
      author_name_snapshot: "Anonymous User",
      author_avatar_snapshot: null,
      post_kind: "text",
      mood: "neutral",
      created_at: new Date(Date.now() - 86400000).toISOString(),
      upvotes_count: 42,
      downvotes_count: 3,
    } as HydratedPost,
  },
  {
    id: "item-2",
    entity_type: "post",
    entity_id: "post-2",
    is_pinned: true,
    position: 1,
    created_at: new Date().toISOString(),
    entity: {
      id: "post-2",
      content_text:
        "Another great post that I saved for later. This one has some really insightful thoughts about life and the universe.",
      author_id: "user-3",
      author_name_snapshot: "Mystery Person",
      author_avatar_snapshot: null,
      post_kind: "text",
      mood: "reflective",
      created_at: new Date(Date.now() - 172800000).toISOString(),
      upvotes_count: 128,
      downvotes_count: 7,
    } as HydratedPost,
  },
  {
    id: "item-3",
    entity_type: "video",
    entity_id: "video-1",
    is_pinned: false,
    position: 2,
    created_at: new Date().toISOString(),
    entity: {
      id: "video-1",
      bunny_video_id: "abc123",
      thumbnail_url: "https://picsum.photos/seed/vid1/640/360",
      duration_seconds: 180,
      title: "Late Night Thoughts",
      description: "A place to share your late night musings",
      author_profile_id: "user-4",
      author_display_name: "Night Owl",
      author_avatar_url: "https://picsum.photos/seed/avatar1/100/100",
      likes_count: 24,
      views_count: 156,
    } as HydratedVideo,
  },
  {
    id: "item-4",
    entity_type: "voice",
    entity_id: "voice-1",
    is_pinned: false,
    position: 3,
    created_at: new Date().toISOString(),
    entity: {
      id: "voice-1",
      content_text:
        "A voice recording about creative writing and storytelling techniques.",
      author_id: "user-5",
      author_name_snapshot: "Storyteller",
      author_avatar_snapshot: "https://picsum.photos/seed/avatar2/100/100",
      created_at: new Date(Date.now() - 345600000).toISOString(),
    } as HydratedVoice,
  },
  {
    id: "item-5",
    entity_type: "post",
    entity_id: "post-3",
    is_pinned: false,
    position: 4,
    created_at: new Date().toISOString(),
    entity: {
      id: "post-3",
      content_text:
        "Sometimes the best advice comes from strangers who have no stake in your decisions.",
      author_id: "user-6",
      author_name_snapshot: "Thoughtful Stranger",
      author_avatar_snapshot: null,
      post_kind: "text",
      mood: "wise",
      created_at: new Date(Date.now() - 432000000).toISOString(),
      upvotes_count: 256,
      downvotes_count: 12,
    } as HydratedPost,
  },
];

interface CollectionDetailContentProps {
  collectionId?: string;
  params: Promise<{ id: string }>;
}

export function CollectionDetailContent({
  params,
}: CollectionDetailContentProps) {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterOption>("all");
  const [unsavingId, setUnsavingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { id } = use(params);
  console.log("id: ", id);

  // Filter items based on selected filter
  const filteredItems = useMemo(() => {
    if (filter === "all") return DUMMY_ITEMS;
    return DUMMY_ITEMS.filter((item) => item.entity_type === filter);
  }, [filter]);

  const handleDelete = () => {
    if (
      window.confirm(
        "Are you sure you want to delete this collection? This action cannot be undone.",
      )
    ) {
      setIsDeleting(true);
      // Simulate deletion delay
      setTimeout(() => {
        router.push("/collections");
      }, 500);
    }
  };

  const handleUnsave = (item: {
    id: string;
    entity_type: CollectionEntityType;
    entity_id: string;
  }) => {
    setUnsavingId(item.id);
    // Simulate unsave delay
    setTimeout(() => {
      setUnsavingId(null);
    }, 500);
  };

  const handleLoadMore = () => {
    // No-op for dummy data
  };

  // Use dummy data
  const collection = DUMMY_COLLECTION;
  const items = filteredItems;
  const meta = { totalCount: DUMMY_ITEMS.length, hasNextPage: false };

  return (
    <div className="space-y-6">
      {/* Header */}
      <CollectionHeader
        collection={collection}
        itemCount={meta?.totalCount ?? items.length}
        onDelete={handleDelete}
        isDeleting={isDeleting}
      />

      {/* Filter */}
      <CollectionTypeFilter value={filter} onChange={setFilter} />

      {/* Items */}
      <CollectionItemsList
        items={items}
        onUnsave={handleUnsave}
        isUnsaving={unsavingId}
        isLoading={false}
        hasNextPage={meta?.hasNextPage}
        onLoadMore={handleLoadMore}
      />
    </div>
  );
}
