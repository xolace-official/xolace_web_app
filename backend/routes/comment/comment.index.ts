import { createRouter } from "@backend/create-app";
import * as handlers from "./comment.handlers";
import * as routes from "./comment.routes";

const router = createRouter();

// Define routes
router.openapi(routes.getCommentsRoute, handlers.getComments);

export default router;
