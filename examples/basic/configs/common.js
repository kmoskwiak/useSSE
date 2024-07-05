// shared config (dev and prod)
const { resolve } = require("path");

module.exports = {
  entry: resolve(__dirname, "../index.client.ts"),
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
  context: resolve(__dirname, "../../../"),
  module: {
    rules: [
      {
        test: [/\.jsx?$/, /\.tsx?$/],
        use: ["babel-loader"],
        exclude: /node_modules/,
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          "file-loader?hash=sha512&digest=hex&name=img/[contenthash].[ext]&publicPath=/static/",
        ],
      },
    ],
  },
};
