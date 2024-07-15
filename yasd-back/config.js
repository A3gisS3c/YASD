const fs = require('fs');

function loadConfig(filePath) {
    const config = {};
    try {
        const configContents = fs.readFileSync(filePath, 'utf-8');
        configContents.split('\n').forEach(line => {
            const [key, value] = line.split('=');
            if (key && value) {
                const trimmedKey = key.trim();
                const trimmedValues = value.trim().split(/\s+/); // Split by any whitespace
                config[trimmedKey] = trimmedValues.length > 1 ? trimmedValues : trimmedValues[0];
            }
        });
    } catch (err) {
        console.error(`Failed to read config file ${filePath}:`, err);
    }
    return config;
}

const yasdConfigPath = '/etc/yasd/yasd.conf';
const yasdUIConfigPath = '/etc/yasd/yasdUI.conf';

const yasdConfig = loadConfig(yasdConfigPath);
const yasdUIConfig = loadConfig(yasdUIConfigPath);

module.exports = { yasdConfig, yasdUIConfig };
