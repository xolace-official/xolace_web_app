import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import { jsonContent } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

import {
  getCampfirePostsParamsSchema,
  getCampfirePostsQuerySchema,
  getCampfirePostsResponse,
} from "./post.validation";

const tags = ["Posts"];

const internalServerErrorSchema = createMessageObjectSchema(
  HttpStatusPhrases.INTERNAL_SERVER_ERROR,
);

// =============================================================================
// GET /:campfireId/posts - Fetch paginated posts for a campfire
// =============================================================================

export const getCampfirePosts = createRoute({
  path: "/{campfireId}/posts",
  method: "get",
  summary: "Get posts for a campfire",
  description:
    "Returns a paginated list of posts for the specified campfire. " +
    "Uses cursor-based pagination with timestamps for efficient scrolling.",
  tags,
  request: {
    params: getCampfirePostsParamsSchema,
    query: getCampfirePostsQuerySchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getCampfirePostsResponse,
      "Paginated list of posts",
    ),

    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      createMessageObjectSchema("Invalid request parameters"),
      "Invalid campfire ID or query parameters",
    ),

    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      createMessageObjectSchema("Unauthorized"),
      "Authentication required",
    ),

    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      createMessageObjectSchema("Campfire not found"),
      "The specified campfire does not exist",
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

export type GetCampfirePostsRoute = typeof getCampfirePosts;
