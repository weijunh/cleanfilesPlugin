每次打包如果文件有修改会生成新的文件，文件的 hash 也会跟着变化，那么这个改变了的文件，他以前的文件就是无效的了，要把以前的文件清除掉，我们使用比较多的就是 clean-webpack-plugin，这里自己实现一个简单的文件清除 webpack 插件

相似步骤 1.安装插件
npm i webpackcleanplugin -s-d

2.在 webpack.config.js 文件中引入
const commentPlugin = require('webpackcleanplugin');

3.在 webpack 的 plugin 配置中
plugins: [
new webpackcleanplugin()
]

github 地址:
https://github.com/weijunh/webpackCleanPlugin.git
