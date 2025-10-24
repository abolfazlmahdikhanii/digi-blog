/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
    images: {
    remotePatterns: [new URL('https://ik.imagekit.io/gv5d2avxy/**')],
  },
};

export default nextConfig;
