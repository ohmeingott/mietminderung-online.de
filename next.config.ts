import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Don't advertise the framework in response headers.
  poweredByHeader: false,
  images: {
    // Modern formats first — smaller payloads help LCP.
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    // lucide-react re-exports hundreds of icons; this keeps the client bundle
    // to the icons actually imported.
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
