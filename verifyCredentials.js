/**
* This function will be called by the platform to verify given credentials
*
* @returns Promise
* */
// eslint-disable-next-line no-unused-vars
function verifyCredentials(credentials) {
  this.logger.info('Verify Credentials started');
  return Promise.resolve(true);
}

module.exports = verifyCredentials;
