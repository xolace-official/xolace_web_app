import type { AppRouteHandler } from "@backend/types";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import type { z } from "zod";
import type {
  GetBatchMembershipRoute,
  GetCampfireDetailsRoute,
  GetCampfireLanesRoute,
  GetCampfireMembershipRoute,
  GetCampfireRealmsRoute,
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
        "id, name, slug, description, member_count, icon_path, interaction_style",
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

    console.log("response ", response);

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
    return c.json({ memberships: {} }, HttpStatusCodes.OK);
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

    // const membershipMap: Record<string, any> = {};
    // if (data) {
    //   for (const member of data) {
    //     membershipMap[member.campfire_id] = {
    //       role: member.role,
    //       status: member.status,
    //       is_favorite: member.is_favorite,
    //       joined_at: member.joined_at,
    //     };
    //   }
    // }

    // return c.json(membershipMap, HttpStatusCodes.OK);

    // -------------------------------------------------------------------------
    // Build lookup map
    // -------------------------------------------------------------------------

    const membershipSet = new Set((data ?? []).map((row) => row.campfire_id));

    const memberships: Record<string, boolean> = {};

    for (const id of campfire_ids) {
      memberships[id] = membershipSet.has(id);
    }

    return c.json({ memberships }, HttpStatusCodes.OK);
  } catch (error) {
    console.error("getBatchMembership exception:", error);
    return c.json(
      { message: HttpStatusPhrases.INTERNAL_SERVER_ERROR },
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};

export const getCampfireMembership: AppRouteHandler<
  GetCampfireMembershipRoute
> = async (c) => {
  const userId = c.get("userId");
  const supabase = c.get("supabase");
  const { campfireId } = c.req.param();

  const { data, error } = await supabase
    .from("campfire_members")
    .select("role, status, is_favorite, joined_at")
    .eq("campfire_id", campfireId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error && error.code !== "PGRST116") {
    console.error("getCampfireMembership error:", error);
    return c.json(
      { message: "Failed to fetch membership" },
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
    );
  }

  if (!data) {
    return c.json(
      {
        data: {
          is_member: false,
          role: null,
          status: null,
          is_favorite: false,
          joined_at: null,
        },
      },
      HttpStatusCodes.OK,
    );
  }

  return c.json(
    {
      data: {
        is_member: true,
        role: data.role,
        status: data.status,
        is_favorite: data.is_favorite,
        joined_at: data.joined_at,
      },
    },
    HttpStatusCodes.OK,
  );
};

export const getCampfireRealms: AppRouteHandler<
  GetCampfireRealmsRoute
> = async (c) => {
  const supabase = c.get("supabase");

  try {
    const { data, error } = await supabase
      .from("campfire_realms")
      .select(
        `
        id,
        key,
        name,
        description,
        sort_order,
        is_high_safety
      `,
      )
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("getCampfireRealms error:", error);

      return c.json(
        { message: "Failed to fetch campfire realms" },
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
      );
    }

    return c.json({ data: data ?? [] }, HttpStatusCodes.OK);
  } catch (err) {
    console.error("getCampfireRealms exception:", err);

    return c.json(
      { message: "Internal server error" },
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};

export const getCampfireLanes: AppRouteHandler<GetCampfireLanesRoute> = async (
  c,
) => {
  const supabase = c.get("supabase");
  const { realmId, activeOnly } = c.req.valid("query");

  let query = supabase.from("campfire_lanes").select(
    `
      id,
      realm_id,
      key,
      name,
      description,
      sort_order,
      is_high_safety
    `,
  );

  if (realmId) {
    query = query.eq("realm_id", realmId);
  }

  if (activeOnly !== false) {
    query = query.eq("is_active", true);
  }

  const { data, error } = await query.order("sort_order", { ascending: true });

  if (error) {
    console.error("getCampfireLanes error:", error);

    return c.json(
      { message: "Failed to fetch campfire lanes" },
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
    );
  }

  return c.json({ data: data ?? [] }, HttpStatusCodes.OK);
};

export const getCampfireDetails: AppRouteHandler<
  GetCampfireDetailsRoute
> = async (c) => {
  const supabase = c.get("supabase");
  const { slug } = c.req.valid("param");

  try {
    const { data, error } = await supabase
      .from("campfires")
      .select(`
    id,
    name,
    slug,
    description,
    icon_path,
    banner_path,
    interaction_style,
    visibility,
    member_count,
    created_at,
    created_by,

    realm:campfire_realms (
      id,
      key,
      name,
      is_high_safety
    ),

    lane:campfire_lanes (
      id,
      key,
      name,
      is_high_safety
    ),

    settings:campfire_settings (
      guide_enabled,
      guide_header_image,
      guide_header_layout,
      guide_show_on_join,
      guide_welcome_message
    )
  `)
      .eq("slug", slug)
      .eq("visibility", "public")
      .maybeSingle();

    if (error) {
      console.error("getCampfireDetails error:", error);
      return c.json(
        { message: HttpStatusPhrases.INTERNAL_SERVER_ERROR },
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
      );
    }

    if (!data) {
      return c.json(
        { message: "Campfire not found" },
        HttpStatusCodes.NOT_FOUND,
      );
    }

    return c.json({ data }, HttpStatusCodes.OK);
  } catch (error) {
    console.error("getCampfireDetails exception:", error);

    return c.json(
      { message: HttpStatusPhrases.INTERNAL_SERVER_ERROR },
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};
