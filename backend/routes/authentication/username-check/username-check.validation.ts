import { z } from "@hono/zod-openapi";

export const usernameCheckQuery = z.object({
  username: z
    .string()
    .min(3)
    .max(30)
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Username can only contain letters, numbers, underscores, and dashes",
    ),
});

export const usernameCheckResponse = z.object({
  available: z.boolean(),
});
