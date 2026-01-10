import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.postimg.cc",
      },
      // অন্য যেকোনো image hostname এখানে যোগ করো
    ],
  },
};

export default nextConfig;
