import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "吕嘉磊的个人博客",
  description: "前端小菜鸡的进阶之路",
  base: "/",
  head: [["link", { rel: "icon", href: "/icon.svg" }]],
  lastUpdated: true,
  cleanUrls: true,
  // 忽略死链接
  ignoreDeadLinks: true,

  // 排除不需要的源文件
  srcExclude: ["README.md", "api-examples.md", "markdown-examples.md"],

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: "/71485393.jpeg",
    nav: [
      { text: "首页", link: "/" },
      {
        text: "学习笔记",
        items: [
          { text: "前端笔记", link: "/docs/notes/index" },
          { text: "面试题", link: "/docs/interviewQuestion/" },
          { text: "Vue", link: "/docs/vue/开始" },
          { text: "React", link: "/docs/react/开始" },
        ],
      },
      { text: "工具分享", link: "/docs/tools/" },
      { text: "关于我", link: "/about" },
    ],

    sidebar: {
      "/docs/interviewQuestion/": [
        { text: "JS面试题", link: "/docs/interviewQuestion/JS面试题" },
        { text: "HTML面试题", link: "/docs/interviewQuestion/HTML面试题" },
        {
          text: "Webpack面试题",
          link: "/docs/interviewQuestion/Webpack面试题",
        },
        {
          text: "响应式数据实现",
          link: "/docs/interviewQuestion/实现响应式数据+收集依赖",
        },
        { text: "Vue面试题", link: "/docs/interviewQuestion/Vue面试题" },
        { text: "事件循环机制", link: "/docs/interviewQuestion/事件循环" },
        { text: "手写Promise", link: "/docs/interviewQuestion/手写Promise" },
        { text: "手写call和apply", link: "/docs/interviewQuestion/手写call和apply" },
      ],
      "/docs/vue/": [
        {
          text: "Vue 深入浅出",
          collapsed: false,
          items: [
            { text: "基础入门", link: "/docs/vue/开始" },
            { text: "实现一个mini-vue2", link: "/docs/vue/实现一个mini-vue2" },
          ],
        },
      ],
      "/docs/react/": [
        {
          text: "React 学习笔记",
          collapsed: false,
          items: [{ text: "快速上手", link: "/docs/react/开始" }],
        },
      ],
      "/docs/notes/": [
        {
          text: "实用笔记",
          collapsed: false,
          items: [
            { text: "GitHub Pages 部署", link: "/docs/notes/githubPages" },
            { text: "私有 NPM 仓库", link: "/docs/notes/verdaccio" },
            { text: "Webpack5 配置", link: "/docs/notes/webpack5Update" },
            { text: "实战练习", link: "/docs/notes/practice" },
            { text: "Patch Package", link: "/docs/notes/patch-package" },
            { text: "micro-app", link: "/docs/notes/micro-app" },
            { text: "puppeteer", link: "/docs/notes/puppeteer" },
          ],
        },
      ],
    },

    socialLinks: [{ icon: "github", link: "https://github.com/LvJiaLei666" }],
    footer: {
      message: "用心记录，用力成长",
      copyright: "Copyright © 2023-present 吕嘉磊",
    },
    search: {
      provider: "local",
      options: {
        translations: {
          button: {
            buttonText: "搜索文档",
            buttonAriaLabel: "搜索文档",
          },
          modal: {
            noResultsText: "无法找到相关结果",
            resetButtonTitle: "清除查询条件",
            footer: {
              selectText: "选择",
              navigateText: "切换",
            },
          },
        },
        _render(src, env, md) {
          const html = md.render(src, env);
          if (env.frontmatter?.search === false) return "";
          // if (env.relativePath.startsWith('some/path')) return ''
          return html;
        },
      },
    },
    lastUpdated: {
      text: "上次更新",
      formatOptions: {
        // @ts-ignore
        dateStyle: "full",
        timeStyle: "medium",
      },
    },
    docFooter: {
      prev: "上一页",
      next: "下一页",
    },
    outline: {
      level: [2, 3],
      label: "目录",
    },
  },
});
