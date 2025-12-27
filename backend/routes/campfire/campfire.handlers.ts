import type { AppRouteHandler } from "@backend/types";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import type { z } from "zod";
import type { GetManageCampfiresRoute } from "./campfire.routes";
import type { manageCampfiresPaginatedResponse } from "./campfire.validation";

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 50;

export const getManageCampfires: AppRouteHandler<
  GetManageCampfiresRoute
> = async (c) => {
  const userId = c.get("userId");
  const supabase = c.get("supabase");

  const { favorites_only, visibility, role, page, page_size } =
    c.req.valid("query");

  const pageNumber = Number(page);
  const pageSize = Math.min(
    Number(page_size) || DEFAULT_PAGE_SIZE,
    MAX_PAGE_SIZE,
  );

  try {
    let query = supabase
      .from("campfire_members")
      .select(
        `
        campfire_id,
        role,
        joined_at,
        is_favorite,
        campfire:campfires!inner(
          id,
          name,
          slug,
          description,
          member_count,
          icon_path,
          visibility
        )
      `,
        { count: "exact", head: false },
      )
      .eq("user_id", userId)
      .eq("status", "approved");

    // ─────────────────────────────────────────────
    // Filters
    // ─────────────────────────────────────────────

    if (favorites_only === true) {
      query = query.eq("is_favorite", true);
    }

    if (role) {
      query = query.eq("role", role);
    }

    if (visibility) {
      query = query.eq("campfires.visibility", visibility);
    }

    // ─────────────────────────────────────────────
    // Order & Pagination (Apply last)
    // ─────────────────────────────────────────────

    const { data, error, count } = await query
      .order("is_favorite", { ascending: false })
      .order("joined_at", { ascending: false })
      .range(pageNumber * pageSize, pageNumber * pageSize + pageSize - 1);

    if (error) {
      console.error("getManageCampfires error:", error);

      return c.json(
        { message: "Failed to fetch campfires" },
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
      );
    }

    const totalCount = count || 0;
    const totalPages = Math.ceil(totalCount / pageSize);

    const response: z.infer<typeof manageCampfiresPaginatedResponse> = {
      data: data || [],
      meta: {
        totalCount,
        currentPage: pageNumber,
        pageSize,
        hasNextPage: pageNumber < totalPages - 1,
      },
    };

    return c.json(response, HttpStatusCodes.OK);
  } catch (error) {
    console.error("getManageCampfires exception:", error);

    return c.json(
      { message: HttpStatusPhrases.INTERNAL_SERVER_ERROR },
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};
