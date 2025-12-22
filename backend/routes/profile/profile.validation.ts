import { z } from "@hono/zod-openapi";

// ============================================================================
// Base Schemas - Reusable field definitions
// ============================================================================

const usernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(30, "Username must not exceed 30 characters")
  .regex(
    /^[a-zA-Z0-9_-]{3,30}$/,
    "Username can only contain letters, numbers, hyphens, and underscores",
  )
  .nullable();

const avatarUrlSchema = z.string().nullable().default("default_profile.png");

const themeSchema = z.string().nullable();

const configSchema = z.string().nullable(); // Could be JSON string

const countryCodeSchema = z
  .string()
  .length(2, "Country code must be exactly 2 characters")
  .toUpperCase()
  .nullable();

const locationTextSchema = (fieldName: string, maxLength: number) =>
  z
    .string()
    .max(maxLength, `${fieldName} must not exceed ${maxLength} characters`)
    .nullable();

const accountStateSchema = z
  .enum(["active", "suspended", "banned", "deleted", "pending"])
  .default("active");

// ============================================================================
// Public Profile Schemas
// ============================================================================

export const publicProfileSchema = z.object({
  id: z.uuid().openapi({
    description: "User's unique ID — references Supabase Auth user ID",
  }),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
  username: usernameSchema,
  avatar_url: avatarUrlSchema,
  is_anonymous: z.boolean().default(false),
  is_verified_badge: z.boolean().default(false),
  reputation_score: z.number().int().min(0).default(0),
  theme: themeSchema,
  config: configSchema,
});

export const publicProfileResponse = publicProfileSchema.openapi({
  description: "Public profile information visible to all users",
});

// ============================================================================
// Private Profile Schemas
// ============================================================================

export const privateProfileSchema = z.object({
  user_id: z.uuid(),
  consent_version: z.number().int().min(0).default(0),
  has_consented: z.boolean().default(false),
  location_country_code: countryCodeSchema,
  location_region: locationTextSchema("Region", 100),
  location_city: locationTextSchema("City", 100),
});

export const privateProfileResponse = privateProfileSchema.openapi({
  description: "Private profile information - only visible to the user",
});

// ============================================================================
// Combined Profile Schema (Public + Private)
// ============================================================================

export const fullProfileSchema = z.object({
  // Public fields
  id: z.uuid(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
  username: usernameSchema,
  avatar_url: avatarUrlSchema,
  is_anonymous: z.boolean(),
  is_verified_badge: z.boolean(),
  reputation_score: z.number().int().min(0),
  theme: themeSchema,
  config: configSchema,

  // Private fields (nested or flattened - your choice)
  email: z.email().nullable(),
  consent_version: z.number().int().min(0),
  has_consented: z.boolean(),
  account_state: accountStateSchema,
  restricted_reason: z.string().nullable(),
  restricted_until: z.iso.datetime().nullable(),
  location_country_code: countryCodeSchema,
  location_region: locationTextSchema("Region", 100),
  location_city: locationTextSchema("City", 100),
});

export const fullProfileResponse = fullProfileSchema.openapi({
  description: "Complete profile with both public and private information",
});

// Alternative: Nested structure for combined profile
export const nestedFullProfileSchema = z.object({
  public: publicProfileSchema.omit({
    id: true,
    created_at: true,
    updated_at: true,
  }),
  private: privateProfileSchema,
  // Common fields at root level
  id: z.uuid(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
});

// ============================================================================
// Update Schemas (Partial updates)
// ============================================================================

export const updatePublicProfileBody = z
  .object({
    username: usernameSchema.optional(),
    avatar_url: avatarUrlSchema.optional(),
    theme: themeSchema.optional(),
    config: configSchema.optional(),
    // is_anonymous, is_verified_badge, reputation_score are typically not user-editable
  })
  .openapi({
    description:
      "Public profile update - all fields optional for partial updates",
  });

export const updatePrivateProfileBody = z
  .object({
    location_country_code: countryCodeSchema.optional(),
    location_region: locationTextSchema("Region", 100).optional(),
    location_city: locationTextSchema("City", 100).optional(),
    has_consented: z.boolean().optional(),
    // email, account_state, restricted_* typically managed by system
  })
  .openapi({
    description:
      "Private profile update - all fields optional for partial updates",
  });

// ============================================================================
// Create Schemas (Initial profile creation)
// ============================================================================

export const createPublicProfileBody = z.object({
  username: usernameSchema.optional(),
  avatar_url: avatarUrlSchema.optional(),
  theme: themeSchema.optional(),
  config: configSchema.optional(),
  is_anonymous: z.boolean().optional().default(false),
});

export const createPrivateProfileBody = z.object({
  email: z.email().nullable().optional(),
  has_consented: z.boolean().default(false),
  location_country_code: countryCodeSchema.optional(),
  location_region: locationTextSchema("Region", 100).optional(),
  location_city: locationTextSchema("City", 100).optional(),
});

// ============================================================================
// Query Parameters
// ============================================================================

export const profileQueryParams = z.object({
  include_private: z
    .string()
    .transform((val) => val === "true")
    .optional()
    .openapi({
      description: "Include private profile data (only works for own profile)",
      param: { name: "include_private", in: "query" },
    }),
});

// ============================================================================
// Type Exports
// ============================================================================

export type PublicProfile = z.infer<typeof publicProfileSchema>;
export type PrivateProfile = z.infer<typeof privateProfileSchema>;
export type FullProfile = z.infer<typeof fullProfileSchema>;
export type UpdatePublicProfileBody = z.infer<typeof updatePublicProfileBody>;
export type UpdatePrivateProfileBody = z.infer<typeof updatePrivateProfileBody>;
export type CreatePublicProfileBody = z.infer<typeof createPublicProfileBody>;
export type CreatePrivateProfileBody = z.infer<typeof createPrivateProfileBody>;
