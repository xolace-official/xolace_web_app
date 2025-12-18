"use client";

import { Eye, Flag, Telescope } from "lucide-react";
import { getEntityActionsPolicy } from "./entity-actions.policy";
import type { EntityActionDescriptor } from "./entity-actions.types";
import { EntityActionsMenu } from "./index";

const dummyViewer = {
  id: "user_abc",
  roles: ["normal_user"], // try removing to see policy change
};

const dummyTargetPost = {
  type: "post" as const,
  postId: "post_123",
  postAuthorId: "user_abc",
  promptText: "How are you feeling today?",
};

const policy = getEntityActionsPolicy({
  viewer: dummyViewer,
  target: dummyTargetPost,
  context: { surface: "post-card" },
});

console.log(policy);

const dummyActions: EntityActionDescriptor[] = [
  {
    key: "post.view",
    label: "View",
    icon: <Telescope size={16} strokeWidth={1.5} />,
    run: async ({ target, ui }) => {
      // In prod: shown only for post-card surface via policy/action builder
      if (target.type === "post") ui.navigateToPost(target.postId);
    },
  },
  {
    key: "post.prompt.toggle",
    label: "Related Prompt",
    icon: <Eye size={16} strokeWidth={1.5} />,
    run: async ({ target, ui }) => {
      // In prod: only if prompt exists + handler provided
      if (target.type === "post")
        ui.togglePostPromptVisibility?.(target.postId);
    },
  },
  {
    key: "entity.report",
    label: "Report",
    icon: <Flag size={16} strokeWidth={1.5} />,
    run: async ({ target, ui }) => {
      if (target.type === "post") {
        ui.openReportSheet({ targetType: "post", postId: target.postId });
      } else {
        ui.openReportSheet({
          targetType: "comment",
          postId: target.postId,
          commentId: target.commentId,
        });
      }
    },
  },
];

// Example target (dummy)
const dummyTarget = {
  type: "post" as const,
  postId: "post_123",
  postAuthorId: "user_abc",
  promptText: "How are you feeling today?",
};

// Example ui handlers (dummy)
const dummyUi = {
  navigateToPost: (postId: string) => console.log("navigate to", postId),
  openReportSheet: (args: any) => console.log("open report sheet", args),
  togglePostPromptVisibility: (postId: string) =>
    console.log("toggle prompt for", postId),
};

export function Demo() {
  return (
    <EntityActionsMenu
      target={dummyTarget}
      context={{ surface: "post-card" }}
      ui={dummyUi}
      actions={dummyActions}
      onOpenChange={(open) => console.log("menu open:", open)}
    />
  );
}
