/* eslint func-names: 0 */
const action = require('../lib/actions/invoke');
const AWS = require('aws-sdk-mock');
const assert = require('assert');

describe('Given invoke action', function () {

    it('should execute a call', function () {
        AWS.mock('Lambda', 'invoke', function (params, callback) {
            assert.deepStrictEqual(params, {
                FunctionName: 'foo',
                InvocationType: 'RequestResponse',
                LogType: 'None',
                Payload: JSON.stringify({
                    start: 'the action'
                }),
                Qualifier: '$LATEST'
            });
            callback(null, {
                Payload: 'Hello world'
            });
        });
        return action.process({
            body: {
                start: 'the action'
            }
        }, {
            functionName: 'foo'
        }).then((result) => {
            assert.ok(result);
            assert.deepEqual(result.body, {
                result: 'Hello world'
            });
        });
    });
});
