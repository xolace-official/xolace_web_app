import { createRouter } from "@backend/create-app";

import { authMiddleware } from "@backend/middlewares/auth";

// domain routers
import profile from "@backend/routes/profile/profile.index";

// import imports from "@backend/routes/import/import.index";

const router = createRouter();

// 🔐 apply auth ONCE
router.use("/*", authMiddleware);

// AUTHENTICATED ROUTES ONLY
router.route("/profile", profile);
// router.route("/import", imports);

export default router;
