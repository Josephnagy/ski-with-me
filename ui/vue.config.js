module.exports = {
    publicPath: "./",
    devServer: {
        proxy: {
            "^/api": {
                "target": "http://localhost:3000",
                // "target": "https://banana-crisp-68236.herokuapp.com/",
                changeOrigin: true
            }
        }
    }
};
