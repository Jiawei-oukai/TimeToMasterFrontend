// next.config.js
module.exports = {
    // output: 'export',
    reactStrictMode: true,
    pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
    // distDir: 'build',
    distDir: '.next',
    images: {
      unoptimized: true,
    },
    env: {
      BE_BASE_URI: 'http://timetomaster-backend-dev.us-east-1.elasticbeanstalk.com',
      // BE_BASE_URI: 'http://localhost:8080',
    },
  };
  