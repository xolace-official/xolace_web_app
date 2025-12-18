// entity-actions.policy.ts
import type {
  EntityActionsContext,
  EntityTarget,
} from "./entity-actions.types";

export type ViewerRole = "blue_team" | "help_professional" | string;

export type Viewer = {
  id: string | null; // null = not signed in
  roles: ViewerRole[];
};

export type EntityActionsPolicy = {
  // identity helpers
  isAuthed: boolean;
  isModerator: boolean;

  isPostAuthor: boolean;
  isCommentAuthor: boolean;
  isHealthProfessionalForComment: boolean;

  // permissions (what actions should be visible/allowed)
  canDeletePost: boolean;
  canDeleteComment: boolean;

  canPinAsAuthor: boolean;
  canPinAsProfessional: boolean;

  canViewPost: boolean;
  canTogglePrompt: boolean;
  canReport: boolean;
};

type PolicyInput = {
  viewer: Viewer;
  target: EntityTarget;
  context: EntityActionsContext;
};

/**
 * Pure rules:
 * - No UI concerns
 * - No side effects
 * - No network
 *
 * NOTE: This is NOT security — Supabase RLS must still enforce real permissions.
 * This is only what we show in the UI.
 */
export function getEntityActionsPolicy({
  viewer,
  target,
  context,
}: PolicyInput): EntityActionsPolicy {
  const isAuthed = Boolean(viewer.id);
  const isModerator = viewer.roles.includes("blue_team");

  const isPostAuthor =
    target.type === "post" ? viewer.id === target.postAuthorId : false;

  const isCommentAuthor =
    target.type === "comment" ? viewer.id === target.commentAuthorId : false;

  // Mirrors your current logic:
  // roles includes 'help_professional' AND viewer.id === commentCreatedBy
  const isHealthProfessionalForComment =
    target.type === "comment"
      ? viewer.roles.includes("help_professional") &&
        viewer.id === target.commentAuthorId
      : false;

  // Delete permissions
  const canDeletePost = target.type === "post" && (isPostAuthor || isModerator);

  const canDeleteComment =
    target.type === "comment" && (isCommentAuthor || isModerator);

  // Pin permissions (comment-only)
  // - "author pin" requires viewer to be the post author
  const canPinAsAuthor =
    target.type === "comment" ? viewer.id === target.postAuthorId : false;
  /**
   * IMPORTANT:
   * In real prod, "canPinAsAuthor" should compare viewer.id === postAuthorId.
   * But our current CommentTarget doesn't include postAuthorId.
   *
   * We’ll fix this cleanly in Step 3 by enriching the CommentTarget
   * (or by passing postAuthorId into target when constructing it).
   */

  // Professional pin: only for comment author + role (your current rule)
  const canPinAsProfessional =
    target.type === "comment" && isHealthProfessionalForComment;

  // View post: only makes sense on post targets, and usually only on post-card surface
  const canViewPost = target.type === "post" && context.surface === "post-card";

  // Toggle prompt: only if post has prompt text and handler exists (handler check is later)
  const canTogglePrompt = target.type === "post" && Boolean(target.promptText);

  // Report: usually requires being signed in (you can loosen this later)
  const canReport = isAuthed;

  return {
    isAuthed,
    isModerator,

    isPostAuthor,
    isCommentAuthor,
    isHealthProfessionalForComment,

    canDeletePost,
    canDeleteComment,

    canPinAsAuthor,
    canPinAsProfessional,

    canViewPost,
    canTogglePrompt,
    canReport,
  };
}
