// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   reactCompiler: true,
// };

// export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.dicebear.com",
        pathname: "/7.x/**",
      },
      {
        protocol: "https",
        hostname: "guicprnabbwmkpxhhrwg.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
