import { Scalar } from "@scalar/hono-api-reference";
import { defaultUrl } from "@/utils";
import type { AppOpenAPI } from "./types";

export default function configureOpenAPI(app: AppOpenAPI) {
  app.doc("api/doc", {
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "Xolace Hono API",
    },
  });

  app.get(
    "api/reference",
    Scalar({
      url: `${defaultUrl}/api/doc`,
      theme: "fastify",
      layout: "modern",
      defaultHttpClient: {
        targetKey: "js",
        clientKey: "fetch",
      },
      hideModels: false,
      metaData: {
        title: "Xolace Hono API Reference",
        description: "Xolace Hono API Reference",
      },
      servers: [
        {
          url: `${defaultUrl}`,
          description: "Local server",
        },
      ],
    }),
  );
}
