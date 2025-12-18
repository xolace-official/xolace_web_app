// entity-actions.types.ts

export type EntityTarget =
  | {
      type: "post";
      postId: string;
      postAuthorId: string;
      promptText?: string | null;
    }
  | {
      type: "comment";
      postId: string;
      commentId: number;
      commentAuthorId: string;
      postAuthorId: string;
      pinnedStatus?: "author" | "professional" | null;
    };

export type EntityActionsSurface = "post-card" | "post-detail" | "comment-card";

export type EntityActionsContext = {
  surface: EntityActionsSurface;
};

export type EntityActionsUiHandlers = {
  // Navigation
  navigateToPost: (postId: string) => void;
  afterPostDeleted?: (postId: string) => void;

  // Reporting UI
  openReportSheet: (args: {
    targetType: "post" | "comment";
    postId?: string;
    commentId?: number;
  }) => void;

  // Prompt UI
  togglePostPromptVisibility?: (postId: string) => void;
  isPostPromptVisible?: (postId: string) => boolean;

  // Feedback + confirmations (optional but recommended)
  notify?: (args: {
    kind: "success" | "error" | "info";
    message: string;
  }) => void;

  confirm?: (args: {
    title: string;
    description?: string;
    confirmLabel?: string;
    destructive?: boolean;
  }) => Promise<boolean>;
};

export type EntityActionRunCtx = {
  target: EntityTarget;
  context: EntityActionsContext;
  ui: EntityActionsUiHandlers;
};

export type EntityActionDescriptor = {
  key: string;
  label: string;
  icon?: React.ReactNode;

  // presentation
  destructive?: boolean;
  group?: "actions" | "moderation";

  // state
  disabled?: boolean;

  // execution
  run: (ctx: EntityActionRunCtx) => void | Promise<void>;
};
