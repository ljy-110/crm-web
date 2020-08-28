module.exports = {

    // 打包APP参考文章
    // https://www.cnblogs.com/taohuaya/p/10263519.html
    publicPath: process.env.NODE_ENV === "production" ? "" : "/",
    devServer:{
        // port:9527,
        open:true,
        // proxy:"http://18.221.26.116",
        proxy: {
            // '/api': {
            //     target:'http://18.221.26.116',
            //     // target:'http://192.168.101.171:9090',
            //     // target: 'htttp://106.12.119.162:50001',

            //     // target: 'https://wxcrm.opencom.cn',// http://106.12.119.162:8008
            //     ws: true,
            //     changeOrigin : true,
            //     // secure: false,  // 如果是https接口，需要配置这个参数
            //     // pathRewrite: {
            //     //     '^/api': ''
            //     // }
            // }
        }
    }

}
