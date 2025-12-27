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

export type ManageCampfireListItem = z.infer<
  typeof manageCampfireListItemSchema
>;
export type CampfireMembership = z.infer<typeof campfireMembershipSchema>;
export type ManageCampfiresQuery = z.infer<typeof manageCampfiresQuery>;
