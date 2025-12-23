import configureOpenAPI from "@backend/configure-open-api";
import createApp from "@backend/create-app";
import rootRouter from "@backend/routes/root.router";
import { cors } from "hono/cors";
import { handle } from "hono/vercel";
import { defaultUrl } from "@/utils";

// export const runtime = "edge";

const app = createApp();

configureOpenAPI(app);

// CORS applies to everything
app.use(
  "/*",
  cors({
    origin: [defaultUrl, "http://localhost:3000"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    maxAge: 3600,
  }),
);

// mount backend
app.route("/api/", rootRouter);

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export const PATCH = handle(app);
