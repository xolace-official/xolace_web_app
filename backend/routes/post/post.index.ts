import { createRouter } from "@backend/create-app";
import * as handlers from "./post.handlers";
import * as routes from "./post.routes";

const router = createRouter();

// Define routes
router.openapi(routes.getCampfirePosts, handlers.getCampfirePosts);

export default router;
