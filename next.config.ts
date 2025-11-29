import type { NextConfig } from "next";
import dns from "dns";

dns.setDefaultResultOrder("ipv4first");

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  env: {
    TMDB_AUTH_TOKEN: process.env.TMDB_AUTH_TOKEN,
  },
};

export default nextConfig;
