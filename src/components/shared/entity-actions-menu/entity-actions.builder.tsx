import { Eye, EyeOff, Flag, Pin, Telescope, Trash2 } from "lucide-react";
import type { EntityActionsPolicy } from "./entity-actions.policy";
import type { EntityActionsRunner } from "./entity-actions.runner";
import type {
  EntityActionDescriptor,
  EntityActionsContext,
  EntityTarget,
} from "./entity-actions.types";

type BuildActionsInput = {
  policy: EntityActionsPolicy;
  target: EntityTarget;
  context: EntityActionsContext;
  ui: any; // typed earlier; simplified here for clarity
  runner: EntityActionsRunner;
};

export function buildEntityActions({
  policy,
  target,
  context,
  ui,
  runner,
}: BuildActionsInput): EntityActionDescriptor[] {
  const actions: EntityActionDescriptor[] = [];

  // ─────────────────────────────────────────────
  // VIEW POST (post-card only)
  // ─────────────────────────────────────────────
  if (policy.canViewPost && target.type === "post") {
    const viewAction: EntityActionDescriptor = {
      key: "post.view",
      label: "View",
      icon: <Telescope size={16} strokeWidth={1.5} />,
      run: async () => {
        ui.navigateToPost(target.postId);
      },
    };
    actions.push(viewAction);
  }

  // ─────────────────────────────────────────────
  // TOGGLE PROMPT (post)
  // ─────────────────────────────────────────────
  if (policy.canTogglePrompt && target.type === "post") {
    const isVisible = ui.isPostPromptVisible?.(target.postId);

    const togglePromptAction: EntityActionDescriptor = {
      key: "post.prompt.toggle",
      label: isVisible ? "Hide prompt" : "Related Prompt",
      icon: isVisible ? (
        <EyeOff size={16} strokeWidth={1.5} />
      ) : (
        <Eye size={16} strokeWidth={1.5} />
      ),
      run: async () => {
        ui.togglePostPromptVisibility?.(target.postId);
      },
    };

    actions.push(togglePromptAction);
  }

  // ─────────────────────────────────────────────
  // PIN COMMENT (AUTHOR)
  // ─────────────────────────────────────────────
  if (policy.canPinAsAuthor && target.type === "comment") {
    const isPinned = target.pinnedStatus === "author";

    const pinCommentAction: EntityActionDescriptor = {
      key: "comment.pin.author",
      label: isPinned ? "Unpin Comment" : "Pin as Author",
      icon: <Pin size={16} strokeWidth={1.5} />,
      run: async () => {
        await runner.pinComment(target.commentId, target.postId, "author");
      },
    };
    actions.push(pinCommentAction);
  }

  // ─────────────────────────────────────────────
  // PIN COMMENT (PROFESSIONAL)
  // ─────────────────────────────────────────────
  if (policy.canPinAsProfessional && target.type === "comment") {
    const isPinned = target.pinnedStatus === "professional";

    const pinCommentAction: EntityActionDescriptor = {
      key: "comment.pin.professional",
      label: isPinned ? "Unpin Comment" : "Pin as Professional",
      icon: <Pin size={16} strokeWidth={1.5} />,
      run: async () => {
        await runner.pinComment(
          target.commentId,
          target.postId,
          "professional",
        );
      },
    };
    actions.push(pinCommentAction);
  }

  // ─────────────────────────────────────────────
  // DELETE COMMENT
  // ─────────────────────────────────────────────
  if (policy.canDeleteComment && target.type === "comment") {
    const deleteCommentAction: EntityActionDescriptor = {
      key: "comment.delete",
      label: "Delete Comment",
      icon: <Trash2 size={16} />,
      destructive: true,
      run: async () => {
        const confirmed = await ui.confirm?.({
          title: "Delete comment?",
          destructive: true,
        });
        if (!confirmed) return;

        await runner.deleteComment(target.commentId, target.postId);
      },
    };
    actions.push(deleteCommentAction);
  }

  // ─────────────────────────────────────────────
  // DELETE POST
  // ─────────────────────────────────────────────
  if (policy.canDeletePost && target.type === "post") {
    const deletePostAction: EntityActionDescriptor = {
      key: "post.delete",
      label: "Delete Post",
      icon: <Trash2 size={16} />,
      destructive: true,
      run: async () => {
        const confirmed = await ui.confirm?.({
          title: "Delete post?",
          destructive: true,
        });
        if (!confirmed) return;

        await runner.deletePost(target.postId);

        // TODO: Should probably check if the user is on the post-card surface or detail surface
        ui.afterPostDeleted?.(target.postId);
      },
    };
    actions.push(deletePostAction);
  }

  // ─────────────────────────────────────────────
  // REPORT (post or comment)
  // ─────────────────────────────────────────────
  if (policy.canReport) {
    const reportAction: EntityActionDescriptor = {
      key: "entity.report",
      label: "Report",
      icon: <Flag size={16} strokeWidth={1.5} />,
      run: async () => {
        if (target.type === "post") {
          ui.openReportSheet({
            targetType: "post",
            postId: target.postId,
          });
        } else {
          ui.openReportSheet({
            targetType: "comment",
            postId: target.postId,
            commentId: target.commentId,
          });
        }
      },
    };
    actions.push(reportAction);
  }

  return actions;
}
