const path = require(`path`);

module.exports = {
  webpack: {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src/"),
        "@assets": path.resolve(__dirname, "src/assets"),
        "@components": path.resolve(__dirname, "src/common/components"),
        "@containers": path.resolve(__dirname, "src/common/containers"),
        "@hooks": path.resolve(__dirname, "src/common/hooks"),
        "@styles": path.resolve(__dirname, "src/common/styles"),
        "@validators": path.resolve(__dirname, "src/common/validators"),
        "@features": path.resolve(__dirname, "src/features"),
        "@layout": path.resolve(__dirname, "src/layout"),
        "@services": path.resolve(__dirname, "src/services"),
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
