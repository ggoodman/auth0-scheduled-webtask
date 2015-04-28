//var NgAnnotatePlugin = require("ng-annotate-webpack-plugin");
var BowerWebpackPlugin = require("bower-webpack-plugin");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var Path = require("path");
var SwigWebpackPlugin = require("swig-webpack-plugin");
var Webpack = require("webpack");

module.exports = {
  cache: true,
  //devtool: "source-map",
  context: __dirname,
  entry: {
    tasker: [__dirname + "/web/src/entry/tasker.js"],
  },
  output: {
    path: Path.join(__dirname, "web", "static"),
    filename: "build/[name]-[hash].js",
    chunkFilename: "build/[name]-[hash].js",
    publicPath: "/static/",
  },
  module: {
    loaders: [
      { test: /[\/\\]ace\.js$/, loader: "exports-loader?window.ace" },
      { test: /[\/\\]angular\.js$/, loader: "exports-loader?window.angular" },
      { test: /[\/\\]angular-animate\.js$/, loader: "exports-loader?'ngAnimate'" },
      { test: /[\/\\]angular-aria\.js$/, loader: "exports-loader?'ngAria'" },
      { test: /[\/\\]angular-material\.js$/, loader: "exports-loader?'ngMaterial'" },
      { test: /[\/\\]ct-ui-router-extras\.js$/, loader: "exports-loader?'ct.ui.router.extras'" },
      { test: /[\/\\]ui-bootstrap-tpls\.js$/, loader: "exports-loader?'ui.bootstrap'" },

      { test: /\.css$/,   loader: ExtractTextPlugin.extract("style-loader", "css-loader!autoprefixer-loader") },
      { test: /\.less$/,  loader: ExtractTextPlugin.extract("style-loader", "css-loader!autoprefixer-loader!less-loader") },
      { test: /\.woff$/,  loader: "url-loader?limit=10000&mimetype=application/font-woff" },
      { test: /\.ttf$/,   loader: "file-loader" },
      { test: /\.eot$/,   loader: "file-loader" },
      { test: /\.svg$/,   loader: "file-loader" },
      { test: /\.html$/,  loader: "raw-loader" },
      { test: /\.json$/,  loader: "json-loader" },
    ],
    noParse: [
      /\/ace\.js$/,
      // require.resolve("angular"),
    ]
  },
  plugins: [
    new BowerWebpackPlugin(),
    new Webpack.optimize.DedupePlugin(),
    new ExtractTextPlugin("build/[name]-[contenthash].css"),
    new SwigWebpackPlugin({
      template: "web/src/index.html",
      filename: "index.html",
      watch: __dirname + "/web/static/**/*",
    })
  ],
  resolve: {
    modulesDirectories: ["node_modules", "bower_components", "web/src"],
    root: __dirname,
    alias: {
    },
  },
};

