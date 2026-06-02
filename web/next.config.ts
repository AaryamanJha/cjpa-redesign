import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  async headers() {
    return [
      {
        // COOP/COEP required for SharedArrayBuffer (FFmpeg.wasm). Scoped to file-resizer only.
        source: "/portal/file-resizer",
        headers: [
          { key: "Cross-Origin-Opener-Policy",   value: "same-origin" },
          { key: "Cross-Origin-Embedder-Policy",  value: "credentialless" },
        ],
      },
    ];
  },
};

export default nextConfig;
