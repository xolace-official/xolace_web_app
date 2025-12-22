import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import { jsonContent } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";
import {
  fullProfileResponse,
  privateProfileResponse,
  publicProfileResponse,
} from "./profile.validation";

const tags = ["Profile"];

// error schemas
const internalServerErrorSchema = createMessageObjectSchema(
  HttpStatusPhrases.INTERNAL_SERVER_ERROR,
);

const unauthorizedErrorSchema = createMessageObjectSchema(
  HttpStatusPhrases.UNAUTHORIZED,
);

// routes
export const getOwnProfile = createRoute({
  path: "/me",
  summary: "Get own profile",
  description: "Get user's own profile both public and private",
  method: "get",
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      fullProfileResponse,
      "The requested Profile",
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      unauthorizedErrorSchema,
      "Authentication required",
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      internalServerErrorSchema,
      "Internal Server Error",
    ),
  },
});

//types
export type GetOwnProfileRoute = typeof getOwnProfile;
