import React from 'react';
import ReactDOM from 'react-dom';

import feathers from 'feathers/client';
import auth from 'feathers-authentication/client';
import socketio from 'feathers-socketio/client';
import hooks from 'feathers-hooks';
import io from 'socket.io-client';

import 'react-toolbox/lib/commons.scss';


// import { ThemeProvider } from 'react-css-themr';
import VenueForm from './venue-form.jsx';

const socket = io('http://localhost:3030');
// Initialize our Feathers client application through Socket.io
// with hooks and authentication.
const app = feathers()
	.configure(socketio(socket))
	.configure(hooks())
	// Use localStorage to store our login token
	.configure(auth({
		storage: window.localStorage
	}));
	
app.authenticate().then(() => {
	ReactDOM.render(
			<VenueForm feathers={app}/>	
	, document.getElementById("app"));
})
/*.catch(error => {
	if(error.code === 401) {
		window.location.href = '/login.html'
	}

	console.error(error);
})*/;