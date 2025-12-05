import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  client: {
    NEXT_PUBLIC_AUTH_IMAGE_URL: z.string().min(1),
    NEXT_PUBLIC_NODE_ENV: z.enum(["development", "production", "test"]),
  },
  runtimeEnv: {
    NEXT_PUBLIC_AUTH_IMAGE_URL: process.env.NEXT_PUBLIC_AUTH_IMAGE_URL,
    NEXT_PUBLIC_NODE_ENV: process.env.NODE_ENV,
  },
});
