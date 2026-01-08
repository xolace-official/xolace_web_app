import { z } from "@hono/zod-openapi";

// ------------------------
// Query Params for fetching comments
// ------------------------
export const getCommentsQuery = z.object({
  post_id: z.uuid().openapi({
    param: { name: "post_id", in: "query" },
    description: "ID of the post to fetch comments for",
  }),
  cursor: z
    .string()
    .optional()
    .openapi({
      param: { name: "cursor", in: "query" },
      description:
        "Pagination cursor, usually the created_at timestamp of last root comment",
    }),
  limit: z
    .string()
    .default("10")
    .transform(Number)
    .openapi({
      param: { name: "limit", in: "query" },
      description: "Number of root comments to fetch (default 10)",
    }),
});

// ------------------------
// Comment Schema
// ------------------------
const baseCommentSchema = z.object({
  id: z.uuid(),
  post_id: z.uuid(),
  parent_comment_id: z.uuid().nullable().optional(),
  body: z.string().nullable(),
  status: z.enum(["active", "deleted", "hidden", "removed"]),
  depth: z.number().int(),
  created_at: z.string(),
  updated_at: z.string(),
  author: z.object({
    id: z.uuid(),
    name: z.string(),
    avatar_url: z.string().nullable(),
    is_professional: z.boolean(),
  }),
  flags: z.object({
    is_ai_suggestion: z.boolean(),
    is_edited: z.boolean(),
  }),
  stats: z.object({
    reply_count: z.number().int(),
  }),
});

const replySchema = baseCommentSchema.extend({
  replies: z.array(z.unknown()).max(0).default([]), // Descendants have no nested replies
  // We can also enforce strict emptiness: z.tuple([]).default([])
});

export type Reply = z.infer<typeof replySchema>;

export const commentSchema = baseCommentSchema.extend({
  replies: z.array(replySchema),
});

export type Comment = z.infer<typeof commentSchema>;

// ------------------------
// Response
// ------------------------
export const getCommentsResponse = z.object({
  data: z.array(commentSchema),
  meta: z.object({
    post_id: z.uuid(),
    total_count: z.number().int(),
    has_more: z.boolean(),
    next_cursor: z.string().nullable(),
  }),
});
