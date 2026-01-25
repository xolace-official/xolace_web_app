/**
 * Hook for fetching items in a collection
 */

import { useQuery } from "@tanstack/react-query";
import { COLLECTION_KEYS } from "../collections.constants";
import { fetchCollectionItems } from "../lib/collections-api";
import type { CollectionEntityType } from "../collections.types";

interface UseCollectionItemsOptions {
  collectionId: string;
  entityType?: CollectionEntityType;
  page?: number;
  pageSize?: number;
  enabled?: boolean;
}

export function useCollectionItems({
  collectionId,
  entityType,
  page = 0,
  pageSize = 20,
  enabled = true,
}: UseCollectionItemsOptions) {
  return useQuery({
    queryKey: COLLECTION_KEYS.items(collectionId, {
      entityType,
      page,
      pageSize,
    }),
    queryFn: () =>
      fetchCollectionItems(collectionId, {
        entity_type: entityType,
        page,
        page_size: pageSize,
      }),
    enabled: enabled && !!collectionId,
  });
}
