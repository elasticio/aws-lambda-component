const { messages } = require('elasticio-node');

/**
* This function will be called by the platform to verify given credentials
*
* @returns Promise
**/
function processAction(msg, cfg, snapshot = {}) {
    return Promise.resolve(true);
}

module.exports.process = processAction;
