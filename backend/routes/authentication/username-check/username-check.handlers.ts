import type { AppRouteHandler } from "@backend/types";
import { createClient } from "@supabase/supabase-js";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { env } from "@/env/server";
import type { UsernameCheckRoute } from "./username-check.routes";

export const checkUsername: AppRouteHandler<UsernameCheckRoute> = async (c) => {
  const { username } = c.req.valid("query");

  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_PUBLISHABLE_KEY);

  const { data } = await supabase
    .from("profiles")
    .select("id")
    .ilike("username", username)
    .maybeSingle();

  console.log("data", data);

  return c.json({ available: !data }, HttpStatusCodes.OK);
};
