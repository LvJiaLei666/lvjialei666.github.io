# patch-package



## 一、背景

起初是发现有一天`npm install` 之后项目突然跑不起来了，就开始了排查之旅。排查到最后发现`taro-ui`按需引入`toast`样式文件后，文件对比之前突然多了一行代码。修改`node_modules`中源代码后项目就可以正常启动了。



随后我就跑去`github`给`taro-ui`提issue，第二天被告知维护者已经给`taro`提了pr，但是对于我这个版本没有效果（这里后来没问出原因），他说可以用`patch`的方式去先暂时把源码改掉。



这时，我才发现一个新工具 `patch-package`

#### 作用

> lets app authors instantly make and keep fixes to npm dependencies. It's a vital band-aid for those of us living on the bleeding edge.

这是npm官网上对patch-package的说明，意思就是*允许应用程序作者立即对NPM依赖项进行修复。对于前端来说，这是一个至关重要的补丁。* 也就是说可以让大家对node_modules进行立即更改。



## 二、使用 



#### 1. 安装 

```shell
npm i patch-package
```

如果你不需要在生产中运行

```sh
npm i patch-package --save-dev
```



yarn、pnpm、docker安装命令可查看其 [git官网。](https://link.zhihu.com/?target=https%3A//github.com/ds300/patch-package)



#### 2. 修改npm包

更改node_modules 文件夹中要修改依赖包的文件



#### 3. 生成补丁文件

```sh
npx patch-package package-name(修改包名)
```



会自动在项目中生成一个patches文件夹，并放置了修改文件的patch文件

![image-20240516165417923](../../assets/image/patch-package/image-20240516165417923.png)



内容如下

```
diff --git a/node_modules/taro-ui/dist/style/components/toast.scss b/node_modules/taro-ui/dist/style/components/toast.scss
index f53d1ec..6163d14 100644
--- a/node_modules/taro-ui/dist/style/components/toast.scss
+++ b/node_modules/taro-ui/dist/style/components/toast.scss
@@ -1,4 +1,3 @@
-@use "sass:math";
 @import '../variables/default.scss';
 @import '../mixins/index.scss';
```



#### 4. 添加自动执行命令

In package.json

```json
 "scripts": {
   ...
    "postinstall": "patch-package"
 }
```





#### 5. 重新安装node_modules依赖

至此已完成，重新删除node_modules后执行 `npm install` 会发现代码已经是修改过后的。

![image-20240516165755972](../../assets/image/patch-package/image-20240516165755972.png)