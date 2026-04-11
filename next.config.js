







const { i18n } = require('./next-i18next.config');

/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n,
  eslint: {
    ignoreDuringBuilds: true,
  },
  sassOptions: {
    quietDeps: true, // This will silence deprecation warnings
    silenceDeprecations: [
      "mixed-decls",
      "legacy-js-api",
      "import",
      "slash-div",
      "global-builtin",
    ],
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '16.16.211.219',
        port: '5000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '16.16.211.219',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '35.154.81.186',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'homez-q5lh.onrender.com',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
