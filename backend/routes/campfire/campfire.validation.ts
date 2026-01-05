import { z } from "@hono/zod-openapi";

// ============================================================================
// Base Schemas - Reusable field definitions
// ============================================================================

/**
 * Campfire enum schema
 */

export const campfireVisibilityEnum = z.enum(["public", "private"]);

export const campfireRoleEnum = z.enum(["firestarter", "firekeeper", "camper"]);

export const campfireMemberStatusEnum = z.enum([
  "approved",
  "pending",
  "rejected",
  "banned",
]);

/**
 * Campfire Base field validators
 */
const uuidSchema = z.uuid();

const slugSchema = z
  .string()
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Slug must be lowercase, URL-safe, kebab-case",
  );

const campfireNameSchema = z
  .string()
  .min(3, "Campfire name must be at least 3 characters")
  .max(50, "Campfire name must not exceed 50 characters");

const nullableText = (max: number) => z.string().max(max).nullable();

const timestampSchema = z.iso.datetime();

// Manage Campfire list item response (for the manage campfires list endpoint)
export const manageCampfireListItemSchema = z.object({
  id: uuidSchema,
  name: campfireNameSchema,
  slug: slugSchema,
  description: nullableText(500),
  member_count: z.number().int().min(0),
  icon_path: z.string().nullable(),
  visibility: campfireVisibilityEnum,
});

// This is the actual row returned per campfire.
export const campfireMembershipSchema = z.object({
  campfire_id: uuidSchema,
  role: campfireRoleEnum,
  joined_at: timestampSchema,
  is_favorite: z.boolean(),

  campfire: manageCampfireListItemSchema,
});

export const manageCampfiresResponse = z.object({
  data: z.array(campfireMembershipSchema),
});

export const manageCampfiresPaginatedResponse = z.object({
  data: z.array(campfireMembershipSchema),
  meta: z.object({
    totalCount: z.number().int(),
    currentPage: z.number().int(),
    pageSize: z.number().int(),
    hasNextPage: z.boolean(),
  }),
});

export const manageCampfiresQuery = z.object({
  favorites_only: z
    .string()
    .transform((v) => v === "true")
    .optional()
    .openapi({
      param: { name: "favorites_only", in: "query" },
      description: "Return only favorite campfires",
      example: "true",
    }),

  visibility: campfireVisibilityEnum.optional().openapi({
    param: { name: "visibility", in: "query" },
    description: "Filter by campfire visibility",
  }),

  role: campfireRoleEnum.optional().openapi({
    param: { name: "role", in: "query" },
    description: "Filter by user role in campfire",
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

export const discoveryCampfiresQuery = z.object({
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

  realm_id: z
    .uuid()
    .optional()
    .openapi({
      param: { name: "realm_id", in: "query" },
      description: "Filter by realm ID",
    }),

  lane_id: z
    .string()
    .uuid()
    .optional()
    .openapi({
      param: { name: "lane_id", in: "query" },
      description: "Filter by lane ID",
    }),

  search: z
    .string()
    .optional()
    .openapi({
      param: { name: "search", in: "query" },
      description: "Search by name or description",
    }),

  sort: z
    .enum(["popular", "newest", "alphabetical"])
    .default("popular")
    .openapi({
      param: { name: "sort", in: "query" },
      description: "Sort order",
      example: "popular",
    }),
});

export const discoverCampfireItemSchema = z.object({
  id: uuidSchema,
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  icon_path: z.string().nullable(),
  member_count: z.number().int(),
  interaction_style: z.enum(["support", "discussion", "guided", "creative"]),
});

export const discoveryCampfiresResponse = z.object({
  data: z.array(discoverCampfireItemSchema),
  meta: z.object({
    totalCount: z.number().int(),
    currentPage: z.number().int(),
    pageSize: z.number().int(),
    hasNextPage: z.boolean(),
  }),
});

export const batchMembershipBody = z.object({
  campfire_ids: z
    .array(uuidSchema)
    .max(100)
    .openapi({ description: "List of campfire IDs to check membership for" }),
});

export const batchMembershipResponse = z.record(
  z.string(),
  z
    .object({
      role: campfireRoleEnum,
      status: campfireMemberStatusEnum,
      is_favorite: z.boolean(),
      joined_at: timestampSchema,
    })
    .nullable(),
);

export const batchCampfireMembershipResponse = z.object({
  memberships: z.record(z.string(), z.boolean()),
});

// -----------------------------------------------------------------------------
// Realm item
// -----------------------------------------------------------------------------

export const campfireRealmSchema = z.object({
  id: uuidSchema,
  key: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  sort_order: z.number().int(),
  is_high_safety: z.boolean().nullable(),
});

// -----------------------------------------------------------------------------
// Response
// -----------------------------------------------------------------------------

export const campfireRealmsResponse = z.object({
  data: z.array(campfireRealmSchema),
});

// -----------------------------------------------------------------------------
// Lane item
// -----------------------------------------------------------------------------

export const getCampfireLanesQuerySchema = z.object({
  realmId: z.uuid(),
  activeOnly: z
    .string()
    .optional()
    .transform((v) => v === "true"),
});

export const campfireLaneSchema = z.object({
  id: uuidSchema,
  realm_id: uuidSchema,
  key: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  sort_order: z.number().int(),
  is_high_safety: z.boolean().nullable(),
});

// -----------------------------------------------------------------------------
// Response
// -----------------------------------------------------------------------------

export const campfireLanesResponse = z.object({
  data: z.array(campfireLaneSchema),
});

// -----------------------------------------------------------------------------
// Membership item
// -----------------------------------------------------------------------------

export const getCampfireMembershipParamsSchema = z.object({
  campfireId: z.uuid().openapi({
    param: {
      name: "campfireId",
      in: "path",
    },
    description: "Campfire ID",
  }),
});

export const campfireMembershipDetailSchema = z.object({
  is_member: z.boolean(),
  role: campfireRoleEnum.nullable(),
  status: campfireMemberStatusEnum.nullable(),
  is_favorite: z.boolean(),
  joined_at: timestampSchema.nullable(),
});

// -----------------------------------------------------------------------------
// Response
// -----------------------------------------------------------------------------

export const campfireMembershipDetailResponse = z.object({
  data: campfireMembershipDetailSchema,
});

export type ManageCampfireListItem = z.infer<
  typeof manageCampfireListItemSchema
>;
export type CampfireMembership = z.infer<typeof campfireMembershipSchema>;
export type ManageCampfiresQuery = z.infer<typeof manageCampfiresQuery>;
export type DiscoveryCampfiresQuery = z.infer<typeof discoveryCampfiresQuery>;
export type BatchMembershipBody = z.infer<typeof batchMembershipBody>;
export type BatchMembershipResponse = z.infer<typeof batchMembershipResponse>;
export type BatchCampfireMembershipResponse = z.infer<
  typeof batchCampfireMembershipResponse
>;
