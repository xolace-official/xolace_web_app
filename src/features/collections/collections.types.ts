/**
 * Collections feature types
 * Mirrors backend validation schemas from backend/routes/collection/collection.validation.ts
 */

// ============================================================================
// Enums
// ============================================================================

export type CollectionEntityType = "post" | "video" | "voice";

// ============================================================================
// Collection Types
// ============================================================================

export interface CollectionListItem {
  id: string;
  name: string;
  is_pinned: boolean;
  position: number;
  created_at: string;
  updated_at: string;
  item_count: number;
}

export interface CollectionDetail {
  id: string;
  name: string;
  is_pinned: boolean;
  position: number;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// Collection Item Types
// ============================================================================

export interface CollectionItemReference {
  id: string;
  entity_type: CollectionEntityType;
  entity_id: string;
  is_pinned: boolean;
  position: number;
  created_at: string;
}

// Hydrated entity types matching backend schemas
export interface HydratedPost {
  id: string;
  content_text: string;
  author_id: string;
  author_name_snapshot: string;
  author_avatar_snapshot: string | null;
  post_kind: string;
  mood: string;
  created_at: string;
  upvotes_count: number;
  downvotes_count: number;
}

export interface HydratedVideo {
  id: string;
  bunny_video_id: string;
  thumbnail_url: string;
  duration_seconds: number;
  title: string | null;
  description: string | null;
  author_profile_id: string;
  author_display_name: string;
  author_avatar_url: string;
  likes_count: number;
  views_count: number;
}

export interface HydratedVoice {
  id: string;
  content_text: string;
  author_id: string;
  author_name_snapshot: string;
  author_avatar_snapshot: string | null;
  created_at: string;
}

export type HydratedEntity = HydratedPost | HydratedVideo | HydratedVoice;

export interface CollectionItemHydrated {
  id: string;
  entity_type: CollectionEntityType;
  entity_id: string;
  is_pinned: boolean;
  position: number;
  created_at: string;
  entity: HydratedEntity | null;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface PaginationMeta {
  totalCount: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
}

export interface CollectionsResponse {
  data: CollectionListItem[];
  meta: PaginationMeta;
}

export interface CollectionsSimpleResponse {
  data: CollectionListItem[];
}

export interface CollectionItemsResponse {
  collection: CollectionDetail;
  data: CollectionItemHydrated[];
  meta: PaginationMeta;
}

// ============================================================================
// Request Body Types
// ============================================================================

export interface CreateCollectionBody {
  name: string;
  is_pinned?: boolean;
}

export interface CreateCollectionResponse {
  id: string;
  name: string;
  name_normalized: string;
  is_pinned: boolean;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface SaveItemBody {
  entity_type: CollectionEntityType;
  entity_id: string;
  collection_id?: string;
  collection_name?: string;
}

export interface SaveItemResponse {
  collection_item_id: string;
  collection_id: string;
  collection_name: string;
  is_new_collection: boolean;
  already_saved: boolean;
}

export interface UnsaveItemBody {
  collection_id: string;
  entity_type: CollectionEntityType;
  entity_id: string;
}

export interface SuccessResponse {
  message: string;
}

// ============================================================================
// Query Parameter Types
// ============================================================================

export interface GetCollectionsParams {
  limit?: number;
  pinned_only?: boolean;
  page?: number;
  page_size?: number;
}

export interface GetCollectionItemsParams {
  entity_type?: CollectionEntityType;
  page?: number;
  page_size?: number;
}
