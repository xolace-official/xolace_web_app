import { createRouter } from "@backend/create-app";
import * as handlers from "./health-tip.handlers";
import * as routes from "./health-tip.routes";

const router = createRouter();

// Define routes
router.openapi(routes.getHealthTipById, handlers.getHealthTipById);
router.openapi(routes.getHealthTipBySlug, handlers.getHealthTipBySlug);
router.openapi(routes.getHealthTipsFeed, handlers.getHealthTipsFeed);
router.openapi(routes.getHealthTipCategories, handlers.getHealthTipCategories);
router.openapi(routes.getHealthTipSources, handlers.getHealthTipSources);

export default router;
