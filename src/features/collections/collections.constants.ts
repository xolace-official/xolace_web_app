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
