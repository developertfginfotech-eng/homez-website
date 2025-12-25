/** @type {import('next').NextConfig} */
const nextConfig = {
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
        port: '5000',
        pathname: '/uploads/**',
      },
    ],
  },
};

module.exports = nextConfig;
