import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import { jsonContent } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";
import {
  preferencesResponse,
  updatePreferencesBody,
} from "./preferences.validation";

const tags = ["Preferences"];

const internalServerErrorSchema = createMessageObjectSchema(
  HttpStatusPhrases.INTERNAL_SERVER_ERROR,
);

const unauthorizedErrorSchema = createMessageObjectSchema(
  HttpStatusPhrases.UNAUTHORIZED,
);

export const getPreferences = createRoute({
  path: "",
  summary: "Get user preferences",
  description: "Get the current user's preferences",
  method: "get",
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      preferencesResponse,
      "The user's preferences",
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      unauthorizedErrorSchema,
      "Authentication required",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      createMessageObjectSchema(HttpStatusPhrases.NOT_FOUND),
      "The user has no preferences",
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      internalServerErrorSchema,
      "Internal Server Error",
    ),
  },
});

export const updatePreferences = createRoute({
  path: "",
  summary: "Update user preferences",
  description: "Partially update the current user's preferences",
  method: "put",
  request: {
    body: jsonContent(updatePreferencesBody, "Preferences update data"),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      preferencesResponse,
      "Updated preferences",
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      createMessageObjectSchema("Bad request"),
      "Invalid request data",
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      unauthorizedErrorSchema,
      "Authentication required",
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      internalServerErrorSchema,
      "Internal server error",
    ),
  },
});

// Types
export type GetPreferencesRoute = typeof getPreferences;
export type UpdatePreferencesRoute = typeof updatePreferences;
