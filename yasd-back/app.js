const { createProxyMiddleware } = require('http-proxy-middleware');
const express = require('express');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const { jwtMiddleware, login, logout } = require('./middlewares/auth');
const openSearchMiddleware = require('./middlewares/opensearch');
const wazuhAuthAndProxyMiddleware = require('./middlewares/wazuhAPI');
const { yasdConfig, yasdUIConfig } = require('./config');

const app = express();

app.use(express.json());
app.use(logger('dev'));
app.use(cookieParser());

// Check jwt token for Vue js on refresh
app.get('/auth/validate', jwtMiddleware, (req, res) => {
    res.json({ isAuthenticated: true });
});

app.post('/login', login);
app.post('/logout', logout);

app.get('/config', (req, res) => {
    res.json(yasdUIConfig);
});

app.use('/opensearch', jwtMiddleware, openSearchMiddleware());
app.use('/wazuh', jwtMiddleware, wazuhAuthAndProxyMiddleware());

/*Dev
app.use(createProxyMiddleware('/', {
    target: yasdConfig.VUE_APP_URL,
    changeOrigin: true,
    logLevel: 'info'
}));*/

//Production
const path = require('path');
const staticPath = '/var/www/yasd/dist/';
app.use(express.static(staticPath, {
        setHeaders: (res, filePath) => {
        if (path.extname(filePath) === '.js') {
            res.set('Content-Type', 'application/javascript');
        }
        }
}));

app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).send('Unauthorized: Invalid token');
    } else {
        next(err);
    }
});

app.listen(yasdConfig.PORT, () => console.log(`Server listening on port ${yasdConfig.PORT}`));
