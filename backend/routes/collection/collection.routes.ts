import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import { jsonContent } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

import {
  collectionItemsResponse,
  collectionsResponse,
  collectionsSimpleResponse,
  getCollectionItemsParams,
  getCollectionItemsQuery,
  getCollectionsQuery,
} from "./collection.validation";

const tags = ["Collections"];

const internalServerErrorSchema = createMessageObjectSchema(
  HttpStatusPhrases.INTERNAL_SERVER_ERROR,
);

// =============================================================================
// GET /collections - Paginated list of user's collections
// =============================================================================

export const getCollections = createRoute({
  method: "get",
  path: "/",
  summary: "Get user's collections",
  description:
    "Returns a paginated list of collections owned by the authenticated user. " +
    "Collections are ordered by: pinned status (desc), position (asc), created_at (desc). " +
    "Use the `limit` query param for sidebar preview (e.g., 3-5 items).",
  tags,
  request: {
    query: getCollectionsQuery,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      collectionsResponse,
      "List of user's collections with item counts",
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

// =============================================================================
// GET /collections/simple - Simple list for sidebar (no pagination)
// =============================================================================

export const getCollectionsSimple = createRoute({
  method: "get",
  path: "/simple",
  summary: "Get user's collections (simple)",
  description:
    "Returns a simple list of collections without pagination metadata. " +
    "Intended for sidebar previews. Use `limit` to restrict results (default: 5).",
  tags,
  request: {
    query: getCollectionsQuery,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      collectionsSimpleResponse,
      "Simple list of collections",
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

// =============================================================================
// GET /collections/:collectionId/items - Collection items with hydrated entities
// =============================================================================

export const getCollectionItems = createRoute({
  method: "get",
  path: "/:collectionId/items",
  summary: "Get items in a collection",
  description:
    "Returns a paginated list of items in a collection with hydrated entity data. " +
    "Items are ordered by: pinned status (desc), position (asc), created_at (desc). " +
    "Orphaned items (deleted entities) are silently filtered out. " +
    "Use `entity_type` to filter by content type.",
  tags,
  request: {
    params: getCollectionItemsParams,
    query: getCollectionItemsQuery,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      collectionItemsResponse,
      "Collection metadata and paginated items with hydrated entities",
    ),

    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      createMessageObjectSchema("Invalid collection ID or query parameters"),
      "Bad request",
    ),

    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      createMessageObjectSchema("Unauthorized"),
      "Authentication required",
    ),

    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      createMessageObjectSchema("Collection not found"),
      "Collection does not exist or user does not own it",
    ),

    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      internalServerErrorSchema,
      "Internal server error",
    ),
  },
});

// =============================================================================
// Route Type Exports
// =============================================================================

export type GetCollectionsRoute = typeof getCollections;
export type GetCollectionsSimpleRoute = typeof getCollectionsSimple;
export type GetCollectionItemsRoute = typeof getCollectionItems;
