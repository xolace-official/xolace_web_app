import { createClient } from "@supabase/supabase-js";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import { env } from "@/env/server";
import { createAuthedSupabase } from "@/lib/supabase/server-api";
import type { AppBindings } from "../types";

/**
 * Auth middleware (JWT-based, stateless)
 *
 * - Extracts Bearer token
 * - Verifies user via Supabase Auth
 * - Attaches:
 *   - user
 *   - userId
 *   - supabase (RLS-enforced, user-scoped)
 */
export const authMiddleware = createMiddleware<AppBindings>(async (c, next) => {
  const authorization = c.req.header("Authorization");

  if (!authorization?.startsWith("Bearer ")) {
    throw new HTTPException(401, {
      message: "Missing or invalid Authorization header",
    });
  }

  const jwt = authorization.slice("Bearer ".length).trim();

  if (!jwt) {
    throw new HTTPException(401, { message: "Empty bearer token" });
  }

  /**
   * STEP 1: Verify JWT + fetch user
   *
   * We intentionally use a lightweight auth-only client here.
   * No cookies. No session persistence.
   */
  const authClient = createClient(
    env.SUPABASE_URL,
    env.SUPABASE_PUBLISHABLE_KEY,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );

  const {
    data: { user },
    error,
  } = await authClient.auth.getUser(jwt);

  if (error || !user) {
    throw new HTTPException(401, {
      message: error?.message ?? "Invalid or expired token",
    });
  }

  /**
   * STEP 2: Create user-scoped Supabase client (RLS enforced)
   */
  const supabase = createAuthedSupabase(jwt);

  /**
   * STEP 3: Attach to request context
   */
  c.set("user", user);
  c.set("userId", user.id);
  c.set("supabase", supabase);

  await next();
});
