// production config
const { merge } = require("webpack-merge");
const { resolve } = require("path");
const CopyPlugin = require('copy-webpack-plugin');
const commonConfig = require("./common");

module.exports = merge(commonConfig, {
  entry: resolve(__dirname, "../index.server.ts"),
  mode: "production",
  target: 'node',
  output: {
    filename: "js/server.js",
    path: resolve(__dirname, "../dist-server"),
  },
  devtool: "cheap-module-source-map",
  externals: {},
  plugins: [
    new CopyPlugin({
        patterns: [
          {
            from: resolve(__dirname, '../index.html.ejs'),
            to: './js'
          },
        ]
    }),
  ]
});
