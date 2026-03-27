import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ['http://172.25.128.1:3000', 'http://localhost:3000', 'http://[IP_ADDRESS]'],
  async redirects() {
    return [
      {
        source: '/login',
        destination: 'https://webmail.ksamail.com/',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
