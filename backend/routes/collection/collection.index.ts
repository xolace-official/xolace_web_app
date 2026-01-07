import { createRouter } from "@backend/create-app";
import * as handlers from "./collection.handlers";
import * as routes from "./collection.routes";

const router = createRouter();

// Define routes
router.openapi(routes.getCollections, handlers.getCollections);
router.openapi(routes.getCollectionsSimple, handlers.getCollectionsSimple);
router.openapi(routes.getCollectionItems, handlers.getCollectionItems);

export default router;
