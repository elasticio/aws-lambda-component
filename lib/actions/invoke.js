const { messages } = require('elasticio-node');
const aws = require('aws-sdk');
const jsonata = require('jsonata');

/**
* This function will be called by the platform to verify given credentials
*
* @returns Promise
* */
function processAction(msg, cfg) {
  const self = this;
  const lambda = new aws.Lambda({
    region: cfg.region,
    accessKeyId: cfg.aws_access_key_id,
    secretAccessKey: cfg.aws_secret_access_key,
  });
  return new Promise((ok, nok) => {
    let evalResult = msg.body;
    self.logger.debug('Calling lambda specified function');
    const { expression } = cfg;
    if (expression) {
      self.logger.debug('Evaluating expression received');
      const compiledExpression = jsonata(expression);
      evalResult = compiledExpression.evaluate(msg.body);
      self.logger.debug('Evaluation completed');
    }
    lambda.invoke({
      FunctionName: cfg.functionName,
      InvocationType: cfg.invocationType || 'RequestResponse',
      LogType: cfg.logType || 'None',
      Payload: JSON.stringify(evalResult),
      Qualifier: cfg.Qualifier || '$LATEST',
    }, (err, result) => {
      if (err) {
        self.logger.error('Failed to invoke specified function');
        return nok(err);
      }
      self.logger.debug('Successful response received');
      if (result.LogResult) {
        self.logger.debug('LogResult received');
        // eslint-disable-next-line no-param-reassign
        delete result.LogResult;
      }
      try {
        if (result.Payload) {
          const json = JSON.parse(result.Payload);
          ok(messages.newMessageWithBody(json));
        }
      } catch (e) {
        // Ignore it now
        self.logger.warn('Error occurred during parsing result');
      }
      self.logger.debug('Resulting payload is not JSON, sending it as string');
      return ok(messages.newMessageWithBody(result));
    });
  });
}

module.exports.process = processAction;
