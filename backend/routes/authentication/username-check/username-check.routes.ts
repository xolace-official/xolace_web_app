import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import {
  usernameCheckQuery,
  usernameCheckResponse,
} from "./username-check.validation";

const tags = ["Auth"];

export const usernameCheckRoute = createRoute({
  path: "/",
  summary: "Check username availability",
  description: "Check if a username is already taken.",
  method: "get",
  tags,
  request: {
    query: usernameCheckQuery,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      usernameCheckResponse,
      "Username availability result",
    ),
  },
});

export type UsernameCheckRoute = typeof usernameCheckRoute;
