var webpack = require('webpack');
var OpenBrowserPlugin = require('open-browser-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var precss = require('precss');
var autoprefixer = require('autoprefixer');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var version = require('./package.json').version;


var entry =  __dirname + '/src/index.js';

var output =  {
  filename: 'page/[name]/index.js',
  chunkFilename: 'chunk/[name].[chunkhash:5].chunk.js',
};

// source-map
var devtool = 'source-map';

// eslint
var eslint =  {
  configFile: __dirname + '/.eslintrc.js',
}

// loader
var loaders = [
    {
      test: /\.(json)$/,
      exclude: /node_modules/,
      loader: 'json',
    },
    {
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      loader: 'babel!eslint-loader',
    },
    {
      test: /\.(?:png|jpg|gif)$/,
      loader: 'url?limit=8192',
    },
    {
      test: /\.less/,
      loader: ExtractTextPlugin.extract('style', 'css?modules&localIdentName=[hash:base64:4]!postcss!less'),
    }
];

// dev plugin
var devPlugins =  [
  new CopyWebpackPlugin([
    { from: './src/resource/music/music.mp3' },
    { from: './src/resource/css/loader.css' },
  ]),
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoErrorsPlugin(),
  new OpenBrowserPlugin({
    url: 'http://127.0.0.1:8080/'
  }),
  // css
  new ExtractTextPlugin('css.css', {
    allChunks: true
  }),
]

// production plugin
var productionPlugins = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': '"production"',
  }),
  new CopyWebpackPlugin([
    { from: './src/resource/music/music.mp3' },
    { from: './src/resource/css/loader.css' },
  ]),
  // HTML
  new HtmlWebpackPlugin({
    template: __dirname + '/server/index.tmpl.html'
  }),
  // JS
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    }}
  ),
  // css
  new ExtractTextPlugin('css-' + version + '.css', {
    allChunks: true
  }),
];

// dev server
var devServer = {
  contentBase: './server',
  colors: true,
  historyApiFallback: false,
  port: 8080, // defaults to "8080"
  hot: true, // Hot Module Replacement
  inline: true, // Livereload
  host: '0.0.0.0',
  disableHostCheck: true
};

module.exports = {
  entry: entry,
  devtool: devtool,
  output: output,
  loaders: loaders,
  devPlugins: devPlugins,
  productionPlugins: productionPlugins,
  devServer: devServer,
  postcss: function () {
    return [precss, autoprefixer];
  },
  version: version
};
