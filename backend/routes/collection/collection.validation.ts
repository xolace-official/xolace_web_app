import { z } from "@hono/zod-openapi";

// ============================================================================
// Enums
// ============================================================================

/**
 * Supported entity types that can be saved to collections
 * Note: voice and campfire_resource are included for future support
 * but may not have tables yet in the database
 */
export const collectionEntityTypeEnum = z.enum([
  "post",
  "video",
  "voice",
  "campfire_resource",
]);

// ============================================================================
// Base Field Schemas
// ============================================================================

const uuidSchema = z.uuid();
const timestampSchema = z.iso.datetime();

// ============================================================================
// Collection Schemas
// ============================================================================

/**
 * Single collection item for list display
 */
export const collectionListItemSchema = z.object({
  id: uuidSchema,
  name: z.string().min(1).max(50),
  is_pinned: z.boolean(),
  position: z.number().int(),
  created_at: timestampSchema,
  updated_at: timestampSchema,
  item_count: z.number().int().min(0),
});

/**
 * Query params for fetching collections
 */
export const getCollectionsQuery = z.object({
  limit: z
    .string()
    .optional()
    .transform((v) => (v ? Number(v) : undefined))
    .openapi({
      param: { name: "limit", in: "query" },
      description:
        "Maximum number of collections to return. Used for sidebar preview (e.g., 5). Omit for all.",
      example: "5",
    }),

  pinned_only: z
    .string()
    .optional()
    .transform((v) => v === "true")
    .openapi({
      param: { name: "pinned_only", in: "query" },
      description: "Return only pinned collections",
      example: "true",
    }),

  page: z
    .string()
    .default("0")
    .transform(Number)
    .openapi({
      param: { name: "page", in: "query" },
      example: "0",
    }),

  page_size: z
    .string()
    .default("20")
    .transform(Number)
    .openapi({
      param: { name: "page_size", in: "query" },
      example: "20",
    }),
});

/**
 * Response for collections list (paginated)
 */
export const collectionsResponse = z.object({
  data: z.array(collectionListItemSchema),
  meta: z.object({
    totalCount: z.number().int(),
    currentPage: z.number().int(),
    pageSize: z.number().int(),
    hasNextPage: z.boolean(),
  }),
});

/**
 * Response for collections list (simple, limited)
 */
export const collectionsSimpleResponse = z.object({
  data: z.array(collectionListItemSchema),
});

// ============================================================================
// Collection Items Schemas
// ============================================================================

/**
 * Path params for collection items endpoint
 */
export const getCollectionItemsParams = z.object({
  collectionId: uuidSchema.openapi({
    param: {
      name: "collectionId",
      in: "path",
    },
    description: "Collection ID",
  }),
});

/**
 * Query params for fetching collection items
 */
export const getCollectionItemsQuery = z.object({
  entity_type: collectionEntityTypeEnum.optional().openapi({
    param: { name: "entity_type", in: "query" },
    description: "Filter by entity type",
  }),

  page: z
    .string()
    .default("0")
    .transform(Number)
    .openapi({
      param: { name: "page", in: "query" },
      example: "0",
    }),

  page_size: z
    .string()
    .default("20")
    .transform(Number)
    .openapi({
      param: { name: "page_size", in: "query" },
      example: "20",
    }),
});

/**
 * Collection item reference (raw, before hydration)
 */
export const collectionItemReferenceSchema = z.object({
  id: uuidSchema,
  entity_type: collectionEntityTypeEnum,
  entity_id: uuidSchema,
  is_pinned: z.boolean(),
  position: z.number().int(),
  created_at: timestampSchema,
});

// ============================================================================
// Hydrated Entity Schemas (for response)
// Matches actual database schema
// ============================================================================

/**
 * Hydrated post entity
 * Based on actual posts table schema
 */
export const hydratedPostSchema = z.object({
  id: uuidSchema,
  content_text: z.string(),
  author_id: uuidSchema,
  author_name_snapshot: z.string(),
  author_avatar_snapshot: z.string().nullable(),
  post_kind: z.string(),
  mood: z.string(),
  created_at: timestampSchema,
  upvotes_count: z.number().int(),
  downvotes_count: z.number().int(),
});

/**
 * Hydrated video entity (glimpse)
 * Based on actual videos table schema
 */
export const hydratedVideoSchema = z.object({
  id: uuidSchema,
  bunny_video_id: z.string(),
  thumbnail_url: z.string(),
  duration_seconds: z.number().int(),
  title: z.string().nullable(),
  description: z.string().nullable(),
  author_profile_id: uuidSchema,
  author_display_name: z.string(),
  author_avatar_url: z.string(),
  likes_count: z.number().int(),
  views_count: z.number().int(),
});

/**
 * Hydrated voice entity (placeholder for future)
 * Voice posts are stored as posts with post_kind = 'voice'
 */
export const hydratedVoiceSchema = z.object({
  id: uuidSchema,
  content_text: z.string(),
  author_id: uuidSchema,
  author_name_snapshot: z.string(),
  author_avatar_snapshot: z.string().nullable(),
  created_at: timestampSchema,
});

/**
 * Hydrated campfire resource entity
 * Using campfire_guide_resources table
 */
export const hydratedCampfireResourceSchema = z.object({
  id: z.number().int(),
  label: z.string(),
  url: z.string().nullable(),
  campfire_id: uuidSchema,
  sort_order: z.number().int(),
});

/**
 * Collection item with hydrated entity
 * The entity field is a union type based on entity_type
 */
export const collectionItemHydratedSchema = z.object({
  id: uuidSchema,
  entity_type: collectionEntityTypeEnum,
  entity_id: uuidSchema,
  is_pinned: z.boolean(),
  position: z.number().int(),
  created_at: timestampSchema,
  entity: z
    .union([
      hydratedPostSchema,
      hydratedVideoSchema,
      hydratedVoiceSchema,
      hydratedCampfireResourceSchema,
    ])
    .nullable(),
});

/**
 * Collection detail (metadata)
 */
export const collectionDetailSchema = z.object({
  id: uuidSchema,
  name: z.string(),
  is_pinned: z.boolean(),
  position: z.number().int(),
  created_at: timestampSchema,
  updated_at: timestampSchema,
});

/**
 * Response for collection items (paginated with hydrated entities)
 */
export const collectionItemsResponse = z.object({
  collection: collectionDetailSchema,
  data: z.array(collectionItemHydratedSchema),
  meta: z.object({
    totalCount: z.number().int(),
    currentPage: z.number().int(),
    pageSize: z.number().int(),
    hasNextPage: z.boolean(),
  }),
});

// ============================================================================
// Type Exports
// ============================================================================

export type CollectionListItem = z.infer<typeof collectionListItemSchema>;
export type GetCollectionsQuery = z.infer<typeof getCollectionsQuery>;
export type GetCollectionItemsQuery = z.infer<typeof getCollectionItemsQuery>;
export type CollectionItemReference = z.infer<
  typeof collectionItemReferenceSchema
>;
export type CollectionItemHydrated = z.infer<
  typeof collectionItemHydratedSchema
>;
export type CollectionEntityType = z.infer<typeof collectionEntityTypeEnum>;
