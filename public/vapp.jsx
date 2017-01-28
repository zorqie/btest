import React from 'react';
import ReactDOM from 'react-dom';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import AppBar from 'material-ui/AppBar';
import Divider from 'material-ui/Divider';
import {grey600, darkBlack, lightBlack} from 'material-ui/styles/colors';

import VenueForm from './venue/venue-form.jsx';

// touchy-screen stuff 
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

const feathers = require('feathers/client');
const auth = require('feathers-authentication/client');
const socketio = require('feathers-socketio/client');
const hooks = require('feathers-hooks');
const io = require('socket.io-client');

// Establish a Socket.io connection
const socket = io('http://localhost:3017');
// Initialize our Feathers client application through Socket.io
// with hooks and authentication.
const app = feathers()
	.configure(socketio(socket))
	.configure(hooks())
	// Use localStorage to store our login token
	.configure(auth({ storage: window.localStorage }));

app.authenticate().then(() => {
	ReactDOM.render(
		<MuiThemeProvider>
			<VenueForm feathers={app}/>			
		</MuiThemeProvider>, 
		document.getElementById("app")
	);
}).catch(error => {
	if(error.code === 401) {
		window.location.href = '/login.html'
	}
	console.error(error);
});