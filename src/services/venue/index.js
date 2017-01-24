'use strict';
const mongoose = require('mongoose');
const service = require('feathers-mongoose');
const venue = require('./venue-model');
const hooks = require('./hooks');

module.exports = function() {
  const app = this;

  const options = {
    Model: venue,
    paginate: {
      default: 5,
      max: 25
    },
    lean: true
  };

  // Initialize our service with any options it requires
  app.use('/venues', service(options));

  // Get our initialize service to that we can bind hooks
  const venueService = app.service('/venues');

  // Set up our before hooks
  venueService.before(hooks.before);

  // Set up our after hooks
  venueService.after(hooks.after);
};
