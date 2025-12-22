import { createRouter } from "@backend/create-app";
import * as handlers from "./profile.handlers";
import * as routes from "./profile.routes";

const router = createRouter();

// Define routes
router.openapi(routes.getOwnProfile, handlers.getOwnProfile);
// router.openapi(routes.updateUserProfile, handlers.updateUserProfile);
// router.openapi(routes.deleteUserProfile, handlers.deleteUserProfile);

export default router;
