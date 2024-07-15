const { createProxyMiddleware } = require('http-proxy-middleware');
const axios = require('axios');
const https = require('https');
const { yasdConfig } = require('../config');

// Global variable to store Wazuh token
let wazuhToken = { token: null, expirationTime: 0}

function wazuhAuthAndProxyMiddleware() {
    return async (req, res, next) => {
        const { wazuhToken } = req.app.locals;
        const currentTime = new Date().getTime();

        if (!wazuhToken || currentTime >= wazuhToken.expirationTime) {
            const agent = new https.Agent({ rejectUnauthorized: false });
            try {
                const response = await axios.create({
                    baseURL: yasdConfig.WAZUH_API_URL,
                    httpsAgent: agent,
                    auth: { username: yasdConfig.WAZUH_USERNAME, password: yasdConfig.WAZUH_PASSWORD },
                }).post("/security/user/authenticate");

                const expiresIn = yasdConfig.WAZUH_TOKEN_EXPIRATION * 1000;
                req.app.locals.wazuhToken = {
                    token: response.data.data.token,
                    expirationTime: currentTime + expiresIn,
                };
            } catch (error) {
                console.error('Error authenticating with Wazuh:', error);
                return res.status(500).send('Internal Server Error');
            }
        }

        const proxy = createProxyMiddleware({
            target: yasdConfig.WAZUH_API_URL,
            changeOrigin: true,
            secure: false,
            logLevel: 'debug',
            pathRewrite: path => path.replace('/wazuh', ''),
            onProxyReq: proxyReq => {
                if (req.app.locals.wazuhToken && req.app.locals.wazuhToken.token) {
                    proxyReq.setHeader('Authorization', `Bearer ${req.app.locals.wazuhToken.token}`);
                }
            }
        });

        return proxy(req, res, next);
    };
}

module.exports = wazuhAuthAndProxyMiddleware;