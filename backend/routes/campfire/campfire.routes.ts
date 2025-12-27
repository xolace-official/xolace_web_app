import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import { jsonContent } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

import {
  manageCampfiresPaginatedResponse,
  manageCampfiresQuery,
  manageCampfiresResponse,
} from "./campfire.validation";

const tags = ["Campfires"];

const internalServerErrorSchema = createMessageObjectSchema(
  HttpStatusPhrases.INTERNAL_SERVER_ERROR,
);

export const getManageCampfires = createRoute({
  path: "/manage",
  summary: "Get user's campfires",
  description:
    "Returns a list of campfires the authenticated user is a member of. Includes membership metadata and favorite indicators.",
  method: "get",
  request: {
    query: manageCampfiresQuery,
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      manageCampfiresPaginatedResponse,
      "List of campfires the user belongs to",
    ),

    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      createMessageObjectSchema("Bad request"),
      "Invalid query parameters",
    ),

    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      createMessageObjectSchema("Missing or invalid Authorization header"),
      "Authentication required",
    ),

    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      internalServerErrorSchema,
      "Internal server error",
    ),
  },
});

export const getManageCampfiresSimple = createRoute({
  path: "/api/campfires/manage/simple",
  summary: "Get user's campfires (simple)",
  description:
    "Returns all campfires the user belongs to without pagination. Intended for lightweight clients.",
  method: "get",
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      manageCampfiresResponse,
      "List of campfires the user belongs to",
    ),

    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      createMessageObjectSchema("Unauthorized"),
      "Authentication required",
    ),

    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      internalServerErrorSchema,
      "Internal server error",
    ),
  },
});

export type GetManageCampfiresRoute = typeof getManageCampfires;
export type GetManageCampfiresSimpleRoute = typeof getManageCampfiresSimple;
