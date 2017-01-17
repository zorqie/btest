'use strict';

const signup = require('./signup');

const handler = require('feathers-errors/handler');
const notFound = require('./not-found-handler');
const logger = require('./logger');
const winston = require('winston');

module.exports = function() {
	// Add your custom middleware here. Remember, that
	// just like Express the order matters, so error
	// handling middleware should go last.
	const app = this;
	app.on('login', function(what){
		winston.info('Logged in.', what);
	});

	app.on('logout', function(who){
		winston.info('LOGGED OUT', who);
	});

	app.post('/signup', signup(app));

	app.use(notFound());
	app.use(logger(app));
	app.use(handler());
};
