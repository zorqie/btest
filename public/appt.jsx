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

const LoginForm = () => (
	<div className="ui container">
			<h2>Login</h2>
			<form action="/auth/local" method="post">
				<div className="required field">
					<label htmlFor="email" >E-mail:</label>
					<input type="email" id="email" name="email" placeholder="email" />
				</div>
				<div className="required field">
					<label htmlFor="password" >Password:</label>
					<input type="password" id="password" name="password" placeholder="password" />
				</div>
				<button type="submit">
					Login
				</button>
			</form>
		</div>
);

const socket = io('http://localhost:3017');
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
.catch(error => {
	if(error.code === 401) {
		ReactDOM.render(<LoginForm />, document.getElementById("app"));
	}

	console.error(error);
});