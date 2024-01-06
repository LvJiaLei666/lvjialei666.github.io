# 部署GitHub Pages

## 前言

我们如果有一些个人博客，或者是组件文档想查看时，需要部署到服务器上。而GitHub正好提供了这个功能。

我们可以使用`GitHub pages`这个功能，将静态网页部署到上面。

## 准备工作

首先需要有一个创建一个 GitHub仓库 并且配置GitHub Pages

如果是个人博客页面，建议使用 <GitHub用户名>.github.io 来命名仓库，这样使用 <GitHub用户名>.github.io 就可以直接访问到这个仓库的Pages页面。

注意事项：

1. 设置pages需要选择部署到哪个分支上
2. 如果是部署到其他路径，`vitePress` 中需要设置 `base`,如果部署到<GitHub用户名>.github.io 则不需要，因为 `base` 默认为 "/" 。

## 两种方式

### 一、使用 sh 脚本进行上传

我这里使用 `vitePress` 进行编写与打包我的个人博客。

```shell
#!/usr/bin/env sh

# 忽略错误
set -e

# 构建
npm run docs:build

# 进入待发布的目录
cd docs/.vitepress/dist

# 如果是发布到自定义域名
# echo 'www.example.com' > CNAME

git init
git add -A
git commit -m 'deploy'

# 如果部署到 https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git master

# 如果是部署到 https://<USERNAME>.github.io/<REPO>
# git push -f git@github.com:<USERNAME>/<REPO>.git master:gh-pages

cd -

```

### 二、使用 GitHub Action 自动部署

我们使用GitHub Action 的功能进行自动部署。每次代码push的时候自动执行构建脚本。
在根目录 .github -> workflows -> deploy.yml中写

```yaml
name: Deploy

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v3
        with:
          node-version: 16
      - run: npm i

      - name: Build
        run: npm run docs:build

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          deploy_key: ${{ secrets.DEPLOY_KEY }}
          publish_branch: master
          publish_dir: ./.vitepress/dist

```

`DEPLOY_KEY` 是你的GitHub 仓库设置的私钥名称 除此之外，还需要在GitHub 仓库设置中设置 deployKey 为公钥。

注意：设置私钥的时候全部复制上去（我才不会说我被GPT坑了）。

