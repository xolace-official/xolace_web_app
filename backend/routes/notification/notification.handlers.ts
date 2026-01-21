import type { AppRouteHandler } from "@backend/types";
import type { z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import type {
  GetNotificationsInboxRoute,
  GetUnreadNotificationCountRoute,
  MarkAllNotificationsAsReadRoute,
  MarkNotificationAsReadRoute,
} from "./notification.routes";
import type { notificationsInboxResponse } from "./notification.validation";

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 50;

// ---------------------------------------------
// Helpers
// ---------------------------------------------

function getTimeRange(filter: string) {
  const now = new Date();

  switch (filter) {
    case "today":
      return new Date(now.setHours(0, 0, 0, 0));
    case "thisWeek": {
      const d = new Date();
      d.setDate(d.getDate() - d.getDay());
      d.setHours(0, 0, 0, 0);
      return d;
    }
    case "thisMonth":
      return new Date(now.getFullYear(), now.getMonth(), 1);
    default:
      return null;
  }
}

// ---------------------------------------------
// GET /notifications
// ---------------------------------------------

export const getNotificationsInbox: AppRouteHandler<
  GetNotificationsInboxRoute
> = async (c) => {
  const supabase = c.get("supabase");
  const userId = c.get("userId");
  const { status, time, page, page_size } = c.req.valid("query");

  const pageNumber = page ?? 0;
  const pageSize = Math.min(page_size ?? DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE);

  let query = supabase
    .from("notifications")
    .select(
      `
      id,
      created_at,
      type,
      actor_id,
      actor_name,
      actor_avatar_url,
      entity_type,
      entity_id,
      metadata,
      is_read
    `,
      { count: "exact" },
    )
    .eq("recipient_user_id", userId);

  // Status filter
  if (status === "unread") {
    query = query.eq("is_read", false);
  }

  if (status === "important") {
    query = query.eq("metadata->>is_important", "true");
  }

  // Time filter
  const fromDate = getTimeRange(time);
  if (fromDate) {
    query = query.gte("created_at", fromDate.toISOString());
  }

  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(pageNumber * pageSize, pageNumber * pageSize + pageSize - 1);

  if (error) {
    console.error("getNotificationsInbox error:", error);
    return c.json(
      { message: "Failed to fetch notifications" },
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
    );
  }

  const totalCount = count ?? 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  return c.json(
    {
      data: (data ?? []) as z.infer<typeof notificationsInboxResponse>["data"],
      meta: {
        totalCount,
        currentPage: pageNumber,
        pageSize,
        hasNextPage: pageNumber < totalPages - 1,
      },
    },
    HttpStatusCodes.OK,
  );
};

// ---------------------------------------------
// GET /notifications/unread-count
// ---------------------------------------------

export const getUnreadNotificationCount: AppRouteHandler<
  GetUnreadNotificationCountRoute
> = async (c) => {
  const supabase = c.get("supabase");
  const userId = c.get("userId");

  const { count, error } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("recipient_user_id", userId)
    .eq("is_read", false);

  if (error) {
    console.error("getUnreadNotificationCount error:", error);
    return c.json(
      { message: "Failed to fetch unread count" },
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
    );
  }

  return c.json({ unreadCount: count ?? 0 }, HttpStatusCodes.OK);
};

// ---------------------------------------------
// POST /notifications/{id}/read
// ---------------------------------------------

export const markNotificationAsRead: AppRouteHandler<
  MarkNotificationAsReadRoute
> = async (c) => {
  const supabase = c.get("supabase");
  const userId = c.get("userId");
  const { id } = c.req.valid("param");

  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", id)
    .eq("recipient_user_id", userId);

  if (error) {
    console.error("markNotificationAsRead error:", error);
    return c.json(
      { message: "Failed to update notification" },
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
    );
  }

  return c.body(null, HttpStatusCodes.NO_CONTENT);
};

// ---------------------------------------------
// POST /notifications/read-all
// ---------------------------------------------

export const markAllNotificationsAsRead: AppRouteHandler<
  MarkAllNotificationsAsReadRoute
> = async (c) => {
  const supabase = c.get("supabase");
  const userId = c.get("userId");

  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("recipient_user_id", userId)
    .eq("is_read", false);

  if (error) {
    console.error("markAllNotificationsAsRead error:", error);
    return c.json(
      { message: "Failed to mark notifications as read" },
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
    );
  }

  return c.json(
    { message: "All notifications marked as read" },
    HttpStatusCodes.OK,
  );
};
