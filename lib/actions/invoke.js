const { messages } = require('elasticio-node');
const aws = require('aws-sdk');
const debug = require('debug')('aws-lambda-component:invoke');

/**
* This function will be called by the platform to verify given credentials
*
* @returns Promise
**/
function processAction(msg, cfg) {
    const lambda = new aws.Lambda({
        region: cfg.region,
        accessKeyId: cfg.aws_access_key_id,
        secretAccessKey: cfg.aws_secret_access_key
    });
    return new Promise((ok, nok) => {
        debug('Calling lambda function=%s region=%s', cfg.functionName, cfg.region);
        lambda.invoke({
            FunctionName: cfg.functionName,
            InvocationType: cfg.invokationType || 'RequestResponse',
            LogType: cfg.logType || 'None',
            Payload: JSON.stringify(msg.body),
            Qualifier: cfg.Qualifier || '$LATEST'
        }, (err, result) => {
            if (err) {
                debug('Failed to invoike function=%s error=%s', cfg.functionName, err.stack || err);
                return nok(err);
            }
            debug('Successfull response: %j', result);
            try {
                const json = JSON.parse(result.Payload);
                ok(messages.newMessageWithBody(json));
            } catch (err) {
                // Ignore it now
            }
            debug('Resulting payload is not JSON, sending it as string');
            return ok(messages.newMessageWithBody({
                result: result.Payload
            }));
        });
    });
}

module.exports.process = processAction;
