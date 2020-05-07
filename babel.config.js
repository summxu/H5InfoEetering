/*
 * @Author: Chenxu
 * @Date: 2020-01-21 21:40:22
 * @LastEditTime : 2020-02-05 11:09:46
 */
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    [
      'import',
      { libraryName: 'vant', libraryDirectory: 'es', style: true },
      'vant'
    ]
  ]
}
