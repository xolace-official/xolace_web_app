import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { env } from "@/env/server";
import type { Database } from "./types_db";

/**
 * Especially important if using Fluid compute: Don't put this client in a
 * global variable. Always create a new client within each function when using
 * it.
 */
export async function createClient(props?: { admin?: boolean }) {
  const cookieStore = await cookies();

  if (
    !env.SUPABASE_URL ||
    !env.SUPABASE_PUBLISHABLE_KEY ||
    !env.SUPABASE_SECRET_KEY
  ) {
    throw new Error("Missing Supabase environment variables");
  }

  return createServerClient<Database>(
    env.SUPABASE_URL,
    props?.admin ? env.SUPABASE_SECRET_KEY : env.SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            // biome-ignore lint/suspicious/useIterableCallbackReturn: hmm just ignore
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  );
}
