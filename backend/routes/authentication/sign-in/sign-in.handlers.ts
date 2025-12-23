import type { AppRouteHandler } from "@backend/types";
import { createClient } from "@supabase/supabase-js";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import { env } from "@/env/server";
import type { SignInRoute } from "./sign-in.routes";

export const signIn: AppRouteHandler<SignInRoute> = async (c) => {
  const { email, password } = c.req.valid("json");

  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_PUBLISHABLE_KEY);

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.session) {
    return c.json(
      {
        message: HttpStatusPhrases.UNAUTHORIZED,
        detail: error?.message,
      },
      HttpStatusCodes.UNAUTHORIZED,
    );
  }

  const session = data.session;

  return c.json(
    {
      access_token: session.access_token,
      refresh_token: session.refresh_token,
      expires_in: session.expires_in,
      token_type: "bearer",
    },
    HttpStatusCodes.OK,
  );
};
