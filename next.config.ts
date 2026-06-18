// для прокси
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  reactCompiler: true,
  images: {
    remotePatterns: [
      // {
      //   protocol: "https",
      //   hostname: "api.dicebear.com",
      //   pathname: "/**",
      // },
      // {
      //   protocol: "https",
      //   hostname: "guicprnabbwmkpxhhrwg.supabase.co",
      //   pathname: "/storage/v1/object/public/**",
      // },
      {
        protocol: "https",
        hostname: "api.xn--46-6kcay4al8ahci5n.xn--p1ai",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,POST,PUT,DELETE,OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
