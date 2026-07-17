import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A stray package-lock.json exists in Peter's home directory; without this
  // Next infers the workspace root as ~ (wrong file tracing, noisy warning).
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
