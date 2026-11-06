import { createRequire } from "module"

const require = createRequire(import.meta.url)

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    cpus: 1,
    workerThreads: false,
  },
  webpack: (config) => {
    try {
      config.resolve.alias = {
        ...config.resolve.alias,
        "firebase/app": require.resolve("firebase/app"),
        "firebase/firestore": require.resolve("firebase/firestore"),
        "firebase/auth": require.resolve("firebase/auth"),
        "firebase/messaging": require.resolve("firebase/messaging"),
      }
    } catch {
      // Fallback if resolve fails
    }
    return config
  },
}

export default nextConfig
