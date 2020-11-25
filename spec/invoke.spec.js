/* eslint func-names: 0 */

const AWS = require('aws-sdk-mock');
const assert = require('assert');
const logger = require('@elastic.io/component-logger')();
const action = require('../lib/actions/invoke');

describe('Given invoke action without JSONata', () => {
  describe('and lambda with RequestReponse function returning string', () => {
    beforeEach(() => {
      AWS.mock('Lambda', 'invoke', (params, callback) => {
        assert.deepStrictEqual(params, {
          FunctionName: 'foo',
          InvocationType: 'RequestResponse',
          LogType: 'None',
          Payload: JSON.stringify({
            start: 'the action',
          }),
          Qualifier: '$LATEST',
        });
        callback(null, {
          StatusCode: 200,
          Payload: 'Hello world',
        });
      });
    });

    it('should execute a call with string response', () => action.process.call({ logger }, {
      body: {
        start: 'the action',
      },
    }, {
      functionName: 'foo',
    }).then((result) => {
      assert.ok(result);
      assert.deepEqual(result.body, {
        StatusCode: 200,
        Payload: 'Hello world',
      });
    }));

    afterEach(() => AWS.restore());
  });

  describe('and lambda with RequestReponse function returning JSON', () => {
    beforeEach(() => {
      AWS.mock('Lambda', 'invoke', (params, callback) => {
        assert.deepStrictEqual(params, {
          FunctionName: 'foo',
          InvocationType: 'RequestResponse',
          LogType: 'None',
          Payload: JSON.stringify({
            start: 'the action',
          }),
          Qualifier: '$LATEST',
        });
        callback(null, {
          StatusCode: 200,
          Payload: JSON.stringify({
            message: 'Hello world!',
          }),
        });
      });
    });

    it('should execute a call with JSON response', () => action.process.call({ logger }, {
      body: {
        start: 'the action',
      },
    }, {
      functionName: 'foo',
    }).then((result) => {
      assert.ok(result);
      assert.deepEqual(result.body, {
        message: 'Hello world!',
      });
    }));

    afterEach(() => AWS.restore());
  });

  describe('and lambda with Event function returning JSON', () => {
    beforeEach(() => {
      AWS.mock('Lambda', 'invoke', (params, callback) => {
        assert.deepStrictEqual(params, {
          FunctionName: 'bar',
          InvocationType: 'Event',
          LogType: 'None',
          Payload: JSON.stringify({
            start: 'the action',
          }),
          Qualifier: '$LATEST',
        });
        callback(null, {
          StatusCode: 200,
        });
      });
    });

    it('should execute a call with JSON response', () => action.process.call({ logger }, {
      body: {
        start: 'the action',
      },
    }, {
      functionName: 'bar',
      invocationType: 'Event',
    }).then((result) => {
      assert.ok(result);
      assert.deepEqual(result.body, {
        StatusCode: 200,
      });
    }));

    afterEach(() => AWS.restore());
  });
});

describe('Given invoke action with proper JSONata', () => {
  beforeEach(() => {
    AWS.mock('Lambda', 'invoke', (params, callback) => {
      assert.deepStrictEqual(params, {
        FunctionName: 'foo',
        InvocationType: 'RequestResponse',
        LogType: 'None',
        Payload: JSON.stringify({
          foo: 'THE ACTION',
        }),
        Qualifier: '$LATEST',
      });
      callback(null, {
        StatusCode: 200,
        Payload: 'Hello world',
      });
    });
  });

  it('should execute a call with string response', () => action.process.call({ logger }, {
    body: {
      start: 'the action',
    },
  }, {
    functionName: 'foo',
    expression: `{
                    "foo": $uppercase(start)
                }`,
  }).then((result) => {
    assert.ok(result);
    assert.deepEqual(result.body, {
      StatusCode: 200,
      Payload: 'Hello world',
    });
  }));

  afterEach(() => AWS.restore());
});

describe('Given invoke action with faulty JSONata', () => {
  // eslint-disable-next-line no-undef
  it('it should fail', () => expect(action.process.call({ logger }, {
    body: {
      start: 'the action',
    },
  }, {
    functionName: 'foo',
    expression: 'boom!',
  })).rejects.toBeDefined());
});
