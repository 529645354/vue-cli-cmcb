module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:9000',
        changeOrigin: true, // 将基于名称的虚拟托管网站的选项，如果不配置，请求会报404
        ws: true,
        pathRewrite: {
          '^/api': ''
        }
      },
      '/k8s': {
        target: 'http://127.0.0.1:9001',
        changeOrigin: true, // 将基于名称的虚拟托管网站的选项，如果不配置，请求会报404
        ws: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
}
