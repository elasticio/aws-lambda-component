const { messages } = require('elasticio-node');

/**
* This function will be called by the platform to verify given credentials
*
* @returns Promise
**/
module.exports.process = function (cfg, msg) {
    this.emit('data', messages.newMessageWithBody({
        foo: ''
    }));
    return Promise.resolve(true);
};
