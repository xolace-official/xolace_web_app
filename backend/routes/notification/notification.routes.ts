import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import { jsonContent } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";
import {
  getNotificationParamsSchema,
  notificationsInboxQuery,
  notificationsInboxResponse,
  successResponse,
  unreadCountResponse,
} from "./notification.validation";

const tags = ["Notifications"];

// error schemas
const internalServerErrorSchema = createMessageObjectSchema(
  HttpStatusPhrases.INTERNAL_SERVER_ERROR,
);

const unauthorizedErrorSchema = createMessageObjectSchema(
  HttpStatusPhrases.UNAUTHORIZED,
);

export const getNotificationsInbox = createRoute({
  path: "/",
  method: "get",
  summary: "Get notification inbox",
  description: "Returns paginated notifications for the current user.",
  tags,
  request: {
    query: notificationsInboxQuery,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      notificationsInboxResponse,
      "Notification inbox",
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      unauthorizedErrorSchema,
      "Authentication required",
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      createMessageObjectSchema("Bad request"),
      "Invalid query parameters",
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      internalServerErrorSchema,
      "Internal server error",
    ),
  },
});

export const getUnreadNotificationCount = createRoute({
  path: "/unread-count",
  method: "get",
  summary: "Get unread notification count",
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      unreadCountResponse,
      "Unread notification count",
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      unauthorizedErrorSchema,
      "Authentication required",
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      internalServerErrorSchema,
      "Internal server error",
    ),
  },
});

export const markNotificationAsRead = createRoute({
  path: "/{id}/read",
  method: "post",
  summary: "Mark a notification as read",
  tags,
  request: {
    params: getNotificationParamsSchema,
  },
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: "Notification marked as read",
    },
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      createMessageObjectSchema("Bad request"),
      "Invalid path parameters",
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      unauthorizedErrorSchema,
      "Authentication required",
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      internalServerErrorSchema,
      "Internal server error",
    ),
  },
});

export const markAllNotificationsAsRead = createRoute({
  path: "/read-all",
  method: "post",
  summary: "Mark all notifications as read",
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      successResponse,
      "All notifications marked as read successfully",
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      unauthorizedErrorSchema,
      "Authentication required",
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      internalServerErrorSchema,
      "Internal server error",
    ),
  },
});

//types
export type GetNotificationsInboxRoute = typeof getNotificationsInbox;
export type GetUnreadNotificationCountRoute = typeof getUnreadNotificationCount;
export type MarkNotificationAsReadRoute = typeof markNotificationAsRead;
export type MarkAllNotificationsAsReadRoute = typeof markAllNotificationsAsRead;
