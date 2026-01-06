import { createRouter } from "@backend/create-app";

import { authMiddleware } from "@backend/middlewares/auth";

// domain routers
import campfire from "@backend/routes/campfire/campfire.index";
import glimpse from "@backend/routes/glimpse/glimpse.index";
import healthTip from "@backend/routes/health-tips/health-tip.index";
import profile from "@backend/routes/profile/profile.index";

// import imports from "@backend/routes/import/import.index";

const router = createRouter();

// 🔐 apply auth ONCE
router.use("/*", authMiddleware);

// AUTHENTICATED ROUTES ONLY
router.route("/profile", profile);
router.route("/campfire", campfire);
router.route("/health-tip", healthTip);
router.route("/glimpse", glimpse);
// router.route("/import", imports);

export default router;
