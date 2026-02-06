import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  reactCompiler: true,
  experimental: {
    optimizePackageImports: ["lucide-react", "@tabler/icons-react"],
  },
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
      {
        //domain is for dev only
        protocol: "https",
        hostname: "unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      }
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
