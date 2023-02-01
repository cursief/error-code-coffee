const path = require('path');

/**
 * @type {import('next-react-svg').NextReactSvgConfig}
 */
const nextReactSvgConfig = {
  include: path.resolve(__dirname, 'src/assets/svg'),
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  sassOptions: {
    includePaths: [ path.join(__dirname, 'styles') ],
  },
};

const withReactSvg = require('next-react-svg')(nextReactSvgConfig);

module.exports = withReactSvg(nextConfig);
