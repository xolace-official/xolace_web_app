import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import { jsonContent } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

import {
  batchCampfireMembershipResponse,
  batchMembershipBody,
  campfireLanesResponse,
  campfireRealmsResponse,
  discoveryCampfiresQuery,
  discoveryCampfiresResponse,
  getCampfireLanesQuerySchema,
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

export const getDiscoveryCampfires = createRoute({
  path: "/discovery",
  summary: "Discover campfires",
  description:
    "Returns a paginated list of public campfires. Supports filtering by realm, lane, and search queries.",
  method: "get",
  request: {
    query: discoveryCampfiresQuery,
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      discoveryCampfiresResponse,
      "List of campfires",
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      createMessageObjectSchema("Bad request"),
      "Invalid query parameters",
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      internalServerErrorSchema,
      "Internal server error",
    ),
  },
});

export const getBatchMembership = createRoute({
  path: "/memberships",
  summary: "Get batch membership status",
  description:
    "Returns membership status for a list of campfire IDs. Used to overlay user-specific data on public lists.",
  method: "post",
  request: {
    body: jsonContent(batchMembershipBody, "List of campfire IDs"),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      batchCampfireMembershipResponse,
      "Map of campfire IDs to membership status",
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

export const getCampfireRealms = createRoute({
  path: "/realms",
  method: "get",
  summary: "Get campfire realms",
  description: "Returns all active campfire realms used for discovery tabs.",
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      campfireRealmsResponse,
      "List of campfire realms",
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

export const getCampfireLanes = createRoute({
  method: "get",
  path: "/campfires/lanes",
  summary: "Get campfire lanes by realm",
  tags: ["Campfires"],
  request: {
    query: getCampfireLanesQuerySchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      campfireLanesResponse,
      "List of campfire lanes",
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
export type GetDiscoveryCampfiresRoute = typeof getDiscoveryCampfires;
export type GetBatchMembershipRoute = typeof getBatchMembership;
export type GetCampfireRealmsRoute = typeof getCampfireRealms;
export type GetCampfireLanesRoute = typeof getCampfireLanes;
