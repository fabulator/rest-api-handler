const { setupTestFrameworkScriptFile, ...config } = require('@socifi/jest-config')('build');

console.log(config);

module.exports = config;
