import { createRouter } from "@backend/create-app";
import * as handlers from "./sign-in.handlers";
import * as routes from "./sign-in.routes";

const router = createRouter();

// Only expose for docs/testing
router.openapi(routes.signInRoute, handlers.signIn);

export default router;
