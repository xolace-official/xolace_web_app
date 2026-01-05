import { createRouter } from "@backend/create-app";
import * as handlers from "./glimpse.handlers";
import * as routes from "./glimpse.routes";

const router = createRouter();

// Define routes
router.openapi(routes.getGlimpseFeed, handlers.getGlimpseFeed);

export default router;
