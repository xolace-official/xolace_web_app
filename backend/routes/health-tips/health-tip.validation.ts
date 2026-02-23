import { z } from "@hono/zod-openapi";

// Health tip publication state
export const healthTipStatusEnum = z.enum([
  "draft",
  "in_review",
  "published",
  "rejected",
  "archived",
]);

// Sensitivity level (used for feed filtering + UI gating)
export const healthTipSensitivityEnum = z.enum([
  "general",
  "mild",
  "sensitive",
]);

// Content format
export const healthTipContentFormatEnum = z.enum([
  "markdown",
  "html",
  "plaintext",
]);

// Source type (for sources table later)
export const healthTipSourceTypeEnum = z.enum([
  "url",
  "paper",
  "book",
  "organization",
]);

export const healthTipSponsorSchema = z.object({
  is_sponsored: z.boolean(),
  sponsor_label: z.string().nullable(),
});

// -----------------------------------------------------------------------------
// Base field validators
// -----------------------------------------------------------------------------

const uuidSchema = z.uuid();

const slugSchema = z
  .string()
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Slug must be lowercase, kebab-case, URL-safe",
  );

const languageCodeSchema = z.string().min(2).max(5).default("en").openapi({
  example: "en",
  description: "ISO language code (e.g. en, en-US)",
});

// const nullableText = (max: number) =>
//   z.string().max(max).nullable();

const timestampSchema = z.iso.datetime().nullable();

const positiveIntSchema = z.number().int().min(1);

// -----------------------------------------------------------------------------
// Author (safe public shape)
// -----------------------------------------------------------------------------

export const healthTipAuthorSchema = z.object({
  id: uuidSchema,
  username: z.string().nullable(),
  avatar_url: z.url().nullable(),
});

// -----------------------------------------------------------------------------
// Tag (feed-safe versions)
// -----------------------------------------------------------------------------

export const healthTipTagSchema = z.object({
  name: z.string(),
});

// -----------------------------------------------------------------------------
// Health tip category (public)
// -----------------------------------------------------------------------------

export const healthTipCategorySchema = z.object({
  key: z.string().openapi({
    example: "stress",
    description: "Stable category key used for filtering and routing",
  }),

  display_name: z.string().openapi({
    example: "Stress",
    description: "Human-readable category name",
  }),
});

export const healthTipCategoriesResponse = z.object({
  data: z.array(healthTipCategorySchema),
});

// -----------------------------------------------------------------------------
// Health tip source / evidence
// -----------------------------------------------------------------------------

export const healthTipSourceSchema = z.object({
  id: uuidSchema,

  source_type: healthTipSourceTypeEnum,

  title: z.string().nullable(),

  url: z.string().url().nullable(),

  publisher: z.string().nullable(),

  published_year: z
    .number()
    .int()
    .min(1900)
    .max(new Date().getFullYear())
    .nullable(),

  notes: z.string().nullable(),
});

export const healthTipSourcesResponse = z.object({
  data: z.array(healthTipSourceSchema),
});

// -----------------------------------------------------------------------------
// Health Tip feed item
// -----------------------------------------------------------------------------

export const healthTipFeedItemSchema = z.object({
  id: uuidSchema,
  title: z.string(),
  excerpt: z.string().nullable(),
  slug: slugSchema,

  category: healthTipCategorySchema.nullable(),

  tags: z.array(healthTipTagSchema),

  read_time_minutes: positiveIntSchema,

  published_at: timestampSchema,

  is_sponsored: z.boolean(),
  sponsor_label: z.string().nullable(),

  sensitive_level: healthTipSensitivityEnum,
});

// -----------------------------------------------------------------------------
// Health Tip feed response
// -----------------------------------------------------------------------------

export const healthTipsFeedResponse = z.object({
  data: z.array(healthTipFeedItemSchema),
});

export const healthTipsFeedPaginatedResponse = z.object({
  data: z.array(healthTipFeedItemSchema),
  meta: z.object({
    totalCount: z.number().int(),
    currentPage: z.number().int(),
    pageSize: z.number().int(),
    hasNextPage: z.boolean(),
  }),
});

// -----------------------------------------------------------------------------
// Health tip detail response
// -----------------------------------------------------------------------------

export const healthTipDetailSchema = z.object({
  id: uuidSchema,
  title: z.string(),
  slug: slugSchema,

  excerpt: z.string().nullable(),

  content: z.string(),
  content_format: z.string(),

  read_time_minutes: z.number().int().min(1),

  language_code: z.string(),

  published_at: timestampSchema,

  sensitive_level: z.enum(["general", "mild", "sensitive"]),

  category: healthTipCategorySchema.nullable(),

  tags: z.array(healthTipTagSchema),

  author: healthTipAuthorSchema.nullable(),

  sponsor: healthTipSponsorSchema,
});

// -----------------------------------------------------------------------------
// Health tips feed query
// -----------------------------------------------------------------------------

export const healthTipsFeedQuery = z.object({
  category: z
    .string()
    .optional()
    .openapi({
      param: { name: "category", in: "query" },
      description: "Filter by category key",
      example: "sleep",
    }),

  sensitivity: healthTipSensitivityEnum.optional().openapi({
    param: { name: "sensitivity", in: "query" },
    description: "Filter by sensitivity level",
    example: "general",
  }),

  query: z
    .string()
    .max(200)
    .optional()
    .openapi({
      param: { name: "query", in: "query" },
      description: "Search title and excerpt (case-insensitive partial match)",
      example: "anxiety",
    }),

  tag: z
    .array(z.string())
    .optional()
    .openapi({
      param: { name: "tag", in: "query" },
      description: "Filter by one or more tag slugs",
      example: ["anxiety", "burnout"],
    }),

  language: languageCodeSchema.optional().openapi({
    param: { name: "language", in: "query" },
    description: "Filter by language",
    example: "en",
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
    .refine((v) => v >= 1 && v <= 50, {
      message: "page_size must be between 1 and 50",
    })
    .openapi({
      param: { name: "page_size", in: "query" },
      example: "20",
    }),
});

export type HealthTipFeedItem = z.infer<typeof healthTipFeedItemSchema>;

export type HealthTipsFeedQuery = z.infer<typeof healthTipsFeedQuery>;

export type HealthTipDetail = z.infer<typeof healthTipDetailSchema>;
