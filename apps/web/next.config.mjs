/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000"]
    }
  },
  transpilePackages: [
    "@pulseboard/ui",
    "@pulseboard/db",
    "@pulseboard/types",
    "@pulseboard/cache",
    "@pulseboard/queue",
    "@pulseboard/email",
    "@pulseboard/plugin-runtime",
    "@pulseboard/plausible-sdk",
    "@pulseboard/ai-engine"
  ]
};

export default nextConfig;
