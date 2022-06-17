const { defineConfig } = require('@vue/cli-service')
// vue.config.js
const path = require('path')

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
  }
})
