import type { MetadataRoute } from "next";

import { env } from "@/env/server";

const isProduction = env.NODE_ENV === "production";

export default function robots(): MetadataRoute.Robots {
  // 🚫 BLOCK EVERYTHING in staging/dev
  if (!isProduction) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  // ✅ ALLOW ONLY SAFE ROUTES in production
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api", "/(protected)"],
      },
    ],
    sitemap: `${env.APP_URL}/sitemap.xml`,
  };
}
