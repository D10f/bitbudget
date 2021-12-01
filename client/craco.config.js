const path = require(`path`);

module.exports = {
  webpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src/'),
        '@assets': path.resolve(__dirname, 'src/assets'),
        '@components': path.resolve(__dirname, 'src/components'),
        '@pages': path.resolve(__dirname, 'src/pages'),
        '@hooks': path.resolve(__dirname, 'src/hooks'),
        '@services': path.resolve(__dirname, 'src/services'),
        '@constants': path.resolve(__dirname, 'src/utils/constants'),
        '@enums': path.resolve(__dirname, 'src/utils/enums'),
        '@utils': path.resolve(__dirname, 'src/utils'),
      },
    },
    // https://github.com/framer/motion/issues/1307#issuecomment-955877279
    configure: {
      module: {
        rules: [
          {
            type: "javascript/auto",
            test: /\.mjs$/,
            include: /node_modules/,
          },
        ],
      },
    },
  },
  devServer: {
    open: false,
  },
};
