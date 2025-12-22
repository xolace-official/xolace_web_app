import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import { jsonContent } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";
import {
  fullProfileResponse,
  publicProfileResponse,
  updatePrivateProfileBody,
  updatePublicProfileBody,
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

export const getOwnPublicProfile = createRoute({
  path: "",
  summary: "Get Public facing profile data",
  description: "The profile is visible to all users",
  method: "get",
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      publicProfileResponse,
      "The requested Public profile",
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

export const updateUserPublicProfile = createRoute({
  path: "",
  summary: "Update public profile",
  description: "Updates the user's profile",
  method: "put",
  request: {
    body: jsonContent(updatePublicProfileBody, "Profile update data"),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createMessageObjectSchema("OK"),
      "Profile updated",
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      createMessageObjectSchema("Bad request"),
      "Invalid request data",
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      unauthorizedErrorSchema,
      "Authentication Required",
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      internalServerErrorSchema,
      "Internal server error",
    ),
  },
});

export const updateUserPrivateProfile = createRoute({
  path: "/mine",
  summary: "Update private profile",
  description: "Updates the user's private profile",
  method: "put",
  request: {
    body: jsonContent(updatePrivateProfileBody, "Profile update data"),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createMessageObjectSchema("OK"),
      "Profile updated",
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      createMessageObjectSchema("Bad request"),
      "Invalid request data",
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      unauthorizedErrorSchema,
      "Authentication Required",
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      internalServerErrorSchema,
      "Internal server error",
    ),
  },
});

//types
export type GetOwnProfileRoute = typeof getOwnProfile;
export type GetOwnPublicProfileRoute = typeof getOwnPublicProfile;
export type UpdateUserPublicRoute = typeof updateUserPublicProfile;
export type UpdateUserPrivateRoute = typeof updateUserPrivateProfile;
