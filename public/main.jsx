import React from 'react';
import ReactDOM from 'react-dom';

import Layout from './mui/layout.jsx';

import EventPage from './mui/event-page.jsx';
import GigForm from './mui/gig-form.jsx';
import LoginForm from './mui/login-form.jsx';
import SignupForm from './mui/signup-form.jsx';
import UserList from './mui/user-list.jsx';
import VenueForm from './mui/venue-form.jsx';
import VenuePage from './mui/venue-page.jsx';
import errorHandler from './mui/err';

import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router';

// touchy-screen stuff 
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

const feathers = require('feathers/client');
const auth = require('feathers-authentication/client');
const socketio = require('feathers-socketio/client');
const hooks = require('feathers-hooks');
const io = require('socket.io-client');

// FIXME this should be in configuration somewhere.
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



const Home = () => <p>We're home</p>;
const NotFound = () => <div><h2>She's not here.</h2></div>;

const handleRouteChange = (prevState, nextState, replace, callback) => {
	console.log("APP: ", app);
	console.log("Previous state: ", prevState);
	if("/login" === prevState.location.pathname) {

	}
	console.log("Nextious state: ", nextState);
	// console.log("Replace: ", replace);
	console.log("callback: ", callback); 
	callback();
}

const handleRouteEnter = (nextState, replace, callback) => {
	console.log("Entering ", nextState);
	// console.log("Replacing ", replace);
	callback();
}

class App extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		console.log("___ROUTE___")
		return <Router history={browserHistory}>
			<Route path="/" component={Layout} onChange={handleRouteChange} >
				<IndexRoute component={Home} />

				<Route path='login' component={LoginForm} />
				<Route path='signup' component={SignupForm} />

				<Route path='venues' component={VenueForm} />
				<Route path='venues/:venueId' component={VenuePage} />

				<Route path='gigs' component={GigForm} />
				<Route path='events/:eventId' component={EventPage} />
				
				<Route path='users' component={UserList} />
				
				<Route path='*' component={NotFound} />
			</Route>
		</Router>;
	}
}

app.authenticate().then(() => {

	ReactDOM.render( <App />, document.getElementById("app") );


}).catch(error => {
	ReactDOM.render( <App />, document.getElementById("app") );
// 	console.error("Not happening.", error);
// 	if(error.code === 401) {
// 		// browserHistory.push('/login');
// 		ReactDOM.render(
// 			<MuiThemeProvider>
// 				<LoginForm />			
// 			</MuiThemeProvider>, 
// 			document.getElementById("app")
// 		);
// 	}
 });


// socket.io.engine.on('upgrade', function(transport) {
//     console.log('transport changed');
//     app.authenticate();
//   });

// FIXME remove this!!!
window.appx = app;
console.log("MAIN APP IS: ", app);

export {app};
export default app;

