"use client";

import { useRouter } from "next/navigation";
import { use, useMemo, useState } from "react";
import type {
  DeleteApiV1AuthCollectionItemsBodyEntityType,
  GetApiV1AuthCollectionCollectionIdItemsEntityType,
} from "@/api-client";
import { PrimarySpinner } from "@/components/shared/loaders/primary-loader";
import type { CollectionItemHydrated } from "../collections.types";
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
  collectionId?: string;
  params: Promise<{ id: string }>;
}

export function CollectionDetailContent({
  params,
}: CollectionDetailContentProps) {
  const router = useRouter();
  const { id } = use(params);
  const [filter, setFilter] = useState<FilterOption>("all");
  const [page, setPage] = useState(0);

  const entityTypeFilter =
    filter === "all"
      ? undefined
      : (filter as GetApiV1AuthCollectionCollectionIdItemsEntityType);

  const {
    collection,
    items: rawItems,
    meta,
    isLoading,
  } = useCollectionItems({
    collectionId: id,
    entityType: entityTypeFilter,
    page,
  });

  const { mutate: deleteCollection, isPending: isDeleting } =
    useDeleteCollection({
      onSuccess: () => {
        router.push("/collections");
      },
    });

  const { mutate: unsaveItem, variables: unsavingVars } = useUnsaveItem();

  // The api-client entity type is `unknown | null`; cast to our hydrated type
  const items = rawItems as CollectionItemHydrated[];

  // Derive the currently-unsaving item id for UI feedback
  const unsavingId = useMemo(() => {
    if (!unsavingVars) return null;
    const match = items.find(
      (item) =>
        item.entity_type === unsavingVars.entity_type &&
        item.entity_id === unsavingVars.entity_id,
    );
    return match?.id ?? null;
  }, [unsavingVars, items]);

  const handleDelete = () => {
    deleteCollection(id);
  };

  const handleUnsave = (item: {
    id: string;
    entity_type: string;
    entity_id: string;
  }) => {
    unsaveItem({
      collection_id: id,
      entity_type:
        item.entity_type as DeleteApiV1AuthCollectionItemsBodyEntityType,
      entity_id: item.entity_id,
    });
  };

  const handleLoadMore = () => {
    if (meta?.hasNextPage) {
      setPage((prev) => prev + 1);
    }
  };

  // Reset page when filter changes
  const handleFilterChange = (newFilter: FilterOption) => {
    setFilter(newFilter);
    setPage(0);
  };

  if (isLoading && !collection) {
    return (
      <div className="flex items-center justify-center py-20">
        <PrimarySpinner />
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-sm text-muted-foreground">Collection not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CollectionHeader
        collection={collection}
        itemCount={meta?.totalCount ?? items.length}
        onDelete={handleDelete}
        isDeleting={isDeleting}
      />

      <CollectionTypeFilter value={filter} onChange={handleFilterChange} />

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
