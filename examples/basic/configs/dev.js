// development config
const { merge } = require("webpack-merge");
const commonConfig = require("./common");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { resolve } = require('path');

module.exports = merge(commonConfig, {
  mode: "development",
  devServer: {
    hot: true,
    historyApiFallback: true,
  },
  devtool: "cheap-module-source-map",
  plugins: [
    new HtmlWebpackPlugin({ 
      template: resolve(__dirname, "../index.html.ejs"),
      removeComments: false,
      minify: false
    }),
  ],
});
