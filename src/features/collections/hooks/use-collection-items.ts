/**
 * Hook for fetching items in a collection with infinite scrolling.
 *
 * Uses the Orval-generated infinite hook and overrides its queryFn so that
 * pageParam is forwarded as the `page` search-param on every fetch.
 */

import {
  type GetApiV1AuthCollectionCollectionIdItemsEntityType,
  getApiV1AuthCollectionCollectionIdItems,
  useGetApiV1AuthCollectionCollectionIdItemsInfinite,
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

  const query = useGetApiV1AuthCollectionCollectionIdItemsInfinite(
    collectionId,
    baseParams,
    {
      query: {
        enabled: enabled && !!collectionId,
        initialPageParam: 0,
        getNextPageParam: (lastPage) => {
          if (lastPage.status !== 200) return undefined;
          const meta = lastPage.data.meta;
          return meta.hasNextPage ? meta.currentPage + 1 : undefined;
        },
        // Override the generated queryFn so pageParam is forwarded as `page`
        queryFn: async ({ pageParam, signal }) => {
          const params = { ...baseParams, page: String(pageParam) };
          return getApiV1AuthCollectionCollectionIdItems(collectionId, params, {
            signal,
            ...authHeaders,
          });
        },
      },
      fetch: authHeaders,
    },
  );

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
