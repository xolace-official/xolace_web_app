/**
 * Hook for fetching user's collections
 */

import { useQuery } from "@tanstack/react-query";
import {
  COLLECTION_KEYS,
  DEFAULT_SIDEBAR_LIMIT,
} from "../collections.constants";
import {
  fetchCollections,
  fetchCollectionsSimple,
} from "../lib/collections-api";
import type { GetCollectionsParams } from "../collections.types";

interface UseCollectionsOptions {
  /** Use simple endpoint (no pagination meta, for sidebar/drawer) */
  simple?: boolean;
  /** Limit number of collections (for simple mode) */
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
    limit = DEFAULT_SIDEBAR_LIMIT,
    pinnedOnly = false,
    page = 0,
    pageSize = 20,
    enabled = true,
  } = options;

  return useQuery({
    queryKey: simple ? COLLECTION_KEYS.simple() : COLLECTION_KEYS.lists(),
    queryFn: () => {
      if (simple) {
        return fetchCollectionsSimple(limit);
      }

      const params: GetCollectionsParams = {
        page,
        page_size: pageSize,
      };

      if (pinnedOnly) {
        params.pinned_only = true;
      }

      return fetchCollections(params);
    },
    enabled,
  });
}
