import { accountStatusMiddleware } from "@backend/authz/account-status.middleware";
import { createRouter } from "@backend/create-app";
import { authMiddleware } from "@backend/middlewares/auth";

// domain routers
import campfire from "@backend/routes/campfire/campfire.index";
import collection from "@backend/routes/collection/collection.index";
import comment from "@backend/routes/comment/comment.index";
import glimpse from "@backend/routes/glimpse/glimpse.index";
import healthTip from "@backend/routes/health-tips/health-tip.index";
import profile from "@backend/routes/profile/profile.index";

// import imports from "@backend/routes/import/import.index";

const router = createRouter();

// 🔐 apply auth, account status, ONCE
router.use("/*", authMiddleware, accountStatusMiddleware);

// AUTHENTICATED ROUTES ONLY
router.route("/profile", profile);
router.route("/campfire", campfire);
router.route("/collection", collection);
router.route("/health-tip", healthTip);
router.route("/glimpse", glimpse);
router.route("/comment", comment);
// router.route("/import", imports);

export default router;
