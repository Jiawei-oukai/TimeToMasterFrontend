// next.config.js
module.exports = {
    output: 'export',
    reactStrictMode: true,
    pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
    distDir: 'build',
    images: {
      unoptimized: true,
    },
    env: {
      BE_BASE_URI: 'http://timetomaster-backend-dev.us-east-1.elasticbeanstalk.com',
    },
  };
  