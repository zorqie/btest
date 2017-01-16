'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('gig service', function() {
  it('registered the gigs service', () => {
    assert.ok(app.service('gigs'));
  });
});
