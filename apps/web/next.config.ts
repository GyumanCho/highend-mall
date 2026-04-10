import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // 모노레포 워크스페이스 패키지를 Next/Turbopack이 transpile 대상에 포함시킴
  transpilePackages: ["@repo/api", "@repo/db", "@repo/shared", "@repo/design-tokens"],
  // pnpm 모노레포에서 outputFileTracing 루트를 명시 (workspace 루트 기준)
  outputFileTracingRoot: path.join(__dirname, "../.."),
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
    ],
  },
};

export default nextConfig;
