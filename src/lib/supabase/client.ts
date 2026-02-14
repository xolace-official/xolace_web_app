import { createBrowserClient } from "@supabase/ssr";
import { env } from "@/env/client";
import type { Database } from "./types_db";

export function createBrowserSupabase() {
  return createBrowserClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
}
