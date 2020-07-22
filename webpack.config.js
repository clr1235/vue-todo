const path = require('path')
// 单独引入这个是为了解决error：vue-loader was used without the corresponding plugin. 
// Make sure to include VueLoaderPlugin in your webpack config.
// vue-loader在15.*版本之后的版本都是  vue-loader的使用都是需要伴生 VueLoaderPlugin的,
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HTMLPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
// webpack4.0 以上使用mini-css-extract-plugin压缩分离css
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// 清除打包生成的文件
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development'

const config = {
  target: 'web',
  entry: path.resolve(__dirname, 'src/index.js'),
  output: {
    filename: 'bundle.[hash:8]js',
    path: path.resolve(__dirname, 'dist'),
    
  },
  module: {
    rules: [
      {
        test: /\.jsx$/,
        loader: 'babel-loader'
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.(png|gif|jpg|jpeg|svg)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 1024,
            name: '[name].[ext]'
          }
        }]
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: isDev ? '"development"' : '"production"'
      }
    }),
    new VueLoaderPlugin(),
    new HTMLPlugin()
  ]
}


if(isDev){
  config.module.rules.push({
    test: /\.scss/,
    use: [
      'style-loader', 
      'css-loader', 
      {
        loader: 'postcss-loader',
        options: {
          sourceMap: true
        }
      },
      'sass-loader'
    ]
  })
  config.devtool = '#cheap-module-eval-source-map'
  config.devServer = {
    port: 9000,
    host: '0.0.0.0',
    overlay: {
      errors: true
    },
    hot: true
  }
  config.plugins.push(
    new CleanWebpackPlugin({
      verbose: false,  //开启在控制台输出信息
      root: path.resolve(__dirname, `./dist`)   // 根目录
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  )
} else {
  config.entry = {
    app: path.resolve(__dirname, 'src/index.js')
  }
  config.output.filename = '[name].[chunkhash:8].js'
  config.module.rules.push({
    test: /\.scss/,
    use: [
      MiniCssExtractPlugin.loader, 
      'css-loader', 
      {
        loader: 'postcss-loader',
        options: {
          sourceMap: true
        }
      },
      'sass-loader'
    ]
  })
  config.plugins.push(
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].[contenthash:8].css',
      chunkFilename: '[name].[id].[contenthash:8].css',
    })
  )
  config.optimization = {
    splitChunks: {
      chunks: "all",  // async表示抽取异步模块，all表示对所有模块生效，initial表示对同步模块生效
      // 缓存组
      cacheGroups: {
        default: false,
        buildup: {
          chunks: 'all',
          test: /[\\/]node_modules[\\/]/
        },
        commons: {
          name: 'commons',
          chunks: 'initial',
          minChunks: 2,
          reuseExistingChunk: true
        },
        vendors: {  // 抽离第三方库
          name: 'vendors',
          // test: /[\\/]node_modules[\\/]/,
          test: /[\\/]node_modules[\\/](vue|vue-router)[\\/]/,
          priority: -10, // 权重，数值越大权重越高
          // 表示是否使用已有的 chunk，true 则表示如果当前的 chunk 包含的模块已经被抽取出去了，那么将不会重新生成新的，即几个 chunk 复用被拆分出去的一个 module
          reuseExistingChunk: false
        },
        utilCommon: { // 抽离自定义工具库
          name: "utilCommon",
          minSize: 0,     // 将引用模块分离成新代码文件的最小体积
          minChunks: 2,   // 表示将引用模块如不同文件引用了多少次，才能分离生成新chunk
          priority: -20
        }
      }
    },
    runtimeChunk: {
      name: 'manifest'
    }
  }
}

module.exports = config