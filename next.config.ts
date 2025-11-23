import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  env: {
    TMDB_AUTH_TOKEN: process.env.TMDB_AUTH_TOKEN,
  },
};

export default nextConfig;
