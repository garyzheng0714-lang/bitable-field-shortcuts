'use strict';
// Bridge entry for Feishu VM: always load the CommonJS build output
// Ensure you run `npm run build` before deploying/packing
module.exports = require('./dist/index.js');