import React from 'react';
import ReactDOM from 'react-dom';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import AppBar from 'material-ui/AppBar';
import Divider from 'material-ui/Divider';
import {grey600, darkBlack, lightBlack} from 'material-ui/styles/colors';

import VenueForm from './venue/venue-form.jsx';
import LoginForm from './login-form.jsx';

// touchy-screen stuff 
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

const feathers = require('feathers/client');
const auth = require('feathers-authentication/client');
const socketio = require('feathers-socketio/client');
const hooks = require('feathers-hooks');
const io = require('socket.io-client');

// Establish a Socket.io connection
// const socket = io('http://localhost:3017');
const socket = io('https://fathomless-gorge-78924.herokuapp.com/');
// Initialize our Feathers client application through Socket.io
// with hooks and authentication.
const app = feathers()
	.configure(socketio(socket))
	.configure(hooks())
	// Use localStorage to store our login token
	.configure(auth({ storage: window.localStorage }));

app.authenticate().then(() => {
	console.log("Authentificated.");
	ReactDOM.render(
		<MuiThemeProvider>
			<VenueForm feathers={app}/>
		</MuiThemeProvider>, 
		document.getElementById("app")
	);
}).catch(error => {
	console.log("Not happening.");
	ReactDOM.render(
		<MuiThemeProvider>
			<LoginForm feathers={app}/>			
		</MuiThemeProvider>, 
		document.getElementById("app")
	);
});