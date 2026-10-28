import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  // Cache Components is deliberately off: it is not reliable on the Cloudflare Workers runtime.
  // Every page is statically generated at build time instead.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  experimental: {
    // Enquiry form accepts a buyer specification file up to 5 MB (+ multipart overhead).
    serverActions: { bodySizeLimit: "6mb" },
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    // /quality was briefly the address of Manufacturing & Quality; keep old links working.
    return [{ source: "/quality", destination: "/manufacturing", permanent: true }];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      {
        // Scroll-video frame sequences are immutable once extracted.
        source: "/sequences/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;

// Makes Cloudflare bindings (R2, vars, secrets from .dev.vars) available during `next dev`.
initOpenNextCloudflareForDev();
