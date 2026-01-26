"use client";

import { Button } from "@/components/ui/button";
import type { CollectionEntityType } from "@/features/collections";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useCollectionItems } from "../hooks/use-collection-items";
import { useDeleteCollection } from "../hooks/use-delete-collection";
import { useUnsaveItem } from "../hooks/use-unsave-item";
import { CollectionHeader } from "./collection-header";
import { CollectionItemsList } from "./collection-items-list";
import {
  CollectionTypeFilter,
  type FilterOption,
} from "./collection-type-filter";

interface CollectionDetailContentProps {
  collectionId: string;
}

export function CollectionDetailContent({
  collectionId,
}: CollectionDetailContentProps) {
  const router = useRouter();
  const [filter, setFilter] = React.useState<FilterOption>("all");
  const [page, setPage] = React.useState(0);
  const [unsavingId, setUnsavingId] = React.useState<string | null>(null);

  const entityTypeFilter: CollectionEntityType | undefined =
    filter === "all" ? undefined : filter;

  const { data, isLoading, isError } = useCollectionItems({
    collectionId,
    entityType: entityTypeFilter,
    page,
  });

  const { mutate: deleteCollection, isPending: isDeleting } =
    useDeleteCollection({
      onSuccess: () => {
        router.push("/collections");
      },
    });

  const { mutate: unsaveItem } = useUnsaveItem({
    onSuccess: () => {
      setUnsavingId(null);
    },
    onError: () => {
      setUnsavingId(null);
    },
  });

  const handleDelete = () => {
    if (
      window.confirm(
        "Are you sure you want to delete this collection? This action cannot be undone.",
      )
    ) {
      deleteCollection(collectionId);
    }
  };

  const handleUnsave = (item: {
    id: string;
    entity_type: CollectionEntityType;
    entity_id: string;
  }) => {
    setUnsavingId(item.id);
    unsaveItem({
      collection_id: collectionId,
      entity_type: item.entity_type,
      entity_id: item.entity_id,
    });
  };

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  // Reset page when filter changes
  React.useEffect(() => {
    setPage(0);
  }, [filter]);

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-sm text-muted-foreground mb-4">
          Collection not found or you don't have access to it.
        </p>
        <Button asChild variant="outline">
          <Link href="/collections">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Collections
          </Link>
        </Button>
      </div>
    );
  }

  if (isLoading && !data) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const collection = data?.collection;
  const items = data?.data ?? [];
  const meta = data?.meta;

  if (!collection) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-sm text-muted-foreground">Collection not found</p>
      </div>
    );
  }

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
        isLoading={isLoading}
        hasNextPage={meta?.hasNextPage}
        onLoadMore={handleLoadMore}
      />
    </div>
  );
}
