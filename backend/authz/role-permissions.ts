import { PERMISSIONS, type Permission } from "./permissions";

/**
 * Role → Permission mapping
 *
 * - Additive only
 * - No conditional logic
 * - No status or verification checks here
 */

export type GlobalRole =
  | "admin"
  | "platform_moderator"
  | "support_agent"
  | "professional"
  | "mentor";

export const ROLE_PERMISSIONS: Record<GlobalRole, readonly Permission[]> = {
  // ─────────────────────────────────────────────
  // Admin (platform owner / core team)
  // ─────────────────────────────────────────────
  admin: [
    // Moderation
    PERMISSIONS.MODERATION_REVIEW_REPORTS,
    PERMISSIONS.MODERATION_TAKE_ACTION,
    PERMISSIONS.MODERATION_VIEW_AUDIT_LOGS,

    // Content control
    PERMISSIONS.POSTS_DELETE_ANY,
    PERMISSIONS.POSTS_EDIT_ANY,
    PERMISSIONS.POSTS_HIDE_ANY,
    PERMISSIONS.COMMENTS_DELETE_ANY,
    PERMISSIONS.COMMENTS_HIDE_ANY,

    // Campfires
    PERMISSIONS.CAMPFIRES_CREATE_FEATURED,
    PERMISSIONS.CAMPFIRES_ARCHIVE_ANY,

    // Platform control
    PERMISSIONS.ROLES_ASSIGN,
    PERMISSIONS.ROLES_REVOKE,
    PERMISSIONS.ACCOUNT_STATUS_UPDATE,
    PERMISSIONS.VERIFICATION_UPDATE,

    // Support
    PERMISSIONS.SUPPORT_VIEW_USER_CONTEXT,
    PERMISSIONS.SUPPORT_IMPERSONATE_USER,
  ],

  // ─────────────────────────────────────────────
  // Platform Moderator (trust & safety)
  // ─────────────────────────────────────────────
  platform_moderator: [
    // Moderation only
    PERMISSIONS.MODERATION_REVIEW_REPORTS,
    PERMISSIONS.MODERATION_TAKE_ACTION,

    // Content control (no role management)
    PERMISSIONS.POSTS_DELETE_ANY,
    PERMISSIONS.POSTS_HIDE_ANY,
    PERMISSIONS.COMMENTS_DELETE_ANY,
    PERMISSIONS.COMMENTS_HIDE_ANY,
  ],

  // ─────────────────────────────────────────────
  // Support Agent (non-moderation)
  // ─────────────────────────────────────────────
  support_agent: [
    PERMISSIONS.SUPPORT_VIEW_USER_CONTEXT,

    // NOTE:
    // Impersonation is powerful — intentionally NOT granted here by default
    // Can be added later if absolutely necessary
  ],

  // ─────────────────────────────────────────────
  // Professional (care provider)
  // ─────────────────────────────────────────────
  professional: [
    PERMISSIONS.CARE_RESPOND_AS_PROFESSIONAL,
    PERMISSIONS.CARE_ACCESS_PRO_DASHBOARD,
  ],

  // ─────────────────────────────────────────────
  // Mentor
  // ─────────────────────────────────────────────
  mentor: [PERMISSIONS.MENTOR_RESPOND_AS_MENTOR],
};
