/**
 * Collections API client functions
 */

import { COLLECTIONS_API_BASE } from "../collections.constants";
import type {
  CollectionItemsResponse,
  CollectionsResponse,
  CollectionsSimpleResponse,
  CreateCollectionBody,
  CreateCollectionResponse,
  GetCollectionItemsParams,
  GetCollectionsParams,
  SaveItemBody,
  SaveItemResponse,
  SuccessResponse,
  UnsaveItemBody,
} from "../collections.types";

// ============================================================================
// Helper
// ============================================================================

async function fetchWithAuth<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Request failed: ${res.status}`);
  }

  return res.json();
}

// ============================================================================
// Collection List APIs
// ============================================================================

export async function fetchCollections(
  params?: GetCollectionsParams,
): Promise<CollectionsResponse> {
  const searchParams = new URLSearchParams();

  if (params?.limit !== undefined) {
    searchParams.set("limit", String(params.limit));
  }
  if (params?.pinned_only) {
    searchParams.set("pinned_only", "true");
  }
  if (params?.page !== undefined) {
    searchParams.set("page", String(params.page));
  }
  if (params?.page_size !== undefined) {
    searchParams.set("page_size", String(params.page_size));
  }

  const queryString = searchParams.toString();
  const url = queryString
    ? `${COLLECTIONS_API_BASE}?${queryString}`
    : COLLECTIONS_API_BASE;

  return fetchWithAuth<CollectionsResponse>(url);
}

export async function fetchCollectionsSimple(
  limit?: number,
): Promise<CollectionsSimpleResponse> {
  const searchParams = new URLSearchParams();

  if (limit !== undefined) {
    searchParams.set("limit", String(limit));
  }

  const queryString = searchParams.toString();
  const url = queryString
    ? `${COLLECTIONS_API_BASE}/simple?${queryString}`
    : `${COLLECTIONS_API_BASE}/simple`;

  return fetchWithAuth<CollectionsSimpleResponse>(url);
}

// ============================================================================
// Collection Items API
// ============================================================================

export async function fetchCollectionItems(
  collectionId: string,
  params?: GetCollectionItemsParams,
): Promise<CollectionItemsResponse> {
  const searchParams = new URLSearchParams();

  if (params?.entity_type) {
    searchParams.set("entity_type", params.entity_type);
  }
  if (params?.page !== undefined) {
    searchParams.set("page", String(params.page));
  }
  if (params?.page_size !== undefined) {
    searchParams.set("page_size", String(params.page_size));
  }

  const queryString = searchParams.toString();
  const url = queryString
    ? `${COLLECTIONS_API_BASE}/${collectionId}/items?${queryString}`
    : `${COLLECTIONS_API_BASE}/${collectionId}/items`;

  return fetchWithAuth<CollectionItemsResponse>(url);
}

// ============================================================================
// Create Collection API
// ============================================================================

export async function createCollection(
  body: CreateCollectionBody,
): Promise<CreateCollectionResponse> {
  return fetchWithAuth<CreateCollectionResponse>(COLLECTIONS_API_BASE, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

// ============================================================================
// Save/Unsave Item APIs
// ============================================================================

export async function saveItem(body: SaveItemBody): Promise<SaveItemResponse> {
  return fetchWithAuth<SaveItemResponse>(`${COLLECTIONS_API_BASE}/items`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function unsaveItem(
  body: UnsaveItemBody,
): Promise<SuccessResponse> {
  return fetchWithAuth<SuccessResponse>(`${COLLECTIONS_API_BASE}/items`, {
    method: "DELETE",
    body: JSON.stringify(body),
  });
}

// ============================================================================
// Delete Collection API
// ============================================================================

export async function deleteCollection(
  collectionId: string,
): Promise<SuccessResponse> {
  return fetchWithAuth<SuccessResponse>(
    `${COLLECTIONS_API_BASE}/${collectionId}`,
    {
      method: "DELETE",
    },
  );
}
