'use strict';

const service = require('feathers-mongoose');
const gig = require('./gig-model');
const hooks = require('./hooks');

module.exports = function() {
  const app = this;

  const options = {
    Model: gig,
    paginate: {
      default: 5,
      max: 25
    }
  };

  // Initialize our service with any options it requires
  app.use('/gigs', service(options));

  // Get our initialize service to that we can bind hooks
  const gigService = app.service('/gigs');

  // Set up our before hooks
  gigService.before(hooks.before);

  // Set up our after hooks
  gigService.after(hooks.after);
};
