import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import { jsonContent } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

import {
  healthTipCategoriesResponse,
  healthTipDetailSchema,
  healthTipSourcesResponse,
  healthTipsFeedPaginatedResponse,
  healthTipsFeedQuery,
} from "./health-tip.validation";

const tags = ["Health Tips"];

const internalServerErrorSchema = createMessageObjectSchema(
  HttpStatusPhrases.INTERNAL_SERVER_ERROR,
);

export const getHealthTipCategories = createRoute({
  path: "/categories",
  summary: "Get health tip categories",
  description:
    "Returns active health tip categories for use in feed tabs and filtering.",
  method: "get",
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      healthTipCategoriesResponse,
      "List of active health tip categories",
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

export const getHealthTipsFeed = createRoute({
  path: "/",
  summary: "Get health tips feed",
  description:
    "Returns a paginated list of published health tips. Supports category, tag, and language filtering.",
  method: "get",
  request: {
    query: healthTipsFeedQuery,
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      healthTipsFeedPaginatedResponse,
      "Paginated list of health tips",
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

export const getHealthTipBySlug = createRoute({
  path: "/by-slug/{slug}",
  summary: "Get health tip by slug",
  description: "Returns the full content of a published health tip by slug.",
  method: "get",
  request: {
    params: z.object({
      slug: z
        .string()
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
        .openapi({
          example: "managing-anxiety-at-night",
          description: "Health tip slug",
        }),
    }),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      healthTipDetailSchema,
      "Health tip detail",
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      createMessageObjectSchema("Bad request"),
      "Invalid slug format",
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      createMessageObjectSchema("Missing or invalid Authorization header"),
      "Authentication required",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      createMessageObjectSchema("Health tip not found"),
      "Health tip does not exist or is not published",
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      internalServerErrorSchema,
      "Internal server error",
    ),
  },
});

export const getHealthTipById = createRoute({
  path: "/{id}",
  summary: "Get health tip by ID",
  description: "Returns the full content of a published health tip by ID.",
  method: "get",
  request: {
    params: z.object({
      id: z.uuid().openapi({
        example: "550e8400-e29b-41d4-a716-446655440000",
        description: "Health tip ID",
      }),
    }),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      healthTipDetailSchema,
      "Health tip detail",
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      createMessageObjectSchema("Bad request"),
      "Invalid health tip ID",
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      createMessageObjectSchema("Missing or invalid Authorization header"),
      "Authentication required",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      createMessageObjectSchema("Health tip not found"),
      "Health tip does not exist or is not published",
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      internalServerErrorSchema,
      "Internal server error",
    ),
  },
});

export const getHealthTipSources = createRoute({
  path: "/{id}/sources",
  summary: "Get health tip sources",
  description: "Returns sources and references used for a specific health tip.",
  method: "get",
  request: {
    params: z.object({
      id: z.uuid().openapi({
        example: "550e8400-e29b-41d4-a716-446655440000",
        description: "Health tip ID",
      }),
    }),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      healthTipSourcesResponse,
      "Health tip sources and references",
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      createMessageObjectSchema("Bad request"),
      "Invalid health tip ID",
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      createMessageObjectSchema("Missing or invalid Authorization header"),
      "Authentication required",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      createMessageObjectSchema("Health tip not found"),
      "Health tip does not exist or has no sources",
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      internalServerErrorSchema,
      "Internal server error",
    ),
  },
});

export type GetHealthTipCategoriesRoute = typeof getHealthTipCategories;

export type GetHealthTipsFeedRoute = typeof getHealthTipsFeed;

export type GetHealthTipByIdRoute = typeof getHealthTipById;

export type GetHealthTipBySlugRoute = typeof getHealthTipBySlug;

export type GetHealthTipSourcesRoute = typeof getHealthTipSources;
