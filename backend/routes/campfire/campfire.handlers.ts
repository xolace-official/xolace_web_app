import type { AppRouteHandler } from "@backend/types";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import type { z } from "zod";
import type {
  GetBatchMembershipRoute,
  GetDiscoveryCampfiresRoute,
  GetManageCampfiresRoute,
} from "./campfire.routes";
import type {
  discoveryCampfiresResponse,
  manageCampfiresPaginatedResponse,
} from "./campfire.validation";

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

export const getDiscoveryCampfires: AppRouteHandler<
  GetDiscoveryCampfiresRoute
> = async (c) => {
  const supabase = c.get("supabase");
  const { page, page_size, realm_id, lane_id, search, sort } =
    c.req.valid("query");

  const pageNumber = Number(page);
  const pageSize = Math.min(
    Number(page_size) || DEFAULT_PAGE_SIZE,
    MAX_PAGE_SIZE,
  );

  try {
    let query = supabase
      .from("campfires")
      .select(
        "id, name, slug, description, member_count, icon_path, visibility",
        { count: "exact" },
      )
      .eq("visibility", "public");

    if (realm_id) {
      query = query.eq("realm_id", realm_id);
    }

    if (lane_id) {
      query = query.eq("lane_id", lane_id);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // Sort
    if (sort === "newest") {
      query = query.order("created_at", { ascending: false });
    } else if (sort === "alphabetical") {
      query = query.order("name", { ascending: true });
    } else {
      // popular (default)
      query = query.order("member_count", { ascending: false });
    }

    const { data, error, count } = await query.range(
      pageNumber * pageSize,
      pageNumber * pageSize + pageSize - 1,
    );

    if (error) {
      console.error("getDiscoveryCampfires error:", error);
      return c.json(
        { message: "Failed to fetch campfires" },
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
      );
    }

    const totalCount = count || 0;
    const totalPages = Math.ceil(totalCount / pageSize);

    const response: z.infer<typeof discoveryCampfiresResponse> = {
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
    console.error("getDiscoveryCampfires exception:", error);
    return c.json(
      { message: HttpStatusPhrases.INTERNAL_SERVER_ERROR },
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};

export const getBatchMembership: AppRouteHandler<
  GetBatchMembershipRoute
> = async (c) => {
  const userId = c.get("userId");
  const supabase = c.get("supabase");
  const { campfire_ids } = c.req.valid("json");

  if (!userId) {
    return c.json({ message: "Unauthorized" }, HttpStatusCodes.UNAUTHORIZED);
  }

  if (campfire_ids.length === 0) {
    return c.json({}, HttpStatusCodes.OK);
  }

  try {
    const { data, error } = await supabase
      .from("campfire_members")
      .select("campfire_id, role, status, is_favorite, joined_at")
      .eq("user_id", userId)
      .in("campfire_id", campfire_ids);

    if (error) {
      console.error("getBatchMembership error:", error);
      return c.json(
        { message: "Failed to fetch membership" },
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
      );
    }

    const membershipMap: Record<string, any> = {};
    if (data) {
      for (const member of data) {
        membershipMap[member.campfire_id] = {
          role: member.role,
          status: member.status,
          is_favorite: member.is_favorite,
          joined_at: member.joined_at,
        };
      }
    }

    return c.json(membershipMap, HttpStatusCodes.OK);
  } catch (error) {
    console.error("getBatchMembership exception:", error);
    return c.json(
      { message: HttpStatusPhrases.INTERNAL_SERVER_ERROR },
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};
