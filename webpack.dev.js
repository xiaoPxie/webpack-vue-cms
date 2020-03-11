// 开发环境配置文件
const merge = require('webpack-merge');  // 引入webpack-merge功能模块
const common = require('./webpack.common.js'); // 引入webpack.common.js
const webpack = require('webpack')

module.exports = merge(common, {   // 将webpack.common.js合并到当前文件
  // 构建本地服务器
  devServer: {
    contentBase: "./dist",   // 本地服务器所加载文件的目录
    //指定要使用的主机。默认情况下这是localhost。如果您希望外部可以访问您的服务器，请像下面这样指定
    host: '0.0.0.0',
    useLocalIp: true, // 不设置此值，默认打开的是0.0.0.0
    port: "8088",  // 设置端口号为8088
    inline: true,  // 文件修改后实时刷新
    historyApiFallback: true, //不跳转
    hot: true     //热加载
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ]
})
