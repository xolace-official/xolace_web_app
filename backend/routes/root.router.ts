import { createRouter } from "@backend/create-app";
import v1Router from "./v1/v1.router";

const router = createRouter();

router.route("/v1", v1Router);

// future:
// router.route("/v2", v2Router);

export default router;
