/* eslint func-names: 0 */
const action = require('../lib/actions/invoke');
const AWS = require('aws-sdk-mock');
const assert = require('assert');

describe('Given invoke action', function () {

    describe('and lambda function returning string', () => {
        beforeEach(() => {
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
        });

        it('should execute a call with string response', function () {
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

        afterEach(() => AWS.restore());
    });

    describe('and lambda function returning JSON', () => {
        beforeEach(() => {
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
                    Payload: JSON.stringify({
                        message: 'Hello world!'
                    })
                });
            });
        });

        it('should execute a call with JSON response', function () {
            return action.process({
                body: {
                    start: 'the action'
                }
            }, {
                functionName: 'foo'
            }).then((result) => {
                assert.ok(result);
                console.log(result.body);
                assert.deepEqual(result.body, {
                    message: 'Hello world!'
                });
            });
        });

        afterEach(() => AWS.restore());
    });

});
