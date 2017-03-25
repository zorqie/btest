import React from 'react';
import ReactDOM from 'react-dom';

import Layout from './mui/layout.jsx';

import ActsPage from './mui/acts-page.jsx';
import ActDetailsPage from './mui/act-details-page.jsx';
import EventDetailsPage from './mui/event-details-page.jsx';
import EventsPage from './mui/events-page.jsx';
import GigDetailsPage from './mui/gig-details-page.jsx';
import LoginForm from './mui/login-form.jsx';
import ShiftDetailsPage from './mui/shift-details-page.jsx';
import SignupForm from './mui/signup-form.jsx';
import UserList from './mui/user-list.jsx';
import UserCard from './mui/user-card.jsx';
import VenuePage from './mui/venues-page.jsx';
import VolunteerTable from './mui/event-volunteer-table.jsx';
import VenueDetailsPage from './mui/venue-details-page.jsx';
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
// const socket = io('http://localhost:2017');
// perhaps based on process.env.NODE_ENV
const socket = io('https://gyps.herokuapp.com/');
// Initialize our Feathers client application through Socket.io
// with hooks and authentication.
const app = feathers()
	.configure(socketio(socket))
	.configure(hooks())
	// Use localStorage to store our login token
	.configure(auth({ storage: window.localStorage }));



const Home = () => <p>We're home</p>;
const NotFound = () => <div style={{color:'red'}}><h2>She's not here.</h2></div>;

/*
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
*/

const routes = 
		<Router history={browserHistory}>
			<Route path="/" component={Layout}  >
				<IndexRoute component={Home} />

				<Route path='home' component={EventsPage} />

				<Route path='login' component={LoginForm} />
				<Route path='signup' component={SignupForm} />

				<Route path='venues' component={VenuePage} />
				<Route path='venues/:venueId' component={VenueDetailsPage} details-/>

				<Route path='events' component={EventsPage} />
				<Route path='events/:eventId' component={EventDetailsPage} />
				<Route path='gigs/:gigId' component={GigDetailsPage} />
				<Route path='shifts/:shiftId' component={ShiftDetailsPage} />
				
				<Route path='acts' component={ActsPage} />
				<Route path='acts/:actId' component={ActDetailsPage} />

				<Route path='schedule/:eventId' component={VolunteerTable} />

				<Route path='users' component={UserList} />
				<Route path='users/:userId' component={UserCard} />
				
				<Route path='*' component={NotFound} />
			</Route>
		</Router>


// FIXME hack to make app available to pages when not going through / first
app.authenticate().then(() => {

	ReactDOM.render( routes, document.getElementById("app") );


}).catch(error => {
	ReactDOM.render( routes, document.getElementById("app") );
	console.error("Not authenticated.", error);
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


socket.io.engine.on('upgrade', function(transport) {
	console.log('transport changed', transport);
	app.authenticate();
});

// FIXME remove this!!!
window.appx = app;

export default app;

