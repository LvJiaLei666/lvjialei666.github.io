# webpack 面试题

## 1. 前端为何要进行打包和构建

代码层面：

- 编译高级语法和特性(ES6, TS, less/sass/stylus)
- 体积更小，加载更快(tree-shaking, uglify, compose)
- 兼容性处理和错误检查(polyfill, postcss, eslint)

工程化和流程层面：

- 统一、高效的开发环境
- 统一的构建流程和产出标准
- 集成公司的构建规范(提测、上线等)

## 2. 与 webpack 类似的工具还有哪些？谈谈你为什么选择使用 webpack 或放弃 webpack

gulp

- 基于 nodejs 的 steam 流打包
- 定位是基于任务流的自动化构建工具
- gulp 是通过 task 对整个开发过程进行构建

gulp 优点：

- 流式写法简单直观
- API 简单，代码量少
- 易于学习和使用
- 适合多页面应用开发

gulp 缺点：

- 异常处理比较麻烦
- 工作流程顺序难以精细控制
- 不太适合单页或者自定义模块的开发

webpack

- webpack 是模块化管理工具和打包工具。通过 loader 装换，任何形式的资源都可以视为模块，比如 CommonJS 模块、AMD 模块、ES6 模块、CSS、图片等。它可以将许多松散的模块按照依赖和打包规则打包成符合生产环境部署的前端资源
- 还可以将按需加载的模块进行代码分割，等到实际需要的时候再异步加载
- 它的定位是模块打包器，而 gulp 属于构建工具。webpack 可以代替 gulp 的一些功能，但不是一个职能的工具，可以配合使用

webpack 优点：

- 可以模块化打包任何资源
- 适配任何模块系统
- 适合单页面应用的开发

webpack 缺点

- 学习成本高，配置复杂
- 通过 babel 编译后的 JS 代码体积较大

rollup

- rollup 下一代 ES6 模块化工具，最大的亮点是利用 ES6 模块设计，利用 tree-shaking 生成更简洁、更简单的代码

rollup 优点

- 用标准化的格式(ES6)来写代码，通过减少死代码尽可能地缩小包体积

rollup 缺点

- 对代码拆分、静态资源、CommonJS 模块支持并不好

parcel

- parcel 是快速、零配置的 web 应用程序打包器
- 目前 parcel 只能用来构建运行在浏览器中的网页，这也是它的出发点和关注点

parcel 优点

- parcel 内置了常见场景的构建方案及其依赖，无需安装各种依赖
- parcel 能以 HTML 为入口，自动检测和打包依赖资源
- parcel 默认支持模块热更新，开箱即用

parcel 缺点

- 不支持 sourceMap
- 不支持 tree-shaking
- 配置不灵活(零配置)

## 3. loader 和 plugin 的不同

- loader 直译为加载器。webpack 将一切文件视为模块，但是 webpack 原生只能解析 js 文件，如果想将其他文件也打包的话，就会用到 loader。Loader 的作用是让 webpack 拥有了加载和解析非 javascript 文件的能力
- plugin 直译为插件。plugin 可以扩展 webpack 的功能，让 webpack 具有更多的灵活性。webpack 运行的生命周期中会广播很多的事件，plugin 可以监听这些事件，在合适的时机通过 webpack 提供的 API 改变输出结果。

**plugin 也可以在向文件目录输出文件内容时，去修改文件的内容再输出，所以某种意义上说可以实现部分 loader 的能力。但是，一般不会这样做，这并不符合 webpack 的设计理念**

## 4. 自定义 loader

loader 是一个函数，函数的参数是源码的内容，函数对源码的内容进行相应的转译，然后将转译后的内容返回。

loader 分为同步 loader 和 异步 loader

## 5. 自定义 plugin

plugin 是一个函数或者是一个有 apply 方法的对象，函数或者 apply 方法的参数是 compiler 对象，可以用 compiler 监听各种事件，在事件的回调里实现功能

## 6. 有哪些常见的 loader 和 plugin？它们是解决什么问题的？

loader

- babel-loader: 把 ES6 转换成 ES5
- file-loader: 把文件输出到一个文件夹中，在代码中通过相对路径去引用输出的文件
- url-loader: 和 file-loader 类似，但是能在文件较小的情况下以 base64 的方式注入到代码中去
- style-loader: 把 css 代码通过 style 标签的形式插入到页面中
- css-loader: 加载 css，支持模块化、压缩、文件导入等特性
- postcss-loader: 使用 postcss 处理 css，常用来加厂商前缀
- sass-loader: 把 sass/scss 文件编译成 css

plugin

