// 生产环境配置文件
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // 引入CleanWebpackPlugin插件

const path = require('path');
const PurifyCssWebpack = require('purifycss-webpack'); // 引入PurifyCssWebpack插件
// const glob = require('glob');  // 引入glob模块,用于扫描全部html文件中所引用的css

module.exports = merge(common, { // 将webpack.common.js合并到当前文件
  // devtool: 'source-map',  // 会生成对于调试的完整的.map文件，但同时也会减慢打包速度
  optimization: {   // 抽离公共的代码，例如：同样的import
    splitChunks: {
      cacheGroups: {  // 能缓存没有更改的包
        // 注意: priority属性
        // 其次: 打包业务中公共代码
        common: {
          name: "common",
          chunks: "all",    // async, initial, all
          minSize: 1,
          priority: 0
        },
        // 首先: 打包node_modules中的文件，第三方库
        vendor: {
          name: "vendor",
          test: /[\\/]node_modules[\\/]/,
          chunks: "all",
          priority: 10
        }
      }
    }
  },
  plugins: [
    // 每次build前，都先clean目录
    new CleanWebpackPlugin({
      cleanStaleWebpackAssets: true, //自动删除未被使用的webpack资源，此选项可能会导致部分样式不会被打包，特别是第三方库
    }),
  ]
})
