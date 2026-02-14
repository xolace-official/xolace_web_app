import { createRouter } from "@backend/create-app";
import * as handlers from "./preferences.handlers";
import * as routes from "./preferences.routes";

const router = createRouter();

router.openapi(routes.getPreferences, handlers.getPreferences);
router.openapi(routes.updatePreferences, handlers.updatePreferences);

export default router;
