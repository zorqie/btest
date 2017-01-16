'use strict';

const service = require('feathers-mongoose');
const Act = require('./act-model');
const hooks = require('./hooks');

module.exports = function() {
  const app = this;

  const options = {
    Model: Act,
    paginate: {
      default: 5,
      max: 25
    }
  };

  // Initialize our service with any options it requires
  app.use('/acts', service(options));

  // Get our initialize service to that we can bind hooks
  const actService = app.service('/acts');

  // Set up our before hooks
  actService.before(hooks.before);

  // Set up our after hooks
  actService.after(hooks.after);
};
