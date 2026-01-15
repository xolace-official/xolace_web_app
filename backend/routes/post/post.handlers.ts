import type { AppRouteHandler } from "@backend/types";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import type { z } from "zod";

import type { GetCampfirePostsRoute } from "./post.routes";
import type { getCampfirePostsResponse } from "./post.validation";

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;

// =============================================================================
// GET /:campfireId/posts - Fetch paginated posts for a campfire
// =============================================================================

export const getCampfirePosts: AppRouteHandler<GetCampfirePostsRoute> = async (
  c,
) => {
  const supabase = c.get("supabase");
  const { campfireId } = c.req.valid("param");
  console.log("campfireId ", campfireId);
  const { cursor, limit: rawLimit } = c.req.valid("query");

  const limit = Math.min(Number(rawLimit) || DEFAULT_LIMIT, MAX_LIMIT);

  try {
    // -------------------------------------------------------------------------
    // 1. Verify campfire exists
    // -------------------------------------------------------------------------
    const { count: campfireCount, error: campfireError } = await supabase
      .from("campfires")
      .select("*", { count: "exact", head: true })
      .eq("id", campfireId);

    if (campfireError) {
      console.error("getCampfirePosts - campfire check error:", campfireError);
      return c.json(
        { message: HttpStatusPhrases.INTERNAL_SERVER_ERROR },
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
      );
    }

    if (campfireCount === 0) {
      return c.json(
        { message: "Campfire not found" },
        HttpStatusCodes.NOT_FOUND,
      );
    }

    // -------------------------------------------------------------------------
    // 2. Build posts query with cursor pagination
    // -------------------------------------------------------------------------
    let postsQuery = supabase
      .from("posts")
      .select(
        `
        id,
        content_text,
        post_kind,
        mood,
        is_sensitive,
        author_id,
        author_name_snapshot,
        author_avatar_snapshot,
        author_display_mode,
        campfire_id,
        upvotes_count,
        downvotes_count,
        created_at,
        expires_at,
        campfire:campfires!posts_campfire_id_fkey (
          id,
          name,
          slug,
          icon_path
        ),
        media:post_media!post_media_post_id_fkey (
          id,
          type,
          storage_path,
          mime_type,
          width,
          height,
          blurhash,
          dominant_hex,
          alt_text,
          sort_order
        )
      `,
      )
      .eq("campfire_id", campfireId)
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .limit(limit + 1); // Fetch one extra to determine has_more

    // Apply cursor if provided
    if (cursor) {
      postsQuery = postsQuery.lt("created_at", cursor);
    }

    const { data: posts, error: postsError } = await postsQuery;

    if (postsError) {
      console.error("getCampfirePosts - posts query error:", postsError);
      return c.json(
        { message: HttpStatusPhrases.INTERNAL_SERVER_ERROR },
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
      );
    }

    // -------------------------------------------------------------------------
    // 3. Determine pagination metadata
    // -------------------------------------------------------------------------
    const hasMore = (posts?.length ?? 0) > limit;
    const resultPosts = hasMore ? posts?.slice(0, limit) : posts;
    const nextCursor = hasMore
      ? (resultPosts?.[resultPosts.length - 1]?.created_at ?? null)
      : null;

    // -------------------------------------------------------------------------
    // 4. Get comment counts for posts (batch query)
    // -------------------------------------------------------------------------
    const postIds = resultPosts?.map((p) => p.id) ?? [];
    let commentCountMap: Record<string, number> = {};

    if (postIds.length > 0) {
      const { data: commentCounts, error: commentError } = await supabase
        .from("comments")
        .select("post_id")
        .in("post_id", postIds)
        .eq("depth", 0); // Count only root comments

      if (!commentError && commentCounts) {
        commentCountMap = commentCounts.reduce(
          (acc, row) => {
            acc[row.post_id] = (acc[row.post_id] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>,
        );
      }
    }

    // -------------------------------------------------------------------------
    // 5. Transform to response schema
    // -------------------------------------------------------------------------
    const transformedData = (resultPosts ?? []).map((post) => ({
      id: post.id,
      content_text: post.content_text,
      post_kind: post.post_kind as
        | "text"
        | "text_with_media"
        | "carousel"
        | "voice",
      mood: post.mood as
        | "neutral"
        | "sad"
        | "anxious"
        | "happy"
        | "angry"
        | "hopeful"
        | "confused"
        | "grateful",
      is_sensitive: post.is_sensitive,

      author: {
        id: post.author_id,
        name: post.author_name_snapshot,
        avatar_url: post.author_avatar_snapshot,
        display_mode: post.author_display_mode as
          | "attributed"
          | "anonymous"
          | "pseudonymous",
      },

      campfire: post.campfire
        ? {
            id: (post.campfire as { id: string }).id,
            name: (post.campfire as { name: string }).name,
            slug: (post.campfire as { slug: string }).slug,
            icon_path: (post.campfire as { icon_path: string | null })
              .icon_path,
          }
        : null,

      media: (
        (Array.isArray(post.media) ? post.media : []) as Array<{
          id: string;
          type: string;
          storage_path: string;
          mime_type: string;
          width: number | null;
          height: number | null;
          blurhash: string | null;
          dominant_hex: string | null;
          alt_text: string | null;
          sort_order: number;
        }>
      )
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((m) => ({
          id: m.id,
          type: m.type as "image" | "video" | "audio",
          storage_path: m.storage_path,
          mime_type: m.mime_type,
          width: m.width,
          height: m.height,
          blurhash: m.blurhash,
          dominant_hex: m.dominant_hex,
          alt_text: m.alt_text,
          sort_order: m.sort_order,
        })),

      metrics: {
        upvotes: post.upvotes_count,
        downvotes: post.downvotes_count,
        score: post.upvotes_count - post.downvotes_count,
        comments_count: commentCountMap[post.id] ?? 0,
      },

      created_at: post.created_at,
      expires_at: post.expires_at,
    }));

    const response: z.infer<typeof getCampfirePostsResponse> = {
      data: transformedData,
      meta: {
        campfire_id: campfireId,
        has_more: hasMore,
        next_cursor: nextCursor,
      },
    };

    return c.json(response, HttpStatusCodes.OK);
  } catch (error) {
    console.error("getCampfirePosts exception:", error);
    return c.json(
      { message: HttpStatusPhrases.INTERNAL_SERVER_ERROR },
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};
