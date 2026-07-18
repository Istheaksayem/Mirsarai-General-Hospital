import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "mirsarai-general-hospital.onrender.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;