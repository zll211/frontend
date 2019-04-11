const utils = require('./utils');
const webpackMerge = require('webpack-merge');
// const BundleAnalyzerPlugin =
// require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const baseWebpackConfig = require('./webpack.base.conf');
const METADATA = webpackMerge(baseWebpackConfig().metadata, {
  host: '0.0.0.0',
  port: 3005,
});

process.env.NODE_ENV = process.env.NODE_ENV ?
  process.env.NODE_ENV : 'development';

module.exports = function() {
  return webpackMerge(baseWebpackConfig(), {
    mode: 'development',
    devtool: 'cheap-module-source-map',
    output: {
      path: utils.root('dist'),
      filename: '[name].bundle.js',
      sourceMapFilename: '[file].map',
      chunkFilename: '[id].chunk.js',
    },
    module: {
      rules: utils.styleLoaders({sourceMap: false}),
      /* rules: [
       {
         test: /\.css$/,
         use: ['vue-style-loader', 'css-loader', {
           loader: 'postcss-loader', options: {
             ident: 'postcss',
             plugins: (loader) => [
               require('postcss-import')({root: loader.resourcePath}),
               require('autoprefixer')(),
             ],
           },
         }],
       },
       {
         test: /\.scss/,
         use: ['vue-style-loader', 'css-loader', {
           loader: 'postcss-loader', options: {
             ident: 'postcss',
             plugins: (loader) => [
               require('postcss-import')({root: loader.resourcePath}),
               require('autoprefixer')(),
             ],
           },
         }, 'sass-loader'],
       },
     ],*/
    },
    plugins: [
      // new BundleAnalyzerPlugin(),
    ],
    devServer: {
      // contentBase: utils.root('src'),
      host: METADATA.host,
      port: METADATA.port,
      inline: true,
      historyApiFallback: true,
      watchOptions: {
        // if you're using Docker you may need this
        // aggregateTimeout: 300,
        // poll: 1000,
        ignored: /node_modules/,
      },
      /* https: true, */
      /* https: {
        key: fs.readFileSync("cert/server.key"),
        cert: fs.readFileSync("cert/server.crt"),
        ca: fs.readFileSync("cert/ca.pem"),
      }, */
      proxy: {
        '/api': {
          target: 'https://pis.hzztai.com',
          // target: 'http://192.168.1.50:801',
          secure: false,
          changeOrigin: true,
        },
        '/image.php': {
          // target: 'http://pis.test:801',
          // target: 'http://192.168.1.91:8012',
          target: 'https://pis.hzztai.com',
          secure: false,
          changeOrigin: true,
        },
        '/upload': {
          target: 'https://pis.hzztai.com',
          // target: 'http://pis.test:801',
          secure: false,
          changeOrigin: true,
        },
        '/public': {
          target: 'https://pis.hzztai.com',
          // target: 'http://pis.test:801',
          secure: false,
          changeOrigin: true,
        },
      },
    },
    performance: {
      // hints: 'warning',
    },
  });
};
