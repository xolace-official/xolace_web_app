import { z } from "@hono/zod-openapi";

const uuidSchema = z.uuid();

// ---------------------------------------------
// Enums
// ---------------------------------------------

export const notificationStatusFilterEnum = z.enum([
  "all",
  "unread",
  "important",
]);

export const notificationTimeFilterEnum = z.enum([
  "all",
  "today",
  "thisWeek",
  "thisMonth",
]);

//
export const getNotificationParamsSchema = z.object({
  id: uuidSchema.openapi({
    param: {
      name: "id",
      in: "path",
    },
    description: "Notification ID to get specific notification",
  }),
});

// ---------------------------------------------
// Notification shape (read-only)
// ---------------------------------------------

export const notificationSchema = z.object({
  id: uuidSchema,
  created_at: z.string(),
  type: z.string(),

  actor_id: uuidSchema.nullable(),
  actor_name: z.string().nullable(),
  actor_avatar_url: z.string().url().nullable(),

  entity_type: z.string().nullable(),
  entity_id: z.string().nullable(),

  metadata: z.record(z.string(), z.any()),
  is_read: z.boolean(),
});

// ---------------------------------------------
// Inbox query
// ---------------------------------------------

export const notificationsInboxQuery = z.object({
  status: notificationStatusFilterEnum.default("all").openapi({
    param: { name: "status", in: "query" },
    example: "unread",
  }),

  time: notificationTimeFilterEnum.default("all").openapi({
    param: { name: "time", in: "query" },
    example: "thisWeek",
  }),

  page: z
    .string()
    .default("0")
    .transform(Number)
    .openapi({
      param: { name: "page", in: "query" },
      example: "0",
    }),

  page_size: z
    .string()
    .default("20")
    .transform(Number)
    .refine((v) => v >= 1 && v <= 50, {
      message: "page_size must be between 1 and 50",
    })
    .openapi({
      param: { name: "page_size", in: "query" },
      example: "20",
    }),
});

// ---------------------------------------------
// Responses
// ---------------------------------------------

export const notificationsInboxResponse = z.object({
  data: z.array(notificationSchema),
  meta: z.object({
    totalCount: z.number().int(),
    currentPage: z.number().int(),
    pageSize: z.number().int(),
    hasNextPage: z.boolean(),
  }),
});

export const unreadCountResponse = z.object({
  unreadCount: z.number().int(),
});

export const successResponse = z.object({
  message: z.string(),
});
