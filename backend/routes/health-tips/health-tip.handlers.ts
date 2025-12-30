import type { AppRouteHandler } from "@backend/types";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import type { z } from "zod";
import type {
  GetHealthTipByIdRoute,
  GetHealthTipBySlugRoute,
  GetHealthTipCategoriesRoute,
  GetHealthTipSourcesRoute,
  GetHealthTipsFeedRoute,
} from "./health-tip.routes";
import type {
  healthTipCategoriesResponse,
  healthTipDetailSchema,
  healthTipSourcesResponse,
  healthTipsFeedPaginatedResponse,
} from "./health-tip.validation";

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 50;

export const getHealthTipCategories: AppRouteHandler<
  GetHealthTipCategoriesRoute
> = async (c) => {
  const supabase = c.get("supabase");

  try {
    const { data, error } = await supabase
      .from("health_tip_categories")
      .select("key, display_name")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("getHealthTipCategories error:", error);

      return c.json(
        { message: "Failed to fetch categories" },
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
      );
    }

    const response: z.infer<typeof healthTipCategoriesResponse> = {
      data: data || [],
    };

    return c.json(response, HttpStatusCodes.OK);
  } catch (error) {
    console.error("getHealthTipCategories exception:", error);

    return c.json(
      { message: HttpStatusPhrases.INTERNAL_SERVER_ERROR },
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};

export const getHealthTipsFeed: AppRouteHandler<
  GetHealthTipsFeedRoute
> = async (c) => {
  const supabase = c.get("supabase");
  const { category, tag, language, page, page_size } = c.req.valid("query");

  const pageNumber = Number(page) || 0;
  const pageSize = Math.min(
    Number(page_size) || DEFAULT_PAGE_SIZE,
    MAX_PAGE_SIZE,
  );

  try {
    let query = supabase
      .from("health_tips")
      .select(
        `
        id,
        title,
        slug,
        excerpt,
        read_time_minutes,
        published_at,
        is_sponsored,
        sponsor_label,
        sensitive_level,
        category:health_tip_categories (
          key,
          display_name
        ),
        tags:health_tip_tags (
          tag:tags (
            name
          )
        )
      `,
        { count: "exact", head: false },
      )
      .eq("status", "published");

    // ─────────────────────────────
    // Filters
    // ─────────────────────────────

    if (language) {
      query = query.eq("language_code", language);
    }

    if (category) {
      query = query.eq("health_tip_categories.key", category);
    }

    if (tag && tag.length > 0) {
      query = query.in("tags.tag.name", tag);
    }

    // ─────────────────────────────
    // Pagination
    // ─────────────────────────────

    const { data, error, count } = await query
      .order("published_at", { ascending: false })
      .range(pageNumber * pageSize, pageNumber * pageSize + pageSize - 1);

    if (error) {
      console.error("getHealthTipsFeed error:", error);

      return c.json(
        { message: "Failed to fetch health tips feed" },
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
      );
    }

    const totalCount = count || 0;
    const totalPages = Math.ceil(totalCount / pageSize);

    const response: z.infer<typeof healthTipsFeedPaginatedResponse> = {
      data:
        data?.map((tip) => ({
          ...tip,
          tags: tip.tags?.map((t) => t.tag) ?? [],
        })) || [],
      meta: {
        totalCount,
        currentPage: pageNumber,
        pageSize,
        hasNextPage: pageNumber < totalPages - 1,
      },
    };

    return c.json(response, HttpStatusCodes.OK);
  } catch (error) {
    console.error("getHealthTipsFeed exception:", error);

    return c.json(
      { message: HttpStatusPhrases.INTERNAL_SERVER_ERROR },
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};

export const getHealthTipById: AppRouteHandler<GetHealthTipByIdRoute> = async (
  c,
) => {
  const supabase = c.get("supabase");
  const { id } = c.req.valid("param");

  try {
    const { data, error } = await supabase
      .from("health_tips")
      .select(
        `
        id,
        title,
        slug,
        excerpt,
        content,
        content_format,
        read_time_minutes,
        language_code,
        published_at,
        sensitive_level,
        is_sponsored,
        sponsor_label,
        category:health_tip_categories (
          key,
          display_name
        ),
        author:profiles!health_tips_created_by_fkey (
          id,
          username,
          avatar_url
        ),
        tags:health_tip_tags (
          tag:tags (
            name
          )
        )
      `,
      )
      .eq("id", id)
      .eq("status", "published")
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return c.json(
          { message: "Health tip not found" },
          HttpStatusCodes.NOT_FOUND,
        );
      }

      console.error("getHealthTipById error:", error);

      return c.json(
        { message: "Failed to fetch health tip" },
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
      );
    }

    const response: z.infer<typeof healthTipDetailSchema> = {
      ...data,
      tags: data.tags?.map((t) => t.tag) ?? [],
      sponsor: {
        is_sponsored: data.is_sponsored,
        sponsor_label: data.sponsor_label,
      },
    };

    return c.json(response, HttpStatusCodes.OK);
  } catch (error) {
    console.error("getHealthTipById exception:", error);

    return c.json(
      { message: HttpStatusPhrases.INTERNAL_SERVER_ERROR },
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};

export const getHealthTipBySlug: AppRouteHandler<
  GetHealthTipBySlugRoute
> = async (c) => {
  const supabase = c.get("supabase");
  const { slug } = c.req.valid("param");

  try {
    const { data, error } = await supabase
      .from("health_tips")
      .select(
        `
        id,
        title,
        slug,
        excerpt,
        content,
        content_format,
        read_time_minutes,
        language_code,
        published_at,
        sensitive_level,
        is_sponsored,
        sponsor_label,
        category:health_tip_categories (
          key,
          display_name
        ),
        author:profiles!health_tips_created_by_fkey (
          id,
          username,
          avatar_url
        ),
        tags:health_tip_tags (
          tag:tags (
            name
          )
        )
      `,
      )
      .eq("slug", slug)
      .eq("status", "published")
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return c.json(
          { message: "Health tip not found" },
          HttpStatusCodes.NOT_FOUND,
        );
      }

      console.error("getHealthTipBySlug error:", error);

      return c.json(
        { message: "Failed to fetch health tip" },
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
      );
    }

    const response: z.infer<typeof healthTipDetailSchema> = {
      ...data,
      tags: data.tags?.map((t) => t.tag) ?? [],
      sponsor: {
        is_sponsored: data.is_sponsored,
        sponsor_label: data.sponsor_label,
      },
    };

    return c.json(response, HttpStatusCodes.OK);
  } catch (error) {
    console.error("getHealthTipBySlug exception:", error);

    return c.json(
      { message: HttpStatusPhrases.INTERNAL_SERVER_ERROR },
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};

export const getHealthTipSources: AppRouteHandler<
  GetHealthTipSourcesRoute
> = async (c) => {
  const supabase = c.get("supabase");
  const { id } = c.req.valid("param");

  try {
    const { data, error } = await supabase
      .from("health_tip_sources")
      .select(
        `
        id,
        source_type,
        title,
        url,
        publisher,
        published_year,
        notes
      `,
      )
      .eq("health_tip_id", id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("getHealthTipSources error:", error);

      return c.json(
        { message: "Failed to fetch health tip sources" },
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
      );
    }

    if (!data || data.length === 0) {
      return c.json(
        { message: "Health tip not found or has no sources" },
        HttpStatusCodes.NOT_FOUND,
      );
    }

    const response: z.infer<typeof healthTipSourcesResponse> = {
      data,
    };

    return c.json(response, HttpStatusCodes.OK);
  } catch (error) {
    console.error("getHealthTipSources exception:", error);

    return c.json(
      { message: HttpStatusPhrases.INTERNAL_SERVER_ERROR },
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};
