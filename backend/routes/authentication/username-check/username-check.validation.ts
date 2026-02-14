import { z } from "@hono/zod-openapi";

export const usernameCheckQuery = z.object({
  username: z.string().min(3),
});

export const usernameCheckResponse = z.object({
  available: z.boolean(),
});
