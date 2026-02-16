import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  typescript: {
    // !! PERINGATAN !!
    // Ini akan mengizinkan build berhasil meskipun ada error TypeScript.
    ignoreBuildErrors: true,
  },
};

export default nextConfig;