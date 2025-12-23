import { createRouter } from "@backend/create-app";
import authRouter from "./auth.router";
import publicRouter from "./public.router";

const router = createRouter();

// version root
router.route("/public", publicRouter);
router.route("/auth", authRouter);

// later:
// router.route("/admin", adminRouter);

export default router;
