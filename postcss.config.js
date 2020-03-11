module.exports = {
    plugins: [
        require('autoprefixer'),  // 引用autoprefixer模块

        // 几种方式设置具体的浏览器
        // 一、直接在这里设置，但是在打包时会有警告
        // require('autoprefixer')({
        //     browsers: ['Android >= 4.0', 'iOS >= 7']
        // })
        // 二、在package.json文件里添加以下配置
        // "browserslist": [
        //     "defaults",
        //     "not ie <= 8",
        //     "last 2 versions",
        //     "> 1%",
        //     "iOS >= 7",
        //     "Android >= 4.0"
        // ]
    ]
}
