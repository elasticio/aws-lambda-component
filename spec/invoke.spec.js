/* eslint func-names: 0 */
const action = require('../lib/actions/invoke');
const AWS = require('aws-sdk-mock');
const assert = require('assert');

describe('Given invoke action', function () {

    describe('and lambda with RequestReponse function returning string', () => {
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
                    StatusCode: 200,
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
                    StatusCode: 200,
                    Payload: 'Hello world'
                });
            });
        });

        afterEach(() => AWS.restore());
    });

    describe('and lambda with RequestReponse function returning JSON', () => {
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
                    StatusCode: 200,
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
                assert.deepEqual(result.body, {
                    message: 'Hello world!'
                });
            });
        });

        afterEach(() => AWS.restore());
    });

    describe('and lambda with Event function returning JSON', () => {
        beforeEach(() => {
            AWS.mock('Lambda', 'invoke', function (params, callback) {
                assert.deepStrictEqual(params, {
                    FunctionName: 'bar',
                    InvocationType: 'Event',
                    LogType: 'None',
                    Payload: JSON.stringify({
                        start: 'the action'
                    }),
                    Qualifier: '$LATEST'
                });
                callback(null, {
                    StatusCode: 200
                });
            });
        });

        it('should execute a call with JSON response', function () {
            return action.process({
                body: {
                    start: 'the action'
                }
            }, {
                functionName: 'bar',
                invocationType: 'Event'
            }).then((result) => {
                assert.ok(result);
                assert.deepEqual(result.body, {
                    StatusCode: 200
                });
            });
        });

        afterEach(() => AWS.restore());
    });

});