- case-sensitive-paths-webpack-plugin: 如果路径有误直接报错
- terser-webpack-plugin: 使用 terser 压缩丑化代码
- html-webpack-plugin: 自动生成带有入口文件的 index.html
- copy-webpack-plugin: 复制不需打包的文件
- optimize-css-assets-webpack-plugin: 用于优化或压缩 css 资源
- mini-css-extract-plugin: 将 css 提取为单独的文件
- hot-module-replacement-plugin: 启用模块热替换
- define-plugin: 定义全局变量

## 7. source-map 是什么？

- source-map 是为了解决开发代码和实际运行代码不一致时，帮助我们 debug 到原始代码的技术
- webpack 通过配置生成 source-map 文件，map 文件是一种对应编译文件和原始文件的方法

source-map 类型：
看似配置项很多，其实是五个关键字 eval、source-map、cheap、module 和 inline 的任意组合

- none: 不生成 .map 文件
- eval: 不生成 .map 文件，可以通过 eval 函数的 sourceURL 找到对应的文件
- source-map: 生成 .map 文件，可以定位代码错误的行和列
- cheap: 生成 .map 文件，不包含列信息，代码报错只能定位到哪一行
- module: 包含 Loader 的 source-map
- inline: 不生成 .map 文件，将 .map 文件作为 dataUrl 嵌入

### 实际项目中采用哪种 source-map 呢？

- 开发环境：**eval-cheap-module-source-map**

原因：

1. 因为现在都是模块化的开发方式，所以需要调试 loader 转换前的源代码。
2. 一般都会配置每行编写的代码不超过 80 行，所以能过定位到错误所在的行就够了。
3. 虽然这种模式下启动打包相对会比较慢，但是使用 webpack-dev-server 都是在监视的模式下重新打包，它重新打包的速度还是很快的。

- 生产环境：**none**

1. source-map 文件会暴露我们的源代码到生产环境，如果没有控制好 souce-map 文件的访问权限，可能被他人复现项目源码，不安全。
2. 调试是开发阶段的事，而不应该到了生产环境，让全民去公测。

## 8. webpack 中 hash、chunkhash、contenthash 的区别

- hash: 是整个项目的 hash 值，其根据每次编译的内容计算得到的，每次编译后都会生成新的 hash，即修改任何文件都会导致所有文件的 hash 值跟着变化
- chunkhash: chunkhash 和 hash 不一样，它根据不同的入口文件(Entry)进行依赖文件解析、构建对应的 chunk，生成对应的哈希值
- contenthash: 使用 chunkhash 存在一个问题，就是当在一个 JS 文件中引入 css 文件，编译后它们的 hash 值是相同的，而且只要 js 文件发生改变，关联的 css 的 hash 也会跟着改变，这个时候可以在 mini-css-extract-plugin 里设置 contenthash，保证 css 文件所处的模块里就算其他文件内容发生改变，只要 css 文件内容不变，那么不会重构建

## 9. webpack 的工作流程

- 初始化参数：把配置文件和 shell 语句中的参数合并，得到最终的参数。
- 开始编译：用上一步得到的参数初始化 Compiler 对象，Compiler 对象注册所有的插件，执行 Compiler 对象的 run 方法（监听模式是 watch 方法）创建 Compilation 对象（当前这次构建的上下文对象，包含了这次构建的全部资源和信息），调用 make 方法执行编译。
- 确定入口：根据配置中的 entry 找出所有的入口模块。
- 编译模块：从入口文件出发，开始依次递归出所有的依赖，形成依赖关系树，然后将递归到的每个模块交给对应的 loader 处理。
- 完成模块编译：在经过使用 loader 翻译完所有模块后，得到了每个模块被翻译后的最终内容以及它们之间的依赖关系。
- 输出资源：根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 chunk，再把每个 chunk 转换成一个单独的文件加入到输出列表
- 输出完成：在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入文件系统

### webpack 创建的 compiler 对象是如何注册插件的？

webpack 除了会注册用户在配置文件中声明要使用的插件外，还会根据配置的内容注册内置的插件

### webpack 是如何根据 entry 找出模块的所有依赖的？

webpack 是利用 acron 将文件的内容解析为 AST，但是 webpack 遍历 AST 只是根据 `require/import` 之类的导入语句，确定模块对其他资源的依赖关系，babel 才是根据 AST 对内容做转译。

## 10. webpack 的热更新原理

