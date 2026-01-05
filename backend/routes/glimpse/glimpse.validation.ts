import { z } from "@hono/zod-openapi";

// Enums
export const videoVisibilityEnum = z.enum([
  "public",
  "unlisted",
  "private",
  "moderated",
]);

export const glimpseFeedModeEnum = z.enum(["for_you", "featured", "newest"]);

/**
 * Glimpse feed items
 */

// Query
export const glimpseFeedQuery = z.object({
  mode: glimpseFeedModeEnum.default("for_you").openapi({
    param: { name: "mode", in: "query" },
    description: "Feed mode",
  }),

  search: z
    .string()
    .optional()
    .openapi({
      param: { name: "search", in: "query" },
      description: "Search by title or description",
    }),

  tag_ids: z
    .string()
    .optional()
    .transform((v) => v?.split(","))
    .openapi({
      param: { name: "tag_ids", in: "query" },
      description: "Comma-separated tag IDs",
      example: "1,4,9",
    }),

  author_profile_id: z
    .uuid()
    .optional()
    .openapi({
      param: { name: "author_profile_id", in: "query" },
      description: "Filter by author",
    }),

  min_duration: z.string().transform(Number).optional(),

  max_duration: z.string().transform(Number).optional(),

  page: z
    .string()
    .default("0")
    .transform(Number)
    .openapi({ param: { name: "page", in: "query" } }),

  page_size: z
    .string()
    .default("20")
    .transform(Number)
    .openapi({ param: { name: "page_size", in: "query" } }),
});

// schema
export const glimpseFeedItemSchema = z.object({
  id: z.uuid(),
  playback_url: z.string().url(),
  thumbnail_url: z.string().url(),
  duration_seconds: z.number().int(),

  title: z.string().nullable(),
  description: z.string().nullable(),

  author_profile_id: z.uuid(),
  author_display_name: z.string(),
  author_avatar_url: z.string(),

  likes_count: z.number().int(),
  views_count: z.number().int(),
  saves_count: z.number().int(),

  is_featured: z.boolean(),
  is_recommended: z.boolean(),

  published_at: z.string().nullable(),

  tags: z.array(z.string()),

  // video_tags
  //   video_tags: z.array(
  //     z.object({
  //       tag: z.object({
  //         name: z.string(),
  //       }),
  //     }),
  //   ),
});

/**
 * Response
 */

export const glimpseFeedResponse = z.object({
  data: z.array(glimpseFeedItemSchema),
  meta: z.object({
    totalCount: z.number().int(),
    currentPage: z.number().int(),
    pageSize: z.number().int(),
    hasNextPage: z.boolean(),
  }),
});
