import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  client: {
    NEXT_PUBLIC_AUTH_IMAGE_URL: z.string().min(1),
    NEXT_PUBLIC_NODE_ENV: z.enum(["development", "production", "test"]),
    NEXT_PUBLIC_SUPABASE_URL: z.string().min(1),
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
  },
  runtimeEnv: {
    NEXT_PUBLIC_AUTH_IMAGE_URL: process.env.NEXT_PUBLIC_AUTH_IMAGE_URL,
    NEXT_PUBLIC_NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  },
});
