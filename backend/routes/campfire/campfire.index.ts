import { createRouter } from "@backend/create-app";
import * as handlers from "./campfire.handlers";
import * as routes from "./campfire.routes";

const router = createRouter();

// Define routes
router.openapi(routes.getManageCampfires, handlers.getManageCampfires);

export default router;
