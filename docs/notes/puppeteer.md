# Puppeteer 介绍与初步使用

Puppeteer 是一个 Node.js 库，它提供了一组 API，用于控制 Chrome 或 Chromium 浏览器。通过 Puppeteer，你可以自动化执行各种任务，如页面导航、表单提交、数据抓取等。简单来说就是一个命令行浏览器

你可以在浏览器中手动执行的绝大多数操作都可以使用 Puppeteer 来完成！ 下面是一些示例：

- 生成页面 PDF。
- 抓取 SPA（单页应用）并生成预渲染内容（即“SSR”（服务器端渲染））。
- 自动提交表单，进行 UI 测试，键盘输入等。
- 创建一个时时更新的自动化测试环境。 使用最新的 JavaScript 和浏览器功能直接在最新版本的Chrome中执行测试。
- 捕获网站的 timeline trace，用来帮助分析性能问题。
测试浏览器扩展。

### 开始使用

#### 安装

在项目中使用puppeteer

```shell
npm i puppeteer
```



#### 使用

Puppeteer 至少需要 Node v6.4.0，下面的示例使用 async / await，它们仅在 Node v7.6.0 或更高版本中被支持。

Puppeteer 使用起来和其他测试框架类似。你需要创建一个 Browser 实例，打开页面，然后使用 Puppeteer 的 API.

Example - 跳转到 https://example.com 并保存截图至 example.png:

文件为 example.js

```js
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://example.com');
  await page.screenshot({path: 'example.png'});

  await browser.close();
})();
```

在命令行中执行


```shell
node example.js
```

Puppeteer 初始化的屏幕大小默认为 800px x 600px。但是这个尺寸可以通过 Page.setViewport() 设置。


Example - 创建一个 PDF。

文件为 hn.js

```js
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://news.ycombinator.com', {waitUntil: 'networkidle2'});
  await page.pdf({path: 'hn.pdf', format: 'A4'});

  await browser.close();
})();
```

在命令行中执行

```shell
node hn.js
```


Example - 在页面中执行脚本

文件为 **get-dimensions.js**

```js
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://example.com');

  // Get the "viewport" of the page, as reported by the page.
  const dimensions = await page.evaluate(() => {
    return {
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
      deviceScaleFactor: window.devicePixelRatio
    };
  });

  console.log('Dimensions:', dimensions);

  await browser.close();
})();
```

在命令行中执行


```shell
node get-dimensions.js
```



