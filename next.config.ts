import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A stray package-lock.json exists in Peter's home directory; without this
  // Next infers the workspace root as ~ (wrong file tracing, noisy warning).
  outputFileTracingRoot: __dirname,
  async redirects() {
    return [
      {
        source: "/projects/quadrotor",
        destination: "https://github.com/lawpeter/quadrotor-sim",
        permanent: true,
      },
      {
        source: "/devlog/quadrotor-phase-1-physics",
        destination: "https://github.com/lawpeter/quadrotor-sim",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
