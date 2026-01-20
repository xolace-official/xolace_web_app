import { createRouter } from "@backend/create-app";
import * as handlers from "./notification.handlers";
import * as routes from "./notification.routes";

const router = createRouter();

// Define routes
router.openapi(routes.getNotificationsInbox, handlers.getNotificationsInbox);
router.openapi(
  routes.getUnreadNotificationCount,
  handlers.getUnreadNotificationCount,
);
router.openapi(routes.markNotificationAsRead, handlers.markNotificationAsRead);
router.openapi(
  routes.markAllNotificationsAsRead,
  handlers.markAllNotificationsAsRead,
);

export default router;
