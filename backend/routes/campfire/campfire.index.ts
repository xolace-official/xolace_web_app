import { createRouter } from "@backend/create-app";
import * as handlers from "./campfire.handlers";
import * as routes from "./campfire.routes";

const router = createRouter();

// Define routes
router.openapi(routes.getManageCampfires, handlers.getManageCampfires);
router.openapi(routes.getDiscoveryCampfires, handlers.getDiscoveryCampfires);
router.openapi(routes.getBatchMembership, handlers.getBatchMembership);
router.openapi(routes.getCampfireRealms, handlers.getCampfireRealms);
router.openapi(routes.getCampfireLanes, handlers.getCampfireLanes);

export default router;
