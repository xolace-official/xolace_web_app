// entity-actions.runner.ts (temporary stub)

export type EntityActionsRunner = {
  deletePost: (postId: string) => Promise<void>;
  deleteComment: (commentId: number, postId: string) => Promise<void>;
  pinComment: (
    commentId: number,
    postId: string,
    level: "author" | "professional",
  ) => Promise<void>;
};
