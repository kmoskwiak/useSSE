// production config
const { merge } = require("webpack-merge");
const { resolve } = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const commonConfig = require("./common");

module.exports = merge(commonConfig, {
  mode: "development",
  output: {
    filename: "js/bundle.[contenthash].min.js",
    path: resolve(__dirname, "../dist"),
    publicPath: "/static/",
  },
  devtool: "source-map",
  plugins: [
    new HtmlWebpackPlugin({ 
      template: resolve(__dirname, "../index.html.ejs"),
      removeComments: false,
      minify: false
    }),
  ],
});
