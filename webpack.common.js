// 公共webpack配置文件
const path = require('path')  // 路径处理模块
const webpack = require('webpack')  // 这个插件不需要安装，是基于webpack的，需要引入webpack模块
const HtmlWebpackPlugin = require('html-webpack-plugin') // 引入HtmlWebpackPlugin插件
// const ExtractTextPlugin = require('extract-text-webpack-plugin') //引入分离插件，用于分离css/scss
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const PurifyCSS = require("purifycss-webpack");
const glob = require("glob-all");

module.exports = {
  // __dirname是node.js中的一个全局变量，它指向当前执行脚本所在的目录，即C:/webpack-project
  // entry: ["babel-polyfill", path.join(__dirname, "/src/main.js")], // 入口文件
  entry: [path.join(__dirname, "/src/main.js")], // 入口文件
  // 多出口：/dist目录下输出多个js文件
  output: {
    path: path.join( __dirname, "/dist"), //打包后的文件存放的地方
    // filename: './js/[name].[chunkhash].bundle.js',
    // chunkFilename: './js/[name].[chunkhash].chunk.js',
    filename: './js/[name].[hash].bundle.js',
    chunkFilename: './js/[name].[hash].chunk.js',
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': path.resolve('src')  // 参考vue-cli脚手架，弄个src目录的快捷符
    }
  },
  //loaders配置存放处：通过不同的loader，webpack有能力调用外部的脚本或工具，实现对不同格式的文件的处理
  module: {
    rules: [
      {
        test: /\.css$/,   // 正则匹配以.css结尾的文件
        use: [
            process.env.NODE_ENV !== 'production'
                ? 'vue-style-loader'
                : {
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                      publicPath: '../',
                      // hmr: process.env.NODE_ENV === 'production',
                    },
                  },
            'css-loader',
            'postcss-loader'
        ],
      },
      {
        test: /\.(scss|sass)$/,   // 正则匹配以.scss和.sass结尾的文件
        use: [
            process.env.NODE_ENV !== 'production'
                ? 'vue-style-loader'
                : {
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                      publicPath: '../',
                      // hmr: process.env.NODE_ENV === 'production',
                    },
                  },
            'css-loader',
            'postcss-loader',
            "sass-loader",
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,    //字体解析
        // use: ['file-loader'],
        use: {
          loader: 'file-loader',
          options: {
            outputPath: './css/font'  // 设置打包后图片存放的文件夹名称
          }
        }
      },
      {
        test: /\.(png|jpg|svg|gif)$/,  // 正则匹配图片格式名
        use: [
          {
            loader: 'url-loader',  // 使用url-loader
            options: {
              limit: 1000,  // 限制只有小于1kb的图片才转为base64
              outputPath: 'images',  // 设置打包后图片存放的文件夹名称
              esModule: false // 启用CommonJS模块语法，解决<img src=[object Module] />的问题
            }
          }
        ]
      },
      {                             // js编译 babel处理
        test: /(\.jsx|\.js)$/,
        use: {                    // 注意use选择如果有多项配置，可写成这种对象形式
          loader: "babel-loader"
        },
        exclude: /node_modules/   // 排除匹配node_modules模块
      },
      {
        test: /\.vue$/,
        loader: {
          loader: 'vue-loader',
        },
      },
    ]
  },
  externals: {
    'vue': 'Vue',
    'vue-router': 'VueRouter',
    'vuex': 'Vuex',
    'axios':'axios',
    'element-ui': 'ElementUI',
  },
  plugins: [
    new webpack.BannerPlugin('版权所有'),
    new HtmlWebpackPlugin({
      title: 'vue2.x + webpack4.x后台管理demo',
      filename: 'index.html',
      template: path.join(__dirname, "/public/index.template.html"),
      // inject: 'body',
      favicon: path.join(__dirname, "/public/favicon.ico"),
      minify: {
        removeAttributeQuotes: true // 移除属性的引号
      }
    }),
    // new ExtractTextPlugin('css/index.css'), // 将css分离到/dist文件夹下的css文件夹中的index.css
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: './css/[name].[hash].css',
      chunkFilename: './css/[name].[hash].css',
    }),
    // 清理多余的css样式，例如没有引用的css样式，不会出现在打包后的css文件中
    new PurifyCSS({
      paths: glob.sync([
        path.join(__dirname,'./dist/*.html'),
        path.join(__dirname,'./dist/css/*.css'),//目录太深可以用匹配符'./dist/**/*.css'
        path.join(__dirname,'./dist/js/*.js')//目录太深可以用匹配符'./dist/**/*.js'
      ])
    }),
  ]
}
