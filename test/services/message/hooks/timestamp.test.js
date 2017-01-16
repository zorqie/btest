'use strict';

const assert = require('assert');
const timestamp = require('../../../../src\services\message\hooks\timestamp.js');

describe('message timestamp hook', function() {
  it('hook can be used', function() {
    const mockHook = {
      type: 'before',
      app: {},
      params: {},
      result: {},
      data: {}
    };

    timestamp()(mockHook);

    assert.ok(mockHook.timestamp);
  });
});