- 使用 express 启动本地服务，让浏览器可以请求本地的静态资源
- 启动 websocket 服务，建立客户端和服务器之间的双向通信
- webpack 监听文件的变化，执行编译
- 一次编译结束后，websocket 给浏览器发送通知，hash 和 ok 事件，浏览器拿到新的 hash 值，做检查更新的逻辑
- 利用上一次保存的 hash 值，通过 AJAX 请求 `hash.hot-update.json` 文件，获取热更新的模块及下次热更新的 hash
- 通过 JSONP 请求 `hash.hot-update.js` 文件

### 客户端和服务端在 hmr 里面分别是指什么？怎么实现通信的？传输的又是什么？

- 客户端在 hmr 里面指的是浏览器
- 服务端在 hmr 里面指的是 express 服务器和 websocket 服务器
- 客户端和服务端的通信分为两部分，一部分是通过 express 服务器传输打包后的静态资源，另一部分是通过 websocket 通信 ok 和 hash 事件
- 客户端和 express 服务器之间的通信无非就是通过 AJAX 和 JSONP
- 客户端和 websocket 服务器之间是如何通信的呢，webpack-dev-server 在打包后的 bundle.js 里给插入了监听 websocket 的 ok 和 hash 事件的方法

### webpack-dev-middleware 在热更新里主要做了什么？

- 修改 webpack 的 fs 为 MemoryFileSystem，并将构建后的结果存储到内存中
- 实现请求的中间件，处理所有的资源请求，并在内存中找到对应的资源返回

## 11. tree shaking 机制的原理

- tree shaking 也叫 `摇树优化` ，通过移除多余代码来优化打包体积，生产环境下默认开启
- 可以在编译阶段，分析出不需要的代码
- 利用 ES6 模块化的规范
    - ES Module 引入静态分析，故而编译的时候可以分析出到底加载了哪些模块
    - 在编译分析阶段，将所有的模块都放入 ModuleGraph 中，判断哪些模块和变量未被使用或者引用，进而删除对应代码

## 12. module chunk 和 bundle

- webpack 中一切皆模块，每个文件都是一个模块
- chunk 是 webppack 打包过程中 modules 的集合，它是`打包过程中`的概念，(enrty, splitChunk, runtimeChunk, import 异步加载会产生 chunk)
- bundle 打包后最终输出的一个或多个文件

## 13. chunk 和 bundle 之间的关系

- 大多数情况下一个 chunk 对应一个 bundle
- 如果加了 source-map ，一个 chunk 就对应两个 bundle
- chunk 是打包过程中的概念，bundle 是打包完成后输出的代码块，chunk 在构建完成后就呈现为 bundle

## 14. webpack 性能优化 - 构建时长

1. 费时分析：使用 speed-measure-webpack-plugin

2. 缩小范围：

- 如果使用 require 或者 import 导入文件时未加文件扩展名，会依次尝试添加扩展名进行匹配

```js
resolve: {
  extensions: ['.js', '.jsx', '.vue']
}
```

- 配置文件别名: 配置别名可以加快 webpack 查找模块的速度

```js
resolve: {
  alias: {
    '@src': 'xxx'
  }
}
```

3. noParse: 用来指定哪些模块的文件内容不需要进行解析，比如 lodash，jquery 等库并没有第三方依赖，所以可以不用进行依赖分析

4. IgnorePlugin: 用于忽略某些特定的模块，让 webpack 不把这些指定的模块打包进去，比如 moment.js 中的语言包文件就不需要打包进去

5. 利用缓存：

- babel-loader 开启缓存：第一次编译完成后，第二次内容没有发生改变的不会再次编译
- 使用 cache-loader：在一些性能开销较大的 loader 之前添加 cache-loader，将结果缓存在磁盘中

6. 多进程打包：把 thread-loader 放置在其他 loader 之前，放置在 thread-loader 之后的 loader 就会在一个单独的 worker 池中进行，happyPack 多进程打包。（如果打包的内容比较简单，开启多进程打包，可能还好降低打包的速度，因为开启多进程本身也会消耗一定的时间）

7. ParallelUglifyPlugin: 开启多进程并行压缩丑化 JS

8. 动态链接库文件：

- DllPlugin: 用于打包出一个个动态链接库
- DllReferencePlugin: 在配置文件中引入 DllPlugin 插件打包好的动态链接库

9. 自动刷新

10. 模块热更新

11. 利用 webpack5 的 cache 缓存

生产环境：

- noParse 一些没有依赖其他库的第三方库可以不进行解析
- IgnorePlugin 忽略一些不需要打包的模块
- babel-loader 开启缓存
- happyPack 开启多进程打包
- parallelUglifyPlugin 开启多进程压缩 JS 文件

开发环境：

- 自动刷新
- 热更新
- 动态链接库文件

