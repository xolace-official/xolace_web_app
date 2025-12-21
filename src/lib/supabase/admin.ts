import { createClient } from "@supabase/supabase-js";
import { env } from "@/env/server";
import type { Database } from "./types_db";

/**
 * Service-role Supabase client
 * - Bypasses RLS
 * - NEVER exposed to clients
 * - Backend-only
 */
export function createServiceSupabase() {
  if (!env.SUPABASE_SECRET_KEY) {
    throw new Error("SUPABASE_SECRET_KEY is missing");
  }

  return createClient<Database>(env.SUPABASE_URL, env.SUPABASE_SECRET_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
