import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@mini-survey/shared-types'],
};

export default nextConfig;
