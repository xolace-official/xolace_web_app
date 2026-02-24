/**
 * Hook for fetching items in a collection with infinite scrolling.
 *
 * Uses useInfiniteQuery directly (rather than the generated infinite hook)
 * because the Orval-generated queryFn does not inject pageParam into the
 * request params – we need the page to advance with each fetch.
 */

import { useInfiniteQuery } from "@tanstack/react-query";
import {
  type GetApiV1AuthCollectionCollectionIdItemsEntityType,
  getApiV1AuthCollectionCollectionIdItems,
  getGetApiV1AuthCollectionCollectionIdItemsQueryKey,
} from "@/api-client";
import { useAuthHeaders } from "@/features/campfires/campfire-api-utils";
import { useAppStore } from "@/providers/app-store-provider";

interface UseCollectionItemsOptions {
  collectionId: string;
  entityType?: GetApiV1AuthCollectionCollectionIdItemsEntityType;
  pageSize?: number;
  enabled?: boolean;
}

export function useCollectionItems({
  collectionId,
  entityType,
  pageSize,
  enabled = true,
}: UseCollectionItemsOptions) {
  const session = useAppStore((s) => s.session);
  const authHeaders = useAuthHeaders(session.access_token);

  const baseParams = {
    ...(entityType ? { entity_type: entityType } : {}),
    ...(pageSize !== undefined ? { page_size: String(pageSize) } : {}),
  };

  const query = useInfiniteQuery({
    queryKey: [
      ...getGetApiV1AuthCollectionCollectionIdItemsQueryKey(
        collectionId,
        baseParams,
      ),
      "infinite",
    ],
    queryFn: async ({ pageParam, signal }) => {
      const params = { ...baseParams, page: String(pageParam) };
      const response = await getApiV1AuthCollectionCollectionIdItems(
        collectionId,
        params,
        { signal, ...authHeaders },
      );
      return response;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (lastPage.status !== 200) return undefined;
      const meta = lastPage.data.meta;
      return meta.hasNextPage ? meta.currentPage + 1 : undefined;
    },
    enabled: enabled && !!collectionId,
  });

  // Flatten all pages into a single items array and extract collection/meta
  const firstPage =
    query.data?.pages[0]?.status === 200 ? query.data.pages[0].data : undefined;

  const lastRaw = query.data?.pages[query.data.pages.length - 1];
  const lastPage = lastRaw?.status === 200 ? lastRaw.data : undefined;

  const items =
    query.data?.pages.flatMap((page) =>
      page.status === 200 ? page.data.data : [],
    ) ?? [];

  return {
    ...query,
    collection: firstPage?.collection,
    items,
    meta: lastPage?.meta,
  };
}
