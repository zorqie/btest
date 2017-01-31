import React from 'react';
import ReactDOM from 'react-dom';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import AppBar from 'material-ui/AppBar';
import Divider from 'material-ui/Divider';
import FlatButton from 'material-ui/FlatButton'
import {grey600, darkBlack, lightBlack} from 'material-ui/styles/colors';

import VenueForm from './venue/venue-form.jsx';
import LoginForm from './login-form.jsx';
import SignupForm from './signup-form.jsx';

import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router';

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


const Layout = React.createClass({
	render() { 
		return (
		<MuiThemeProvider>
			<div>
				<AppBar 
					title="Ze App" 
					iconElementRight={
						<span>
							<Link to='/login'><FlatButton label="Login" /></Link>
							<FlatButton onClick={app.logout} label="Logout"/>
						</span>
					}/>
				<ul>
					<li><Link to='/login'><FlatButton label="Login" /></Link></li>
					<li><FlatButton onClick={app.logout} label="Logout"/></li>
					<li><Link to='/signup'>Signup</Link></li>
				</ul>
				{this.props.children}
				<footer>
					Footing business goes here
				</footer>
			</div>
		</MuiThemeProvider>
		)
	}
});

const Home = (props) => <p>We're home</p>;

app.authenticate().then(() => {
	console.log("Authentificated.");
	ReactDOM.render(
		<Router history={browserHistory}>
			<Route path="/" component={Layout}>
				<IndexRoute component={Home} />
				<Route path='login' component={LoginForm} />
				<Route path='signup' component={SignupForm} />
			</Route>
		</Router>
		, 
		document.getElementById("app")
	);
}).catch(error => {
	console.log("Not happening.", error);
	ReactDOM.render(
		<MuiThemeProvider>
			<LoginForm feathers={app}/>			
		</MuiThemeProvider>, 
		document.getElementById("app")
	);
});