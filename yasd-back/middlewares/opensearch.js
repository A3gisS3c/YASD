const { createProxyMiddleware } = require('http-proxy-middleware');
const { yasdConfig } = require('../config');

function openSearchProxy() {
    return createProxyMiddleware({
        target: yasdConfig.OPENSEARCH_URL,
        changeOrigin: true,
        secure: false,
        logLevel: 'info',
        auth: `${yasdConfig.OPENSEARCH_USER}:${yasdConfig.OPENSEARCH_PASS}`,
        pathRewrite: function (path, req) { return path.replace('/opensearch', '') },
        onProxyReq: (proxyReq, req) => {
            proxyReq.setHeader('Content-Type', 'application/json');
        }
    });
}

module.exports = openSearchProxy;
