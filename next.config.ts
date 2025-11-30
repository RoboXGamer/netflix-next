import type { NextConfig } from "next";
import dns from "dns";

dns.setDefaultResultOrder("ipv4first");

const nextConfig: NextConfig = {
  reactCompiler: true,
  env: {
    TMDB_AUTH_TOKEN: process.env.TMDB_AUTH_TOKEN,
  },
  images: {
    remotePatterns: [
      {
        hostname: "image.tmdb.org",
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;
