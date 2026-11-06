import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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
    config.resolve.alias = {
      ...config.resolve.alias,
      "firebase/app": path.resolve(__dirname, "node_modules/firebase/app/dist/index.cjs.js"),
      "firebase/firestore": path.resolve(__dirname, "node_modules/firebase/firestore/dist/index.cjs.js"),
      "firebase/auth": path.resolve(__dirname, "node_modules/firebase/auth/dist/index.cjs.js"),
      "firebase/messaging": path.resolve(__dirname, "node_modules/firebase/messaging/dist/index.cjs.js"),
    }
    return config
  },
}

export default nextConfig
