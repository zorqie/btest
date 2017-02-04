'use strict';

const path = require('path');
const serveStatic = require('feathers').static;
const favicon = require('serve-favicon');
const compress = require('compression');
const cors = require('cors');
const feathers = require('feathers');
const configuration = require('feathers-configuration');
const authentication = require('feathers-authentication');

const hooks = require('feathers-hooks');
const rest = require('feathers-rest');
const bodyParser = require('body-parser');
const socketio = require('feathers-socketio');
const mongoose = require('mongoose');

const middleware = require('./middleware');
const services = require('./services');

const routing = function (request, response){
  console.log("Routing ",request._parsedUrl);
  response.sendFile(path.resolve(__dirname, app.get('public'), 'index.html'))
};

const app = feathers();

app.configure(configuration(path.join(__dirname, '..')));


app.use(compress())
  .options('*', cors())
  .use(cors())
  .use(favicon( path.join(app.get('public'), 'favicon.ico') ))
  .use('/', serveStatic( app.get('public') ))
  .get('*', routing)  // handle every other route with index.html, which will contain
                      // a script tag to your application's JavaScript file(s).
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .configure(hooks())
  .configure(rest())
  .configure(socketio())
  .configure(services)
  .configure(middleware)
  .configure(authentication());






// mongoose.Promise = global.Promise;
// const mongo_url = app.get('mongoose');
// console.log(`Connectifying to ${mongo_url}`);
// mongoose.connect();
// console.log('Connectionized.');

module.exports = app;
