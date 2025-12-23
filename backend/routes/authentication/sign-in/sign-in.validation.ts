import { z } from "@hono/zod-openapi";

export const signInRequest = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export const signInResponse = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  expires_in: z.number(),
  token_type: z.string(),
});

export const unauthorizedResponse = z.object({
  message: z.string(),
  detail: z.string().optional(),
});
