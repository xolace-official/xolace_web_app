import { z } from "@hono/zod-openapi";

// ============================================================================
// Enums
// ============================================================================

/**
 * Supported entity types that can be saved to collections
 * Note: voice and campfire_resource are included for future support
 * but may not have tables yet in the database
 */
export const collectionEntityTypeEnum = z.enum(["post", "video", "voice"]);

// ============================================================================
// Base Field Schemas
// ============================================================================

const uuidSchema = z.uuid().openapi({ description: "UUID identifier" });
const timestampSchema = z.iso
  .datetime()
  .openapi({ description: "ISO 8601 timestamp" });

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
  entity_type: z.literal("campfire_resource"),
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
    .discriminatedUnion("entity_type", [
      hydratedPostSchema,
      hydratedVideoSchema,
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
// Create Collection Schemas
// ============================================================================

/**
 * Request body for creating a collection
 */
export const createCollectionBody = z.object({
  name: z
    .string()
    .min(1, "Collection name is required")
    .max(50, "Collection name must not exceed 50 characters")
    .openapi({
      description: "Name of the collection",
      example: "My Favorites",
    }),
  is_pinned: z.boolean().optional().default(false).openapi({
    description: "Whether to pin the collection",
    example: false,
  }),
});

/**
 * Response for created collection
 */
export const createCollectionResponse = z.object({
  id: uuidSchema,
  name: z.string(),
  name_normalized: z.string(),
  is_pinned: z.boolean(),
  position: z.number().int(),
  created_at: timestampSchema,
  updated_at: timestampSchema,
});

// ============================================================================
// Save Item to Collection Schemas
// ============================================================================

/**
 * Request body for saving an item to a collection
 * Supports three modes:
 * 1. collection_id provided - save to specific collection
 * 2. collection_name provided - find or create collection by name
 * 3. Neither provided - save to "Favorites" (auto-created if needed)
 */
export const saveItemBody = z
  .object({
    entity_type: collectionEntityTypeEnum.openapi({
      description: "Type of entity to save",
      example: "post",
    }),
    entity_id: uuidSchema.openapi({
      description: "ID of the entity to save",
    }),
    collection_id: uuidSchema.optional().openapi({
      description:
        "ID of target collection (mutually exclusive with collection_name)",
    }),
    collection_name: z.string().min(1).max(50).optional().openapi({
      description:
        "Name of target collection - will create if not exists (mutually exclusive with collection_id)",
      example: "Reading List",
    }),
  })
  .superRefine((data, ctx) => {
    if (data.collection_id && data.collection_name) {
      ctx.addIssue({
        code: "custom",
        message:
          "Cannot provide both collection_id and collection_name. Please provide only one.",
        path: ["collection_id"],
      });
      ctx.addIssue({
        code: "custom",
        message:
          "Cannot provide both collection_id and collection_name. Please provide only one.",
        path: ["collection_name"],
      });
    }
  });

/**
 * Response for save item operation
 */
export const saveItemResponse = z.object({
  collection_item_id: uuidSchema,
  collection_id: uuidSchema,
  collection_name: z.string(),
  is_new_collection: z.boolean(),
  already_saved: z.boolean(),
});

// ============================================================================
// Unsave Item from Collection Schemas
// ============================================================================

/**
 * Request body for removing an item from a collection
 */
export const unsaveItemBody = z.object({
  collection_id: uuidSchema.openapi({
    description: "ID of the collection",
  }),
  entity_type: collectionEntityTypeEnum.openapi({
    description: "Type of entity to remove",
    example: "post",
  }),
  entity_id: uuidSchema.openapi({
    description: "ID of the entity to remove",
  }),
});

/**
 * Generic success response
 */
export const successResponse = z.object({
  message: z.string(),
});

// ============================================================================
// Delete Collection Schemas
// ============================================================================

/**
 * Path params for delete collection
 */
export const deleteCollectionParams = z.object({
  collectionId: uuidSchema.openapi({
    param: {
      name: "collectionId",
      in: "path",
    },
    description: "Collection ID to delete",
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
export type CreateCollectionBody = z.infer<typeof createCollectionBody>;
export type SaveItemBody = z.infer<typeof saveItemBody>;
export type UnsaveItemBody = z.infer<typeof unsaveItemBody>;
