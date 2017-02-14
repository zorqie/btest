import React from 'react';
import ReactDOM from 'react-dom';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import AppBar from 'material-ui/AppBar';
import Divider from 'material-ui/Divider';
import FlatButton from 'material-ui/FlatButton'
import {grey600, darkBlack, lightBlack} from 'material-ui/styles/colors';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';

import GigForm from './mui/gig-form.jsx';
import LoginForm from './mui/login-form.jsx';
import SignupForm from './mui/signup-form.jsx';
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


class Layout extends React.Component {
	constructor(props) {
		super(props);
		this.state = { drawerOpen: false, user: app.get('user'), section: 'BFest' };

		console.log("Layout stated: ", this.state);
		this.closeDrawer = this.closeDrawer.bind(this);
		this.toggleDrawer = this.toggleDrawer.bind(this);
		this.handleMenu = this.handleMenu.bind(this);

		this.sections = [
			{ text: "Venues", path: "/venues"},
			{ text: "Events", path: "/gigs"},
		]
		window.appstate = this.state;
	}
	closeDrawer() {
		this.setState({...this.state, drawerOpen: false})
	}
	toggleDrawer() {
		this.setState({...this.state, drawerOpen: !this.state.drawerOpen});
	}
	handleMenu = (section) => {
		// console.log("Menu: ", section);
		const {path, text} = section;
		this.setState({...this.state, section: text, drawerOpen: false});
		// this.closeDrawer();
		browserHistory.push(path);
	}
	handleLogout = () => {
		this.setState({user: null});
		app.logout();
		browserHistory.push('/out');
	}
	handleLogin = () => {
		this.setState({user: app.get('user')});
	}
	render() { 
		return (
		<MuiThemeProvider>
			<div>
				<AppBar 
					title={this.state.section}
					iconElementRight={
						this.state.user ? 
							<FlatButton onClick={this.handleLogout} label="Logout"/>
							:
							<Link to='/login'><FlatButton label="Login" /></Link>
					}
					onLeftIconButtonTouchTap={this.toggleDrawer}
				/>
				<Drawer 
					docked={false}
					width={200}
					open={this.state.drawerOpen}
					>
					{this.sections.map( section => 
						<MenuItem onTouchTap={this.handleMenu.bind(this, section)} primaryText={section.text} key={section.path}/>
					)}
				</Drawer>
				{this.props.children}
				<footer>
					Footering business goes here
				</footer>
			</div>
		</MuiThemeProvider>
		)
	}
};

const Home = () => <p>We're home</p>;
const NotFound = () => <p>She's not here.</p>;

const handleRouteChange = (prevState, nextState, replace, callback) => {
	console.log("Previous state: ", prevState);
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

const venueEnter = (nextState, replace, callback) => {
	const venueService = app.service('venues');
	venueService.get(nextState.params.venueId)
		.then(() => callback())
		.catch(errorHandler);

}

const routes = <Router history={browserHistory}>
			<Route path="/" component={Layout} feathers={app} onChange={handleRouteChange} >
				<IndexRoute component={Home} />
				<Route path='login' component={LoginForm} feathers={app} />
				<Route path='signup' component={SignupForm} />
				<Route 
					path='venues' 
					component={VenueForm} 
					onEnter={handleRouteEnter}
					
					feathers={app} >
					
				</Route>
				<Route path='venues/:venueId' component={VenuePage} onEnter={venueEnter}/>
				<Route path='gigs' component={GigForm} feathers={app} >

				</Route>

				<Route path='*' component={NotFound} />
			</Route>
		</Router>;

app.authenticate().then(() => {
	console.log("Authentificated.", app.get('user'));
	ReactDOM.render(
		routes
		, document.getElementById("app")
	);
}).catch(error => {
	console.error("Not happening.", error);
	if(error.code === 401) {
		// browserHistory.push('/login');
		ReactDOM.render(
			<MuiThemeProvider>
				<LoginForm feathers={app}/>			
			</MuiThemeProvider>, 
			document.getElementById("app")
		);
	}
});

export default app;

// FIXME remove this!!!
window.appx = app;