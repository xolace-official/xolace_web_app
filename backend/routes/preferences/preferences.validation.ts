import { z } from "@hono/zod-openapi";

// ============================================================================
// Response Schema
// ============================================================================

export const preferencesResponseSchema = z.object({
  user_id: z.uuid(),
  theme: z.enum(["system", "light", "dark"]).default("system"),
  preferred_language: z.string().default("en"),
  sensitive_content_mode: z.enum(["show", "blur", "hide"]).default("blur"),
  loading_experience: z
    .enum(["none", "breathing", "affirmation"])
    .default("none"),
  notifications_enabled: z.boolean().default(true),
  push_enabled: z.boolean().default(true),
  guided_tour_enabled: z.boolean().default(true),
  auto_save_drafts: z.boolean().default(false),
  daily_prompt_enabled: z.boolean().default(true),
  allow_anonymous_replies: z.boolean().default(false),
  mark_sensitive_by_default: z.boolean().default(false),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
});

export const preferencesResponse = preferencesResponseSchema.openapi({
  description: "User preferences",
});

// ============================================================================
// Update Schema (partial)
// ============================================================================

export const updatePreferencesBody = z
  .object({
    theme: z.enum(["system", "light", "dark"]).optional(),
    preferred_language: z.string().optional(),
    sensitive_content_mode: z.enum(["show", "blur", "hide"]).optional(),
    loading_experience: z.enum(["none", "breathing", "affirmation"]).optional(),
    notifications_enabled: z.boolean().optional(),
    push_enabled: z.boolean().optional(),
    guided_tour_enabled: z.boolean().optional(),
    auto_save_drafts: z.boolean().optional(),
    daily_prompt_enabled: z.boolean().optional(),
    allow_anonymous_replies: z.boolean().optional(),
    mark_sensitive_by_default: z.boolean().optional(),
  })
  .openapi({
    description:
      "User preferences update - all fields optional for partial updates",
  });

// ============================================================================
// Type Exports
// ============================================================================

export type PreferencesResponse = z.infer<typeof preferencesResponseSchema>;
export type UpdatePreferencesBody = z.infer<typeof updatePreferencesBody>;
