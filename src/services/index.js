'use strict';
const authentication = require('./authentication');
const user = require('./user');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

module.exports = function() {
  const app = this;

  // app.configure(authentication);
  // app.configure(user);
};
