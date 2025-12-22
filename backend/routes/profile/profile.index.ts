import { createRouter } from "@backend/create-app";
import * as handlers from "./profile.handlers";
import * as routes from "./profile.routes";

const router = createRouter();

// Define routes
router.openapi(routes.getOwnProfile, handlers.getOwnProfile);
router.openapi(routes.getOwnPublicProfile, handlers.getOwnPublicProfile);
router.openapi(routes.getOwnPrivateProfile, handlers.getOwnPrivateProfile);
router.openapi(
  routes.updateUserPublicProfile,
  handlers.updateUserPublicProfile,
);
router.openapi(
  routes.updateUserPrivateProfile,
  handlers.updateUserPrivateProfile,
);
// router.openapi(routes.deleteUserProfile, handlers.deleteUserProfile);

export default router;
