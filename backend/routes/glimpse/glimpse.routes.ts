import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import { jsonContent } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

import { glimpseFeedQuery, glimpseFeedResponse } from "./glimpse.validation";

const tags = ["Glimpses"];

export const getGlimpseFeed = createRoute({
  method: "get",
  path: "/feed",
  summary: "Get glimpse video feed",
  description:
    "Returns a paginated feed of videos for the Glimpse experience. Supports search, filtering, and feed modes.",
  tags,
  request: {
    query: glimpseFeedQuery,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(glimpseFeedResponse, "List of videos"),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      createMessageObjectSchema("Bad request"),
      "Invalid query parameters",
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      createMessageObjectSchema(HttpStatusPhrases.INTERNAL_SERVER_ERROR),
      "Internal server error",
    ),
  },
});

export type GetGlimpseFeedRoute = typeof getGlimpseFeed;
