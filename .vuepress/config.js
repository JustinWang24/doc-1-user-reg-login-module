module.exports = {
    title: "用户注册登陆模块设计文档",
    markdown: {
        lineNumbers: false
    },
    themeConfig: {
        // 顶部导航栏
        nav: [
            {text: '首页', link: '/'},
            {
                text: '接口设计',link: '/api_contracts/'
            },
            {
                text: '数据库设计',link: '/database/'
            },
            {
                text: '功能测试', link:'/unit_tests/'
            },
            {
                text: '业务逻辑的实现', link:'/business_logic/'
            }
        ],
        // 侧边栏
        sidebar: 'auto'
    },
    plugins:[
        '@vuepress/back-to-top',
        [
            'contact-us',
            {
                email: 'hi@yue.dev',
                labelLanguage: 'cn',
                // emailSenderApi: '12345678'
            }
        ],
    ]
}