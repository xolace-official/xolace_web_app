import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import { jsonContent } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

import {
  batchCampfireMembershipResponse,
  batchMembershipBody,
  campfireDetailsParamsSchema,
  campfireDetailsResponse,
  campfireLanesResponse,
  campfireMembershipDetailResponse,
  campfireRealmsResponse,
  discoveryCampfiresQuery,
  discoveryCampfiresResponse,
  getCampfireLanesQuerySchema,
  getCampfireMembershipParamsSchema,
  manageCampfiresPaginatedResponse,
  manageCampfiresQuery,
  manageCampfiresResponse,
  toggleFavoriteBodySchema,
  toggleFavoriteParamsSchema,
  toggleFavoriteResponse,
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

// -----------------------------------------------------------------------------
// Get single campfire membership
// -----------------------------------------------------------------------------

export const getCampfireMembership = createRoute({
  method: "get",
  path: "/{campfireId}/membership",
  summary: "Get user's membership for a campfire",
  description:
    "Returns the authenticated user's membership status for a specific campfire. " +
    "Used by the campfire details page to fetch role, favorite state, and membership status independently.",
  tags,
  request: {
    params: getCampfireMembershipParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      campfireMembershipDetailResponse,
      "Membership information for the campfire",
    ),

    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      createMessageObjectSchema("Unauthorized"),
      "Authentication required",
    ),

    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      createMessageObjectSchema("Invalid campfire ID"),
      "Invalid path parameter",
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
  path: "/lanes",
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

export const getCampfireDetails = createRoute({
  path: "/{slug}",
  method: "get",
  summary: "Get campfire details",
  description:
    "Returns public, stable campfire metadata. This endpoint is cacheable, usable by anonymous users, and does not include membership or user-specific data.",
  tags,

  request: {
    params: campfireDetailsParamsSchema,
  },

  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      campfireDetailsResponse,
      "Campfire details",
    ),

    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      createMessageObjectSchema("Campfire not found"),
      "Campfire does not exist or is not accessible",
    ),

    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      createMessageObjectSchema("Authentication required"),
      "Authentication required",
    ),

    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      internalServerErrorSchema,
      "Internal server error",
    ),
  },
});

export const patchCampfireFavorite = createRoute({
  method: "patch",
  path: "/{campfireId}/favorite",
  summary: "Toggle campfire favorite",
  description: "Sets the is_favorite flag on the user's campfire membership.",
  tags,
  request: {
    params: toggleFavoriteParamsSchema,
    body: jsonContent(toggleFavoriteBodySchema, "Favorite state"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      toggleFavoriteResponse,
      "Updated favorite state",
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      createMessageObjectSchema("Unauthorized"),
      "Auth required",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      createMessageObjectSchema("Membership not found"),
      "Not a member",
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      internalServerErrorSchema,
      "Server error",
    ),
  },
});

export type GetManageCampfiresRoute = typeof getManageCampfires;
export type GetManageCampfiresSimpleRoute = typeof getManageCampfiresSimple;
export type GetDiscoveryCampfiresRoute = typeof getDiscoveryCampfires;
export type GetBatchMembershipRoute = typeof getBatchMembership;
export type GetCampfireRealmsRoute = typeof getCampfireRealms;
export type GetCampfireLanesRoute = typeof getCampfireLanes;
export type GetCampfireMembershipRoute = typeof getCampfireMembership;
export type GetCampfireDetailsRoute = typeof getCampfireDetails;
export type PatchCampfireFavoriteRoute = typeof patchCampfireFavorite;
