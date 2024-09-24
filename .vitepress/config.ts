import {defineConfig} from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: "吕嘉磊的个人博客",
    description: "前端小菜鸡的进阶之路",
    base: "/",
    head: [
        ['link', {rel: 'icon', href: '/assets/favicon.ico'}]
    ],
    lastUpdated:true,
    cleanUrls: true,
    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        logo: '/assets/avatar.png',
        nav: [
            {text: '主页', link: '/'},
            {text: '笔记', link: '/docs/notes/index'},
            // {text: 'Examples', link: '/markdown-examples'}
        ],

        sidebar: [
            {
                text: "Vue",
                items: [
                    {text: "Vue-开始", link: "/docs/vue/开始"}
                ]
            },
            {
                text: "React",
                items: [
                    {text: "React-开始", link: "/docs/react/开始"}
                ]
            },
            /*{
              text: 'Examples',
              items: [
                {text: 'Markdown Examples', link: '/markdown-examples'},
                {text: 'Runtime API Examples', link: '/api-examples'}
              ]
            },*/
            {
                text: "笔记",
                items: [
                    {text: "部署GitHub Pages", link: "/docs/notes/githubPages"},
                    {text: "前端私有npm仓库", link: "/docs/notes/verdaccio"},
                    {text: "webpack5从0开始搭建", link: "/docs/notes/webpack5Update"},
                    {text: "练习", link: "/docs/notes/practice"},
                    {text: "patch-package", link: "/docs/notes/patch-package"},
                ]

            },
        ],

        socialLinks: [
            {icon: 'github', link: 'https://github.com/LvJiaLei666'}
        ],
        lastUpdated:{
            text: '上次更新',
            formatOptions: {
                // @ts-ignore
                dateStyle: 'full',
                timeStyle: 'medium'
            }
        }
    }
})
