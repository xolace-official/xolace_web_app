/**
 * Collections feature constants
 */

// ============================================================================
// API Configuration
// ============================================================================

export const COLLECTIONS_API_BASE = "/api/v1/auth/collection";

// ============================================================================
// Query Keys
// ============================================================================

export const COLLECTION_KEYS = {
  all: ["collections"] as const,
  lists: () => [...COLLECTION_KEYS.all, "list"] as const,
  simple: () => [...COLLECTION_KEYS.all, "simple"] as const,
  detail: (id: string) => [...COLLECTION_KEYS.all, "detail", id] as const,
  items: (id: string, filters?: Record<string, unknown>) =>
    [...COLLECTION_KEYS.all, "items", id, filters] as const,
};

// ============================================================================
// Defaults
// ============================================================================

export const DEFAULT_PAGE_SIZE = 20;
export const DEFAULT_SIDEBAR_LIMIT = 10;
export const MAX_COLLECTION_NAME_LENGTH = 50;

// ============================================================================
// Drawer Steps
// ============================================================================

export const DRAWER_STEPS = {
  SELECT: "select",
  CREATE: "create",
} as const;

export type DrawerStep = (typeof DRAWER_STEPS)[keyof typeof DRAWER_STEPS];

// ============================================================================
// Dummy Data (for development/demo)
// ============================================================================

import type { CollectionListItem } from "./collections.types";

export const DUMMY_COLLECTIONS: CollectionListItem[] = [
  {
    id: "1",
    name: "Favorites",
    is_pinned: true,
    position: 0,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    item_count: 12,
  },
  {
    id: "2",
    name: "Read Later",
    is_pinned: true,
    position: 1,
    created_at: "2024-01-02T00:00:00Z",
    updated_at: "2024-01-02T00:00:00Z",
    item_count: 5,
  },
  {
    id: "3",
    name: "Inspiration",
    is_pinned: false,
    position: 2,
    created_at: "2024-01-03T00:00:00Z",
    updated_at: "2024-01-03T00:00:00Z",
    item_count: 23,
  },
  {
    id: "4",
    name: "Work Ideas",
    is_pinned: false,
    position: 3,
    created_at: "2024-01-04T00:00:00Z",
    updated_at: "2024-01-04T00:00:00Z",
    item_count: 8,
  },
  {
    id: "5",
    name: "Music",
    is_pinned: false,
    position: 4,
    created_at: "2024-01-05T00:00:00Z",
    updated_at: "2024-01-05T00:00:00Z",
    item_count: 0,
  },
];
