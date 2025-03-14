# 记录一次使用micro-app+pnpm搭建微前端+monorepo项目

### 概念

-

微前端：将一个大型的前端项目拆分成多个小型的前端项目，每个小型项目都是一个独立的前端项目，可以`独立开发`、`独立部署`、`独立运行`
，最终通过一个容器将这些小型项目组合成一个大型项目。

- monorepo：将多个项目放在一个仓库中，通过lerna、pnpm等工具管理这些项目，可以`统一管理依赖`、`统一发布`等。

### 架构设计

在 monorepo 中，所有的包都放在 packages 目录下，每个包都有自己的 package.json 文件，而根目录的 package.json 用来管理整个项目的依赖。

结构目录：

```
├── packages
|   ├── vue-demo（主应用）
|   |   ├── package.json
|   ├── react-demo(子应用)
|   |   ├── package.json
|   ├── shared(共享库)
|   |   ├── package.json
├── .eslintrc.js(等配置文件 可以放置一些eslint、prettier、tsconfit等公共配置)
├── package.json
├── pnpm-workspace.yaml
```

### 主应用

主应用是一个独立的前端项目，负责加载和管理所有的微前端子应用。我们这里选择vue3作为主应用

#### 1.创建主应用

  ```bash
  pnpm create vite vue3-demo /packages/vue3-demo
  ```

#### 2.安装micro-app

  ```bash
  pnpm add  @micro-zoe/micro-app --save
  ```

#### 3.在主应用中初始化micro-app

```ts
  import {createApp} from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index.ts'
import microApp from '@micro-zoe/micro-app'


microApp.start()
createApp(App).use(router).mount('#app')
  ```

#### 4.加载子应用

micro-app 官方文档中，加载vite子应用的时候需要`切换到iframe沙箱`


```vue
<template>
  <!-- name：应用名称, url：应用地址 -->
  <micro-app name="react-demo" url="http://localhost:5174/" iframe></micro-app>
</template>

```
> 1、name：必传参数，必须以字母开头，且不可以带特殊符号(中划线、下划线除外)
> 2、url：必传参数，必须指向子应用的index.html，如：http://localhost:3000/ 或 http://localhost:3000/index.html

#### 5.忽略自定义标签

加载完后可能会有未知html标签的问题，可以在vite.config.js中配置

```js
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  // base: '/vue3-demo/',
  plugins: [vue({
    template: {
      compilerOptions: {
        isCustomElement: tag => /^micro-app/.test(tag)
      }
    }
  })],
})
```

### 子应用

子应用是一个独立的前端项目，负责实现具体的业务功能。微前端理论上来说是不限技术栈的，所以我们这里选择react作为子应用。

#### 1.创建子应用

  ```bash
  pnpm create vite react-demo /packages/react-demo
  ```

#### 2.修改配置

在micro app 1.x 中 vite接入子应用变得简单了许多 基本无需修改配置，只需要修改子应用与主应用端口不冲突即可

```js
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server:{
    port: 5174,
  },
  plugins: [react()],
})

```

这个时候，微前端已经可以初步运行了。再引入pnpm-workspace.yaml文件，搭建monorepo功能。我们选择`pnpm`实现monorepo

### monorepo

#### 1.创建pnpm-workspace.yaml

```yaml
packages:
  - 'packages/**'
```

#### 2.创建shared共享库

在package文件夹下中创建一个共享库，用于存放一些公共的组件、工具函数等

```
- packages
  - shared
    - components
        - Hello.vue
        - Hello.tsx
    - utils
        - index.ts
    - style
        - index.css
    - package.json
```

在package.json中配置

```json
{
  "name": "shared-module",
  "version": "1.0.0"
}
```


#### 3.引入使用

package.json 引入
```json
{
  "dependencies": {
    "shared-module": "workspace:*"
  }
}
```

vue
```vue

<script setup>
import Hello from 'shared-module/components/Hello.vue'
</script>
<template>
  <div>
    <Hello />
  </div>
</template>

```

react
```tsx
import Hello from 'shared-module/components/Hello.tsx'

function App() {
  return (
    <div>
      <Hello />
    </div>
  );
}
```

### 总结

通过micro-app+pnpm搭建微前端+monorepo项目，可以实现前端项目的拆分、独立开发、独立部署、独立运行等功能，提高了项目的可维护性和可扩展性。






