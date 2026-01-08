import type { AppRouteHandler } from "@backend/types";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import type { GetCommentsRoute } from "./comment.routes";

export const getComments: AppRouteHandler<GetCommentsRoute> = async (c) => {
  const supabase = c.get("supabase");

  // Query params
  const { post_id, cursor, limit = 10 } = c.req.valid("query");

  try {
    // ------------------------------------------------------------------
    // 1. Fetch ROOT comments (depth = 0) with pagination
    // ------------------------------------------------------------------
    let rootQuery = supabase
      .from("comments")
      .select(`
        id, post_id, body, status, created_at, updated_at,
        depth, author_id, author_name_snapshot, author_avatar_url_snapshot,
        is_ai_suggestion, is_edited
      `)
      .eq("post_id", post_id)
      .eq("depth", 0)
      .order("created_at", { ascending: false })
      .limit(limit + 1);

    if (cursor) rootQuery = rootQuery.lt("created_at", cursor);

    const { data: rootComments, error: rootError } = await rootQuery;
    if (rootError) throw rootError;

    if (!rootComments?.length) {
      return c.json(
        {
          data: [],
          meta: { post_id, total_count: 0, has_more: false, next_cursor: null },
        },
        HttpStatusCodes.OK,
      );
    }

    const hasMore = rootComments.length > limit;
    const roots = hasMore ? rootComments.slice(0, limit) : rootComments;
    const nextCursor = hasMore ? roots[roots.length - 1].created_at : null;
    const rootIds = roots.map((c) => c.id);

    // ------------------------------------------------------------------
    // 2. Fetch all descendants via root_id (depth >= 1)
    // ------------------------------------------------------------------
    const { data: allReplies, error: replyError } = await supabase
      .from("comments")
      .select(`
        id, parent_comment_id, root_id, body, status, created_at, updated_at,
        depth, author_id, author_name_snapshot, author_avatar_url_snapshot,
        is_ai_suggestion, is_edited
      `)
      .eq("post_id", post_id)
      .in("root_id", rootIds)
      .order("thread_path", { ascending: true });

    if (replyError) throw replyError;

    // ------------------------------------------------------------------
    // 3. Group replies by root_id
    // ------------------------------------------------------------------
    const repliesByRoot = new Map<string, typeof allReplies>();
    allReplies?.forEach((reply) => {
      // Require root_id for correctness
      if (!reply.root_id) return;
      const list = repliesByRoot.get(reply.root_id) || [];
      list.push(reply);
      repliesByRoot.set(reply.root_id, list);
    });

    // ------------------------------------------------------------------
    // 4. Transform response for UI
    // ------------------------------------------------------------------
    const responseData = roots.map((root) => {
      const descendants = repliesByRoot.get(root.id) || [];

      return {
        id: root.id,
        post_id: root.post_id,
        body: root.status === "active" ? root.body : null,
        status: root.status as "active" | "deleted" | "hidden" | "removed",
        author: {
          id: root.author_id ?? "",
          name: root.author_name_snapshot ?? "",
          avatar_url: root.author_avatar_url_snapshot,
          is_professional: false, // TODO: enrich if needed
        },
        flags: {
          is_ai_suggestion: root.is_ai_suggestion,
          is_edited: root.is_edited || false,
        },
        stats: {
          reply_count: descendants.length,
        },
        depth: 0,
        created_at: root.created_at,
        updated_at: root.updated_at,
        replies: descendants.map((r) => ({
          id: r.id,
          post_id: post_id,
          parent_comment_id: r.parent_comment_id,
          body: r.status === "active" ? r.body : null,
          status: r.status as "active" | "deleted" | "hidden" | "removed",
          author: {
            id: r.author_id ?? "",
            name: r.author_name_snapshot ?? "",
            avatar_url: r.author_avatar_url_snapshot,
            is_professional: false,
          },
          flags: {
            is_ai_suggestion: r.is_ai_suggestion,
            is_edited: r.is_edited || false,
          },
          stats: {
            reply_count: 0,
          },
          depth: r.depth ?? 0,
          created_at: r.created_at,
          updated_at: r.updated_at,
          replies: [],
        })),
      };
    });

    return c.json(
      {
        data: responseData,
        meta: {
          post_id,
          total_count: -1, // optional; can calculate if needed
          has_more: hasMore,
          next_cursor: nextCursor,
        },
      },
      HttpStatusCodes.OK,
    );
  } catch (error) {
    console.error("Get Comments Error:", error);
    return c.json(
      { message: HttpStatusPhrases.INTERNAL_SERVER_ERROR },
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};
