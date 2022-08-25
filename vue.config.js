const { defineConfig } = require('@vue/cli-service')
// vue.config.js
const path = require('path')
// 头部引入
// const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')

module.exports = defineConfig({
  transpileDependencies: true,

  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [
        path.join(__dirname, './src/assets/styles/variables.less'),
        path.join(__dirname, './src/assets/styles/mixin.less')
      ]
    }
  },
  chainWebpack: config => {
    // 将图片小于10kb的 压缩文件base64格式图片
    config.module
      .rule('images')
      .test(/\.(jpg|png|gif)$/)
      .set('parser', {
        dataUrlCondition: {
          maxSize: 10 * 1024 // 10KiB
        }
      }) // 10kb以下将图片打包为base64
    // config.resolve.fallback.set('url', require.resolve('url/'))
    // 外部扩展的包
    config.externals({
      qc: 'QC'
    })
    // config.plugin('node-polyfill').use(new NodePolyfillPlugin())
  },
  devServer: {
    // 开启ip 访问webpack
    allowedHosts: 'all'
  }
/*,
  configureWebpack: {
    plugins: [new NodePolyfillPlugin()], // 处理webpack5中 直接import引入node内置核心包报错
    externals: {
      qc: 'QC'
    }
  }
*/
})
