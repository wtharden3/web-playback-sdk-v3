// const proxy = require('http-proxy-middleware');
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    // app.use(proxy(`/auth/**`, { 
    //     target: 'http://localhost:5000' 
    // }));

    app.use(`/auth/**`, createProxyMiddleware({
      target: 'http://localhost:5000',
      changeOrigin: true
    }))
};