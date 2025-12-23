import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import {
  signInRequest,
  signInResponse,
  unauthorizedResponse,
} from "./sign-in.validation";

const tags = ["Auth"];

export const signInRoute = createRoute({
  path: "/",
  summary: "Sign in (for docs/testing only)",
  description: "Sign in to get a bearer token to use in the OpenAPI docs.",
  method: "post",
  tags,
  request: {
    body: jsonContent(signInRequest, "Sign in request"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(signInResponse, "Successful sign-in"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      unauthorizedResponse,
      "Invalid credentials",
    ),
  },
});

export type SignInRoute = typeof signInRoute;
