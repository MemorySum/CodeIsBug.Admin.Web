module.exports = {
    outputDir: 'dist', // build输出目录
    publicPath: './',
    assetsDir: 'assets', // 静态资源目录（js, css, img）
    lintOnSave: false, // 是否开启eslint
    devServer: {
        open: true, // 是否自动弹出浏览器页面
        host: 'localhost',
        port: '8087',
        https: false, // 是否使用https协议
        hotOnly: false, // 是否开启热更新
        proxy: {
            '/api': {
                target: 'http://119.91.250.14:8099', // API服务器的地址
                ws: true, // 代理websockets
                changeOrigin: true, // 虚拟的站点需要更管origin
                pathRewrite: { // 重写路径 比如'/api/aaa/ccc'重写为'/aaa/ccc'
                    '^/api': ''
                }
            }
        }
    }
}