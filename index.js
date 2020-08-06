//用于同步列出目录或任何子目录中的所有文件。它不会列出目录本身。
const recursiveReadSync = require('recursive-readdir-sync')
const minimatch = require("minimatch"); //最小匹配
const path = require("path");
const fs = require("fs");
const union = require("lodash.union");//从所有给定数组按顺序创建唯一值数组

function getFiles (fromPath, exclude = []) {
  const files = recursiveReadSync(fromPath).filter(file => exclude.every(
    //path.relative() 方法根据当前工作目录返回 from 到 to 的相对路径。 如果 from 和 to 各自解析到相同的路径（分别调用 path.resolve() 之后），则返回零长度的字符串。
    //path.relative('/data/orandea/test/aaa', '/data/orandea/impl/bbb');
    // 返回: '../../impl/bbb'

    //path.join() 方法会将所有给定的 path 片段连接到一起
    excluded => !minimatch(path.relative(fromPath, file), path.join(excluded), { dot: true })
  ))
  console.log(files)
  return files
}

class WebpackCleanPlugin {
  constructor(options = {}) {
    this.options = options
  }
  apply (compiler) {
    //获取output路径
    const outputPath = compiler.options.output.path
    compiler.plugin('done', stats => {
      if (compiler.outputFileSystem.constructor.name !== 'NodeOutputFileSystem') {
        return
      }
      //获取编译完成文件名
      const assets = stats.toJson().assets.map(asset => asset.name)
      console.log(assets)

      //多数组合并并且去重
      const exclude = union(this.options.exclude, assets)
      console.log(exclude)

      //获取未匹配文件
      const files = getFiles(outputPath, exclude)
      // const files = [];
      console.log("files", files);

      if (this.options.preview) {
        // console.log('%s file(s) would be deleted:', files.length);
        // 输出文件
        files.forEach(file => console.log("    %s", file));
        // console.log();
      } else {
        // 删除未匹配文件
        files.forEach(fs.unlinkSync);
      }
      if (!this.options.quiet) {
        // console.log('\nWebpackCleanupPlugin: %s file(s) deleted.', files.length);
      }

    })
  }
}

module.exports = WebpackCleanPlugin