### babel-loader 如何开启缓存

```javascript
// webpack.config.js
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true // 或者是一个目录路径
            }
          }
        ],
        exclude: /node_modules/
      }
    ]
  }
}
```

### webpack 使用动态链接库文件的作用

在使用 webpack 进行打包时，如果项目中包含大量的第三方库或模块，每次打包都需要重新编译这些模块，导致打包时间较长，并且生成的包体积很大。
打包出动态链接库文件后，只需要在依赖的版本改变后需要再次打包出新的动态链接库文件外，其他时间 webpack 只需要将项目中需要的模块和动态链接库文件链接起来，而不需要重新编译这些模块，从而减少了打包的时间，并且减小打包后的体积

### webpack 使用动态链接库文件的步骤

1. 创建一个配置文件，用于打包动态库文件

```javascript
const path = require('path')
module.exports = {
  entry: {
    vue: ['vue', 'vue-router', 'vuex']
  },
  output: {
    filename: '[name].dll.js',
    path: path.resolve(__dirname, './dist'),
    library: '[name]_dll'
  },
  plugins: [
    new webpack.DllPlugin({
      name: '[name]_dll',
      path: path.resolve(__dirname, './dist/[name]-manifest.json')
    })
  ]
}
```

2. 根据配置文件运行打包命令，生成动态链接库文件和对应的 manifest 文件
3. 在 webpack 配置文件中，引用动态链接库文件

```javascript
// webpack.config.js
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')
module.exports = {
  // ...
  plugins: [
    new webpack.DllReferencePlugin({
      manifest: require('./dist/vue-minifest.json')
    }),
    new AddAssetHtmlPlugin({
      filepath: path.resolve(__dirname, 'dist/vue.dll.js')
    })
  ]
}
```

DllReferencePlugin 用于告诉 webpack 使用哪个 manifest 文件来动态加载链接库，对应的 js 文件会被拷贝到 dist 目录下。AddAssetHtmlPlugin 用于在 html 文件中自动加载链接库的 js 文件

### webpack5 cache 缓存的原理

1. 其实还是使用的 cache-loader 来将构建的结果缓存在内存中，当然也可以自定缓存的类型。
2. 使用标识符来标识模块内容是否有更改，每个模块都会分配一个标识符。

## 15. webpack 性能优化 - 产出代码

最终应达到的目的：体积更小、合理分包，不重复加载、速度更快，内存占用更小

- 小图片 base64 格式(url-loader)
- bundle 使用 contenthash(缓存)
- 懒加载(异步加载，webpack 的魔法注释)
- 抽离公共代码(splitChunks)，对 node_modules 里面的文件进行分包，特别大的第三方库使用 externals 排除
- IgnorePlugin(忽略不需要打包的资源)
- 使用 CDN 加速(配置 publicPath)
- 启动 tree-shaking
- 使用 mini-css-extract-plugin 将 css 文件打包成单独的文件，并且丑化；使用 terser-webpack-plugin 丑化 js 代码；还可以使用 purgecss-webpack-plugin
  移除没有用到的 css 代码
- Scope Hosting(把所有模块合并到一起，输出到一个函数中，未开启时，一个模块就会对应一个单独的函数)

```js
// tree-shaking、压缩代码、Scope Hosting 对应的配置
module.exports = {
  optimization: {
    usedExports: true, // 只导出被外部引用的成员
    minimize: true, // 压缩代码
    concatenateModules: true // 尽可能将所有模块合并到一起输出到一个函数中
  }
}
```

**使用 webpack-bundle-analyzer 插件分析打出的包的大小**

## babel 的原理

babel 是 JavaScript 编译器，它能让开发者在开发过程中，直接使用各类方言(如 ts jsx)或新的语法特性，而不需要考虑运行环境，因为 babel 可以做到按需转换为低版本支持的代码；babel 内部原理是将 JS 代码转换为 AST，对 AST 应用各种插件进行处理，最终输出编译后的 JS 代码

## babel 编译流程

1. 解析阶段：babel 默认使用的是 `@babel/parser` 将代码转换为 AST。解析一般分为两个阶段：词法分析和语法分析。

- 词法分析：对输入的字符序列做标记化(tokenization)操作
- 语法分析：处理标记与标记之间的关系，最终形成一颗完整的 AST 结构

2. 转换阶段：babel 使用的是 `@babel/traverse` 提供的方法对 AST 进行深度优先遍历，调用插件对关注节点的处理函数，按需对 AST 节点进行增删改操作

3. 生成阶段：babel 默认使用的是 `@babel/generator` 将上一阶段处理后的 AST 转换为代码字符串