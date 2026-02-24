/**
 * Hook for fetching user's collections using the generated api-client.
 */

import {
  type GetApiV1AuthCollectionParams,
  type GetApiV1AuthCollectionSimpleParams,
  useGetApiV1AuthCollection,
  useGetApiV1AuthCollectionSimple,
} from "@/api-client";
import { useAuthHeaders } from "@/features/campfires/campfire-api-utils";
import { useAppStore } from "@/providers/app-store-provider";

interface UseCollectionsOptions {
  /** Use simple endpoint (no pagination meta, for sidebar/drawer) */
  simple?: boolean;
  /** Limit number of collections */
  limit?: number;
  /** Filter to pinned only */
  pinnedOnly?: boolean;
  /** Page number (for paginated mode) */
  page?: number;
  /** Page size (for paginated mode) */
  pageSize?: number;
  /** Whether query is enabled */
  enabled?: boolean;
}

export function useCollections(options: UseCollectionsOptions = {}) {
  const {
    simple = false,
    limit,
    pinnedOnly = false,
    page,
    pageSize,
    enabled = true,
  } = options;

  const session = useAppStore((s) => s.session);
  const authHeaders = useAuthHeaders(session.access_token);

  const params: GetApiV1AuthCollectionParams = {
    ...(limit !== undefined ? { limit: String(limit) } : {}),
    ...(pinnedOnly ? { pinned_only: "true" } : {}),
    ...(page !== undefined ? { page: String(page) } : {}),
    ...(pageSize !== undefined ? { page_size: String(pageSize) } : {}),
  };

  const simpleParams: GetApiV1AuthCollectionSimpleParams = {
    ...(limit !== undefined ? { limit: String(limit) } : {}),
    ...(pinnedOnly ? { pinned_only: "true" } : {}),
  };

  const fullQuery = useGetApiV1AuthCollection(params, {
    query: { enabled: enabled && !simple },
    fetch: authHeaders,
  });

  const simpleQuery = useGetApiV1AuthCollectionSimple(simpleParams, {
    query: { enabled: enabled && simple },
    fetch: authHeaders,
  });

  if (simple) {
    const responseData =
      simpleQuery.data?.status === 200 ? simpleQuery.data.data : undefined;
    return {
      ...simpleQuery,
      collections: responseData?.data ?? [],
    };
  }

  const responseData =
    fullQuery.data?.status === 200 ? fullQuery.data.data : undefined;
  return {
    ...fullQuery,
    collections: responseData?.data ?? [],
    meta: responseData?.meta,
  };
}
