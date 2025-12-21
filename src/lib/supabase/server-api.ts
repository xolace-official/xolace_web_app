import { createClient } from "@supabase/supabase-js";
import { env } from "@/env/server";
import type { Database } from "./types_db";

export function createAuthedSupabase(jwt: string) {
  return createClient<Database>(
    env.SUPABASE_URL,
    env.SUPABASE_PUBLISHABLE_KEY,
    {
      global: {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      },
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );
}
