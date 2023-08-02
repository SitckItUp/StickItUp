/** @type {import('next').NextConfig} */
// const nextConfig = {

// }

module.exports = {
  webpack: (config) => {
    config.resolve.fallback = { fs: false, path: false, crypto: false };
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/editor",
        headers: [
          {
            key: "Content-Type",
            value: "text/html",
          },
        ],
      },
    ];
  },
};
