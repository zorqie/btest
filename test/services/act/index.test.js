'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('act service', function() {
  it('registered the acts service', () => {
    assert.ok(app.service('acts'));
  });
});
