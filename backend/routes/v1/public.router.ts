import { createRouter } from "@backend/create-app";

// domain routers
import signIn from "@backend/routes/authentication/sign-in/sign-in.index";

// import asset from "@backend/routes/asset/asset.index";
// import index from "@backend/routes/index.route";

const router = createRouter();

// PUBLIC ROUTES ONLY
router.route("/signin", signIn);
// router.route("/entry", entry);
// router.route("/asset", asset);

export default router;
