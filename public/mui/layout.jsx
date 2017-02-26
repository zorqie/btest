import React from 'react';

import { Link, browserHistory } from 'react-router';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import AppBar from 'material-ui/AppBar';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import Drawer from 'material-ui/Drawer';
import FlatButton from 'material-ui/FlatButton'
import MenuItem from 'material-ui/MenuItem';

import app from '../main.jsx';
import errorHandler from './err'

export default class Layout extends React.Component {
	constructor(props) {
		super(props);
		this.state = { 
			drawerOpen: false, 
			user: null, 
			section: 'BFest',
			snackbarOpen: false,
			message: ''
		};

		// console.log("Layout constructed: ", this.state);

		this.sections = [
			{ text: "Venues", path: "/venues"},
			{ text: "Events", path: "/gigs"},
			{ text: "Users", path: "/users"},
		]
		window.layout = this; // FIXME REMOVE!
	}
	componentDidMount() {
		app.authenticate()
			.then(this.handleLogin())
			.catch(errorHandler);
		app.on('authenticated', this.handleLogin);
	}
	componentWillUnmount() {
		if(app) {
			app.removeListener('authenticated', this.handleLogin);
		}
	}

	handleUserChange = (u) => {
		console.log("User loginified: ", u);
		this.setState({snackbarOpen: true, message: "User logged in"});
	}

	closeDrawer = () => {
		this.setState({...this.state, drawerOpen: false})
	}
	toggleDrawer = () => {
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
		app.service('users').patch(this.state.user._id, {online: false}).then(u => {
			console.log('User offline', u);
			this.setState({user: null});
			app.logout();
			browserHistory.push('/out');
		});
	}
	handleLogin = (u) => {
		const user = app.get('user');
		if(user) {
			console.log("-=-=- AUTHENTICATED (app.user) -=-=-", user);
			if(!this.state.user || user.online != this.state.user.online) {
				// app.service('users').patch(user._id, {online: true})
				// .then(u => {
				// 	app.emit('loginified', u);
				// });
			}
			this.setState({user});
		}
	}
	handleDrawer = (open, reason) => {
		// console.log(`Open: ${open} for ${reason}`);
		this.setState({...this.state, drawerOpen: open})
	}
	render() { 
		console.log("------------ LAYOUT ------------");
		const {user} = this.state;
		return ( 
		<MuiThemeProvider>
			<div>
				<AppBar 
					title={this.state.section}
					iconElementRight={
						user ? 
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
					onRequestChange={this.handleDrawer}
					>
					{ user && 
						<Card>
							<CardHeader
								title={user.name}
								subtitle={user.email}
								avatar=""
							/>
						</Card>
					}
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