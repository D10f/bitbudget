const path = require(`path`);
const CracoAlias = require("craco-alias");

module.exports = {
  plugins: [
    {
      plugin: CracoAlias,
      options: {
        source: "tsconfig",
        baseUrl: "./src",
        tsConfigPath: "./tsconfig.extend.json"
      }
    }
  ],
  webpack: {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src/"),
        "@assets": path.resolve(__dirname, "src/assets"),
        "@components": path.resolve(__dirname, "src/common/components"),
        "@hooks": path.resolve(__dirname, "src/common/hooks"),
        "@styles": path.resolve(__dirname, "src/common/styles"),
        "@validators": path.resolve(__dirname, "src/common/validators"),
        "@constants": path.resolve(__dirname, "src/common/constants.ts"),
        "@features": path.resolve(__dirname, "src/features"),
        "@layout": path.resolve(__dirname, "src/layout"),
        "@services": path.resolve(__dirname, "src/services"),
        "@utils": path.resolve(__dirname, "src/utils"),
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
  debug: true,
  devServer: {
    open: false,
  },
};
