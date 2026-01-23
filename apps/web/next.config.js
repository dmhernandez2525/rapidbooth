/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  transpilePackages: ["@rapidbooth/shared"],
};

module.exports = nextConfig;
