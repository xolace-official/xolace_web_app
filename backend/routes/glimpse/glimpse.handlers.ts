import type { AppRouteHandler } from "@backend/types";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { GetGlimpseFeedRoute } from "./glimpse.routes";

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 50;

export const getGlimpseFeed: AppRouteHandler<GetGlimpseFeedRoute> = async (
  c,
) => {
  const supabase = c.get("supabase");
  const {
    mode,
    search,
    author_profile_id,
    min_duration,
    max_duration,
    page,
    page_size,
  } = c.req.valid("query");

  const pageNumber = Number(page);
  const pageSize = Math.min(
    Number(page_size) || DEFAULT_PAGE_SIZE,
    MAX_PAGE_SIZE,
  );

  try {
    let query = supabase
      .from("videos")
      .select(
        `
        id,
        playback_url,
        thumbnail_url,
        duration_seconds,
        title,
        description,
        author_profile_id,
        author_display_name,
        author_avatar_url,
        likes_count,
        views_count,
        saves_count,
        is_featured,
        is_recommended,
        published_at,
        video_tags (
          tag:tags (
            name
          )
        )
      `,
        { count: "exact" },
      )
      .eq("visibility", "public")
      .eq("is_deleted", false);

    // ───────────────────────── Filters ─────────────────────────

    if (author_profile_id) {
      query = query.eq("author_profile_id", author_profile_id);
    }

    if (min_duration !== undefined) {
      query = query.gte("duration_seconds", min_duration);
    }

    if (max_duration !== undefined) {
      query = query.lte("duration_seconds", max_duration);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // if (tag_ids?.length) {
    //   query = query.in(
    //     "id",
    //     supabase
    //       .from("video_tags")
    //       .select("video_id")
    //       .in("tag_id", tag_ids),
    //   );
    // }

    // ───────────────────────── Sorting ─────────────────────────

    if (mode === "featured") {
      query = query
        .eq("is_featured", true)
        .order("published_at", { ascending: false });
    } else if (mode === "newest") {
      query = query.order("published_at", {
        ascending: false,
      });
    } else {
      // for_you (default heuristic)
      query = query
        .order("is_recommended", { ascending: false })
        .order("likes_count", { ascending: false })
        .order("published_at", { ascending: false });
    }

    const { data, error, count } = await query.range(
      pageNumber * pageSize,
      pageNumber * pageSize + pageSize - 1,
    );

    if (error) {
      console.error("getGlimpseFeed error:", error);
      return c.json(
        { message: "Failed to fetch glimpse feed" },
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
      );
    }

    const totalCount = count || 0;
    const totalPages = Math.ceil(totalCount / pageSize);

    // transform data
    const transformedData =
      data?.map((video) => ({
        ...video,
        tags:
          video.video_tags
            ?.map((vt: { tag: { name: string } | null }) => vt.tag?.name)
            .filter((name): name is string => Boolean(name)) ?? [],
      })) || [];

    return c.json(
      {
        data: transformedData,
        meta: {
          totalCount,
          currentPage: pageNumber,
          pageSize,
          hasNextPage: pageNumber < totalPages - 1,
        },
      },
      HttpStatusCodes.OK,
    );
  } catch (err) {
    console.error("getGlimpseFeed exception:", err);
    return c.json(
      { message: HttpStatusPhrases.INTERNAL_SERVER_ERROR },
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};
