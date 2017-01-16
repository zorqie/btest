'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('venue service', function() {
  it('registered the venues service', () => {
    assert.ok(app.service('venues'));
  });
});
