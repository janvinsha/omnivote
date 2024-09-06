/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["etherscan.io", "ipfs.io","ipfs.infura.io"],
  },
};

export default nextConfig;
