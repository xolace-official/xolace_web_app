import { z } from "@hono/zod-openapi";

// ============================================================================
// Base Schemas - Reusable field definitions
// ============================================================================

const uuidSchema = z.uuid();
const timestampSchema = z.iso.datetime();

// ============================================================================
// Enums
// ============================================================================

export const postKindEnum = z.enum([
  "text",
  "text_with_media",
  "carousel",
  "voice",
]);

export const postMoodEnum = z.enum([
  "neutral",
  "sad",
  "anxious",
  "happy",
  "angry",
  "hopeful",
  "confused",
  "grateful",
]);

export const authorDisplayModeEnum = z.enum([
  "attributed",
  "anonymous",
  "pseudonymous",
]);

export const postMediaTypeEnum = z.enum(["image", "video", "audio"]);

// ============================================================================
// Get Campfire Posts - Request Schemas
// ============================================================================

export const getCampfirePostsParamsSchema = z.object({
  campfireId: uuidSchema.openapi({
    param: {
      name: "campfireId",
      in: "path",
    },
    description: "Campfire ID to fetch posts for",
  }),
});

export const getCampfirePostsQuerySchema = z.object({
  cursor: z.iso
    .datetime()
    .optional()
    .openapi({
      param: { name: "cursor", in: "query" },
      description:
        "Cursor for pagination (ISO timestamp of last post's created_at)",
    }),

  limit: z
    .string()
    .default("20")
    .transform(Number)
    .pipe(z.number().int().min(1).max(50))
    .openapi({
      param: { name: "limit", in: "query" },
      description: "Number of posts to fetch (max 50)",
      example: "20",
    }),
});

// ============================================================================
// Get Campfire Posts - Response Schemas
// ============================================================================

export const postAuthorSchema = z.object({
  id: uuidSchema,
  name: z.string(),
  avatar_url: z.string().nullable(),
  display_mode: authorDisplayModeEnum,
});

export const postMediaSchema = z.object({
  id: uuidSchema,
  type: postMediaTypeEnum,
  storage_path: z.string(),
  mime_type: z.string(),
  width: z.number().int().nullable(),
  height: z.number().int().nullable(),
  blurhash: z.string().nullable(),
  dominant_hex: z.string().nullable(),
  alt_text: z.string().nullable(),
  sort_order: z.number().int(),
});

export const postCampfireSchema = z.object({
  id: uuidSchema,
  name: z.string(),
  slug: z.string(),
  icon_path: z.string().nullable(),
});

export const postMetricsSchema = z.object({
  upvotes: z.number().int(),
  downvotes: z.number().int(),
  score: z.number().int(),
  comments_count: z.number().int(),
});

export const postItemSchema = z.object({
  id: uuidSchema,
  content_text: z.string(),
  post_kind: postKindEnum,
  mood: postMoodEnum,
  is_sensitive: z.boolean(),

  author: postAuthorSchema,
  campfire: postCampfireSchema.nullable(),
  media: z.array(postMediaSchema),
  metrics: postMetricsSchema,

  created_at: timestampSchema,
  expires_at: timestampSchema.nullable(),
});

export const getCampfirePostsMetaSchema = z.object({
  campfire_id: uuidSchema,
  has_more: z.boolean(),
  next_cursor: z.string().datetime().nullable(),
});

export const getCampfirePostsResponse = z.object({
  data: z.array(postItemSchema),
  meta: getCampfirePostsMetaSchema,
});

// ============================================================================
// Type Exports
// ============================================================================

export type PostKind = z.infer<typeof postKindEnum>;
export type PostMood = z.infer<typeof postMoodEnum>;
export type AuthorDisplayMode = z.infer<typeof authorDisplayModeEnum>;
export type PostMediaType = z.infer<typeof postMediaTypeEnum>;

export type PostAuthor = z.infer<typeof postAuthorSchema>;
export type PostMedia = z.infer<typeof postMediaSchema>;
export type PostCampfire = z.infer<typeof postCampfireSchema>;
export type PostMetrics = z.infer<typeof postMetricsSchema>;
export type PostItem = z.infer<typeof postItemSchema>;

export type GetCampfirePostsParams = z.infer<
  typeof getCampfirePostsParamsSchema
>;
export type GetCampfirePostsQuery = z.infer<typeof getCampfirePostsQuerySchema>;
export type GetCampfirePostsResponse = z.infer<typeof getCampfirePostsResponse>;
