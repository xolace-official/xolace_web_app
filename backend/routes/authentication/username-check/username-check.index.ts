import { createRouter } from "@backend/create-app";
import * as handlers from "./username-check.handlers";
import * as routes from "./username-check.routes";

const router = createRouter();

router.openapi(routes.usernameCheckRoute, handlers.checkUsername);

export default router;
