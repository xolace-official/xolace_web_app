import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import type { AccountStatus, AppBindings } from "../types";

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
  "/api/v1/auth/profile", // Maybe allow profile update?
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
      // Normalize path to ensure leading slash for safe matching
      const rawPath = c.req.path;
      const path = rawPath.startsWith("/") ? rawPath : `/${rawPath}`;

      console.log("Account Suspended", { method, path });

      // Rule: Allow GET requests (Read Only)
      if (method === "GET") {
        c.set("accountStatus", status);

        await next();
        return;
      }

      // Rule: Allow Whitelisted Routes
      // Exact match OR directory prefix match (e.g. "/foo" matches "/foo" and "/foo/bar" but NOT "/foobar")
      if (
        SUSPENSION_WHITELIST.some(
          (p) => path === p || path.startsWith(p.endsWith("/") ? p : `${p}/`),
        )
      ) {
        c.set("accountStatus", status);

        await next();
        return;
      }

      // Rule: Block everything else (Mutations)
      throw new HTTPException(403, {
        message: data.reason ?? "Account suspended. You are in read-only mode.",
      });
    }

    // Attach for downstream logic
    c.set("accountStatus", status as AccountStatus);

    await next();
  },
);
