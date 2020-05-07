/*
 * @Auth: Chenxu
 * @Date: 2020-01-17 15:28:35
 * @LastEditTime: 2020-03-14 09:57:33
 */
const autoprefixer = require('autoprefixer');
const pxtoviewport = require('postcss-px-to-viewport');

module.exports = {
  outputDir: 'www',
  publicPath: '/',
  filenameHashing: false,
  css: {
    extract: false,
    loaderOptions: {
      postcss: {
        plugins: [
          autoprefixer(),
          pxtoviewport({
            viewportWidth: 750, // (Number) The width of the viewport. 
            viewportHeight: 1334, // (Number) The height of the viewport. 
            unitPrecision: 3, // (Number) The decimal numbers to allow the REM units to grow to. 
            viewportUnit: 'vw', // (String) Expected units. 
            selectorBlackList: ['.ignore', '.hairlines'], // (Array) The selectors to ignore and leave as px. 
            minPixelValue: 1, // (Number) Set the minimum pixel value to replace. 
            mediaQuery: true, // (Boolean) Allow px to be converted in media queries. 
            exclude: /(\/|\\)(node_modules)(\/|\\)/
          })
        ]
      }
    }
  },
  devServer: {
    proxy: {
      "/api": {
        target: "http://wxshop.aiquanyouxuan.vip",
        ws: true,
        changOrigin: true,
        // pathRequiresRewrite: {
        //   "^/api": "/api"
        // }
      }
    }
  }
};
