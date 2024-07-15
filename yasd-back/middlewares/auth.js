const jwt = require('jsonwebtoken');
const { expressjwt: expressJwt } = require('express-jwt');
const LdapClient = require('ldapjs-client');
const { pamAuthenticatePromise, PamError, pamErrors } = require('node-linux-pam');
const fs = require('fs');
const { yasdConfig } = require('../config');

const localAuthEnabled = yasdConfig.LOCAL_AUTH === 'TRUE';
const ldapAuthEnabled = yasdConfig.LDAP_AUTH === 'TRUE';

// Initialize LDAP client
if(ldapAuthEnabled){
    let caCertificate = null;
    const caCertificatePath = yasdConfig.CA_CERTIFICATE;
    
    if (fs.existsSync(caCertificatePath)) {
        caCertificate = fs.readFileSync(caCertificatePath);
    } else {
        console.log('CA certificate file does not exist.');
    }
}

// Middleware to protect routes with JWT
const jwtMiddleware = expressJwt({
    secret: yasdConfig.JWT_SECRET,
    algorithms: ['HS256'],
    getToken: (req) => {
        if (req.cookies && req.cookies.token) {
            return req.cookies.token;
        }
        return null;
    }
});

// LDAP Authentication function
async function authenticateAgainstLDAP(username, password) {
    const ldapClient = new LdapClient({ 
        url: config.LDAP_URL,
        tlsOptions: { ca: [caCertificate] }
    });
    try {
        await ldapClient.bind(`uid=${username},${yasdConfig.LDAP_USER_BASE_DN}`, password);
        console.log('LDAP authentication successful:', username);
        return true;
    } catch (error) {
        console.error('LDAP authentication failed:', error);
        return false;
    } finally {
        try {
            await ldapClient.unbind();
        } catch (error) {
            console.error('Error unbinding LDAP client:', error);
        }
    }
}

// PAM Authentication
async function authenticateWithPAM(username, password) {
    console.log("trying PAM with username:" + username)
    const options = {
        username: username,
        password: password,
        serviceName: 'login',
        remoteHost: 'localhost'
    };

    try {
        await pamAuthenticatePromise(options);
        console.log('PAM authentication successful:', username);
        return true;
    } catch (err) {
        if (err instanceof PamError) {
            const { message, code } = err;
            if (code === pamErrors.PAM_NEW_AUTHTOK_REQD) {
                console.log('Authentication PAM token is expired', message);
            } else {
                console.error('PAM authentication failed:', message, code);
            }
        }
        return false;
    }
}

// /login
async function login (req, res) {
    const { username, password } = req.body;

    const handleAuthentication = (isAuthenticated) => {
        if (isAuthenticated) {
            const token = jwt.sign({ username }, yasdConfig.JWT_SECRET, { expiresIn: yasdConfig.SESSION_DURATION * 60});

            res.cookie('token', token, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: yasdConfig.SESSION_DURATION * 60000
            });

            res.json({ message: 'Login successful', username: username });
        } else {
            res.status(401).send('Authentication failed');
        }
    };

    try {
        if (localAuthEnabled) {
            const isAuthenticated = await authenticateWithPAM(username, password);
            if (isAuthenticated) {
                handleAuthentication(true);
                return;
            } else if (ldapAuthEnabled) {
                const isLdapAuth = await authenticateAgainstLDAP(username, password);
                handleAuthentication(isLdapAuth);
                return;
            }
            handleAuthentication(false);
        } else if (ldapAuthEnabled) {
            const isLdapAuth = await authenticateAgainstLDAP(username, password);
            handleAuthentication(isLdapAuth);
        } else {
            res.status(401).send('No authentication method enabled');
        }
    } catch (error) {
        console.error('Error during authentication:', error);
        res.status(500).send('Internal server error');
    }
};

// Logout
function logout (req, res) {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0),
        secure: true,
        sameSite: 'strict',
    });

    res.json({ message: 'Logout successful' });
};

module.exports = { jwtMiddleware, login, logout }