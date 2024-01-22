/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push("phaser");
      config.externals.push("html-imports");
    }
    return config;
  },
};

module.exports = nextConfig;
