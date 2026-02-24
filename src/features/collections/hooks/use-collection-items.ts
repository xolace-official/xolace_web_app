/**
 * Hook for fetching items in a collection using the generated api-client.
 */

import {
  type GetApiV1AuthCollectionCollectionIdItemsEntityType,
  useGetApiV1AuthCollectionCollectionIdItems,
} from "@/api-client";
import { useAuthHeaders } from "@/features/campfires/campfire-api-utils";
import { useAppStore } from "@/providers/app-store-provider";

interface UseCollectionItemsOptions {
  collectionId: string;
  entityType?: GetApiV1AuthCollectionCollectionIdItemsEntityType;
  page?: number;
  pageSize?: number;
  enabled?: boolean;
}

export function useCollectionItems({
  collectionId,
  entityType,
  page,
  pageSize,
  enabled = true,
}: UseCollectionItemsOptions) {
  const session = useAppStore((s) => s.session);
  const authHeaders = useAuthHeaders(session.access_token);

  const params = {
    ...(entityType ? { entity_type: entityType } : {}),
    ...(page !== undefined ? { page: String(page) } : {}),
    ...(pageSize !== undefined ? { page_size: String(pageSize) } : {}),
  };

  const query = useGetApiV1AuthCollectionCollectionIdItems(
    collectionId,
    params,
    {
      query: { enabled: enabled && !!collectionId },
      fetch: authHeaders,
    },
  );

  const responseData = query.data?.status === 200 ? query.data.data : undefined;

  return {
    ...query,
    collection: responseData?.collection,
    items: responseData?.data ?? [],
    meta: responseData?.meta,
  };
}
