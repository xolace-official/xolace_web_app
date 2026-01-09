import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import type { AppBindings } from "../types";

/**
 * Account Status Gate
 *
 * - Runs on every authenticated request
 * - Enforces platform-level access
 * - Does NOT handle roles or permissions
 */

// WhiteListing approach
// Routes that suspended users ARE allowed to write to
const SUSPENSION_WHITELIST = [
  "/api/v1/support/appeals",
  "/api/v1/users/me/export", // Maybe allow data export?
];

export const accountStatusMiddleware = createMiddleware<AppBindings>(
  async (c, next) => {
    const supabase = c.get("supabase");
    const userId = c.get("userId");

    const { data, error } = await supabase
      .from("account_statuses")
      .select("status, reason")
      .eq("user_id", userId)
      .single();

    if (error) {
      // Fail closed — no silent bypass
      throw new HTTPException(500, {
        message: "Failed to resolve account status",
      });
    }

    const status = data?.status ?? "active";

    // Hard stop
    if (status === "deactivated") {
      throw new HTTPException(401, {
        message: "Account deactivated",
      });
    }

    // ------------------------------------------------------
    // CASE 2: SUSPENDED (Soft Block)
    // ------------------------------------------------------
    if (status === "suspended") {
      const method = c.req.method;
      const path = c.req.path;

      // Rule: Allow GET requests (Read Only)
      if (method === "GET") {
        await next();
        return;
      }

      // Rule: Allow Whitelisted Routes
      if (SUSPENSION_WHITELIST.some((p) => path.includes(p))) {
        await next();
        return;
      }

      // Rule: Block everything else (Mutations)
      throw new HTTPException(403, {
        message: data.reason ?? "Account suspended. You are in read-only mode.",
      });
    }

    // Attach for downstream logic
    c.set("accountStatus", status);

    await next();
  },
);
