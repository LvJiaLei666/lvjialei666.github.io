import {defineConfig} from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "吕嘉磊的个人博客",
  description: "前端小菜鸡的进阶之路",
  head: [
    ['link', {rel: 'icon', href: '/assets/favicon.ico'}]
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/assets/avatar.png',
    nav: [
      {text: '主页', link: '/'},
      {text: '笔记', link: '/notes'},
      {text: 'Examples', link: '/markdown-examples'}
    ],

    sidebar: [
      {
        text: "笔记",
        items: [
          {text: "前端私有npm仓库", link: "/docs/notes/搭建前端私有npm仓库"}
        ]
      },
      {
        text: 'Examples',
        items: [
          {text: 'Markdown Examples', link: '/markdown-examples'},
          {text: 'Runtime API Examples', link: '/api-examples'}
        ]
      },
      {
        text: "写给自己",
        link: "/docs/toMyself.md",
        // items: [
        //   {text: "开始", link: '/docs/vitePress/start'}
        // ]
      },
    ],

    socialLinks: [
      {icon: 'github', link: 'https://github.com/LvJiaLei666'}
    ]
  }
})
