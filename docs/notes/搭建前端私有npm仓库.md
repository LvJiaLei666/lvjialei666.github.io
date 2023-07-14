# 搭建前端私有npm仓库

## 前言

随着公司前端项目越来越多，出现了很多可复用的业务组件和逻辑。为了提升开发效率和方便维护，避免每次都要在项目之间复制粘贴相同的逻辑，我们可以把可复用的组件和逻辑封装成npm包，通过npm包的形式来引入，但又由于是公司内部的业务，所以一般不希望发布到全球公共的 `www.npmjs.com`
仓库中，此时就需要搭建属于我们自己的 `私有npm仓库`。

## Verdaccio 介绍

<img src="/assets/image/verdaccio/verdaccio.png" alt="Verdaccio" style="margin: 32px auto">



Verdaccio 是一款轻量级的私有 npm 仓库管理器，支持在本地搭建一个私有 npm 仓库并管理自己的 Node.js 包。它可以让开发人员和团队在内部使用自己的 npm 包，而不必将这些包发布到公共 npm 仓库上。

Verdaccio 基于 Node.js 和 JavaScript 编写，并提供了多种配置选项以满足不同场景下的需求。它支持常见的 npm 命令（如 install、publish 等），并具有与公共 npm registry 相同的
API。

## 安装

> nodejs 版本需要大于16.0



使用 `npm`

```shell
$ npm instasll --location=global  verdaccio@6-next
```

使用 `yarn`

```shell
$ yarn global add verdaccio@6-next
```

使用 `pnpm`

```shell
$ pnpm i -g verdaccio@6-next
```

或者使用 `docker`

```shell
$ docker pull verdaccio/verdaccio:nightly-master
```

### 启动verdaccio

安装好后 我们需要先进入安装路径，/verdaccio/config.yaml 将文件中的 `listen: localhost:4873` 修改为 `listen: 0.0.0.0:4873`
,不然不能通过外网访问。 PS：如果使用本地可以不修改。

然后启动 verdaccio

```shell
$ verdaccio
```

启动好后就可以通过ip+端口号访问了。PS：本地通过localhost访问,如果在服务器上启动后，访问不了，需要检查端口是否开放。

![img.png](/assets/image/verdaccio/img.png)

### 使用PM2守护进程

这里有个问题：在启动verdaccio后，关闭窗口后verdaccio就会停止。但是我们不可能一直开着窗口。所以这里需要使用 `pm2` 来 进行进程守护。

```shell
#pm2 建立软链
ln -s /usr/app/nodejs/bin/pm2   /usr/local/bin/ 

# pm2 启动verdaccio
pm2 start verdaccio

#停止verdaccio
pm2 stop verdaccio

```

### 发布npm包

这里推荐使用 `nrm` 来管理仓库地址。

```shell
# 设置新的仓库
nrm add private http://xxx

#查看列表
nrm ls

#使用新的仓库
nrm use private
```
