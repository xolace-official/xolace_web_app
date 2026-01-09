/**
 * Global permission constants
 *
 * - Atomic
 * - Code-defined
 * - Additive
 * - Backend-enforced
 *
 * Naming convention:
 *   <domain>.<action>.<scope>
 */

export const PERMISSIONS = {
  // ─────────────────────────────────────────────
  // Moderation
  // ─────────────────────────────────────────────
  MODERATION_REVIEW_REPORTS: "moderation.review_reports",
  MODERATION_TAKE_ACTION: "moderation.take_action",
  MODERATION_VIEW_AUDIT_LOGS: "moderation.view_audit_logs",

  // ─────────────────────────────────────────────
  // Posts
  // ─────────────────────────────────────────────
  POSTS_DELETE_ANY: "posts.delete.any",
  POSTS_EDIT_ANY: "posts.edit.any",
  POSTS_HIDE_ANY: "posts.hide.any",

  // ─────────────────────────────────────────────
  // Comments
  // ─────────────────────────────────────────────
  COMMENTS_DELETE_ANY: "comments.delete.any",
  COMMENTS_HIDE_ANY: "comments.hide.any",

  // ─────────────────────────────────────────────
  // Campfires (global authority, not membership)
  // ─────────────────────────────────────────────
  CAMPFIRES_CREATE_FEATURED: "campfires.create.featured",
  CAMPFIRES_ARCHIVE_ANY: "campfires.archive.any",

  // ─────────────────────────────────────────────
  // Care / Professional features
  // ─────────────────────────────────────────────
  CARE_RESPOND_AS_PROFESSIONAL: "care.respond_as_professional",
  CARE_ACCESS_PRO_DASHBOARD: "care.access_pro_dashboard",

  // ─────────────────────────────────────────────
  // Mentorship
  // ─────────────────────────────────────────────
  MENTOR_RESPOND_AS_MENTOR: "mentor.respond_as_mentor",

  // ─────────────────────────────────────────────
  // Platform / Admin
  // ─────────────────────────────────────────────
  ROLES_ASSIGN: "roles.assign",
  ROLES_REVOKE: "roles.revoke",
  ACCOUNT_STATUS_UPDATE: "account_status.update",
  VERIFICATION_UPDATE: "verification.update",

  // ─────────────────────────────────────────────
  // Support / Internal
  // ─────────────────────────────────────────────
  SUPPORT_VIEW_USER_CONTEXT: "support.view_user_context",
  SUPPORT_IMPERSONATE_USER: "support.impersonate_user",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
