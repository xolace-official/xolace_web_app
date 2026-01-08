import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";

import { getCommentsQuery, getCommentsResponse } from "./comment.validation";

const tags = ["Comments"];

const errorSchema = z.object({
  message: z.string(),
});

export const getCommentsRoute = createRoute({
  method: "get",
  path: "/",
  summary: "Fetch comments for a post",
  description:
    "Returns root comments with their nested replies for a given post. Each root comment includes a replies array ordered by thread_path.",
  tags,
  request: {
    query: getCommentsQuery,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(getCommentsResponse, "List of comments"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorSchema,
      "Authentication required",
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(errorSchema, "Bad request"),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorSchema,
      "Internal server error",
    ),
  },
});

export type GetCommentsRoute = typeof getCommentsRoute;
