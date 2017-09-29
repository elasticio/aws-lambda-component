/* eslint func-names: 0 */
'use strict';
const action = require('../lib/actions/invoke');
const AWS = require('aws-sdk-mock');
const assert = require('assert');

describe('Given invoke action without JSONata', function () {

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

describe('Given invoke action with proper JSONata', function () {

    beforeEach(() => {
        AWS.mock('Lambda', 'invoke', function (params, callback) {
            assert.deepStrictEqual(params, {
                FunctionName: 'foo',
                InvocationType: 'RequestResponse',
                LogType: 'None',
                Payload: JSON.stringify({
                    foo: 'THE ACTION'
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
            functionName: 'foo',
            expression: `{
                    "foo": $uppercase(start)
                }`
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

describe('Given invoke action with faulty JSONata', function () {

    it('it should fail', function () {
        return expect(action.process({
            body: {
                start: 'the action'
            }
        }, {
            functionName: 'foo',
            expression: 'boom!'
        })).rejects.toBeDefined();
    });

});
