import React from 'react';

import { Link, browserHistory } from 'react-router';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import AppBar from 'material-ui/AppBar';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import Drawer from 'material-ui/Drawer';
import FlatButton from 'material-ui/FlatButton'
import MenuItem from 'material-ui/MenuItem';
import Snackbar from 'material-ui/Snackbar';

import app from '../main.jsx';
import errorHandler from './err'

export default class Layout extends React.Component {
	constructor(props) {
		super(props);
		this.state = { 
			drawerOpen: false, 
			user: null, 
			section: 'BFest',
			snackbar: {
				open: false, 
				message: '', 
				undo: null,
			},
		};

		this.sections = [
			{ text: "Events", path: "/events"},
			{ text: "Acts", path: "/acts"},
			{ text: "Venues", path: "/venues"},
			{ text: "Users", path: "/users"},
		]
	}
	componentDidMount() {
		app.authenticate()
			.then(this.handleLogin())
			.catch(errorHandler);

		app.on('authenticated', this.handleLogin);
		app.on('notify', this.notifyListener);
	}
	componentWillUnmount() {
		if(app) {
			app.removeListener('authenticated', this.handleLogin);
			app.removeListener('notify', this.notifyListener);
		}
	}

	handleUserChange = u => {
		console.log("User loginified: ", u);
		this.setState({snackbarOpen: true, message: u.name + " just logged in"});
	}

	notifyListener = (message, undo) => {
		this.setState({...this.state, snackbar: {open: true, message, undo}})
	}
	handleSnackbarClose = () => this.setState({ snackbar: {open: false, message: '', undo: null}});

	closeDrawer = () => {
		this.setState({...this.state, drawerOpen: false})
	}
	toggleDrawer = () => {
		this.setState({...this.state, drawerOpen: !this.state.drawerOpen});
	}
	handleMenu = section => {
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
	handleLogin = u => {
		const user = app.get('user');
		if(user) {
			console.log("-=-=- AUTHENTICATED (app.user) -=-=-", user);
			this.setState({user});
		}
	}
	handleDrawer = (open, reason) => {
		// console.log(`Open: ${open} for ${reason}`);
		this.setState({...this.state, drawerOpen: open})
	}
	render() { 
		// console.log("------------ LAYOUT ------------");
		const {user, snackbar} = this.state;
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
					width={266}
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
				<Snackbar
					open={snackbar.open}
					message={snackbar.message}
					autoHideDuration={4000}
					action={snackbar.undo ? 'Undo' : null}
					onActionTouchTap={snackbar.undo}
					onRequestClose={this.handleSnackbarClose}
		        />
				<footer style={{position: 'fixed', bottom: 0, right: 0, fontSize: 'smaller', paddingRight:'1em'}}>
					© 2017 Intergalactic Balkan Festivals Unlimited
				</footer>
			</div>
		</MuiThemeProvider>
		)
	}
};