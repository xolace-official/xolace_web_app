// backend/types.ts

import type { OpenAPIHono, RouteConfig, RouteHandler } from "@hono/zod-openapi";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import type { Schema } from "hono";
import type { Database } from "@/lib/supabase/types_db";

export type AccountStatus = "active" | "suspended" | "deactivated";

export interface AppBindings {
  Variables: {
    supabase: SupabaseClient<Database>;
    user: User;
    userId: string;
    accountStatus: AccountStatus;
  };
}

export type AppOpenAPI<S extends Schema = Record<string, never>> = OpenAPIHono<
  AppBindings,
  S
>;

export type AppRouteHandler<R extends RouteConfig> = RouteHandler<
  R,
  AppBindings
>;
