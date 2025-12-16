import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        //domain is for dev only
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
        //domain is for dev only
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;

// for later use
// Agent// import { fileURLToPath } from "node:url";
// import { createJiti } from "jiti";

// const jiti = createJiti(fileURLToPath(import.meta.url));

// Import env here to validate during build. Using jiti@^1 we can import .ts files :)
// await jiti.import("./src/env");
