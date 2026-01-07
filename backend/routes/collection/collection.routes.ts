import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import { jsonContent } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

import {
  collectionItemsResponse,
  collectionsResponse,
  collectionsSimpleResponse,
  createCollectionBody,
  createCollectionResponse,
  deleteCollectionParams,
  getCollectionItemsParams,
  getCollectionItemsQuery,
  getCollectionsQuery,
  saveItemBody,
  saveItemResponse,
  successResponse,
  unsaveItemBody,
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

// =============================================================================
// POST /collections - Create a new collection
// =============================================================================

export const createCollection = createRoute({
  method: "post",
  path: "/",
  summary: "Create a collection",
  description: "Creates a new collection for the user.",
  tags,
  request: {
    body: jsonContent(createCollectionBody, "Collection creation data"),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      createCollectionResponse,
      "Collection created successfully",
    ),

    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      createMessageObjectSchema("Invalid request body"),
      "Bad request",
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
// POST /collections/items - Save item to collection
// =============================================================================

export const saveItem = createRoute({
  method: "post",
  path: "/items",
  summary: "Save item to collection",
  description:
    "Saves an entity to a collection. Can save to an existing collection ID, " +
    "create a new collection by name, or save to 'Favorites' if neither is provided. " +
    "Handles duplicates gracefully.",
  tags,
  request: {
    body: jsonContent(saveItemBody, "Save item data"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      saveItemResponse,
      "Item saved successfully",
    ),

    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      createMessageObjectSchema(
        "Invalid request - cannot provide both ID and Name",
      ),
      "Bad request",
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
// DELETE /collections/items - Unsave item from collection
// =============================================================================

export const unsaveItem = createRoute({
  method: "delete",
  path: "/items",
  summary: "Unsave item from collection",
  description: "Removes an item from a collection. Idempotent.",
  tags,
  request: {
    body: jsonContent(unsaveItemBody, "Unsave item data"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      successResponse,
      "Item removed successfully",
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
// DELETE /collections/:collectionId - Delete collection
// =============================================================================

export const deleteCollection = createRoute({
  method: "delete",
  path: "/:collectionId",
  summary: "Delete collection",
  description: "Permanently deletes a collection and all its items.",
  tags,
  request: {
    params: deleteCollectionParams,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      successResponse,
      "Collection deleted successfully",
    ),

    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      createMessageObjectSchema("Collection not found"),
      "Collection does not exist or user does not own it",
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
// Route Type Exports
// =============================================================================

export type CreateCollectionRoute = typeof createCollection;
export type DeleteCollectionRoute = typeof deleteCollection;
export type SaveItemRoute = typeof saveItem;
export type UnsaveItemRoute = typeof unsaveItem;
