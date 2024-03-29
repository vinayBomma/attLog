const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const webpack = require('webpack')
// const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')

module.exports = {
  pwa: {
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: "src/firebase-messaging-sw.js"
    }
  },
  chainWebpack: config => {
    config.plugins.delete('prefetch')
  },
  configureWebpack: {
    plugins: [
      new BundleAnalyzerPlugin(),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      // new VuetifyLoaderPlugin()
    ],
    optimization: {
      splitChunks: {
        chunks: 'all'
      }
    },
  },
};