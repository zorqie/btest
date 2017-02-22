import React from 'react';

import { Link, browserHistory } from 'react-router';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import FlatButton from 'material-ui/FlatButton'
import MenuItem from 'material-ui/MenuItem';

import app from '../main.jsx';

export default class Layout extends React.Component {
	constructor(props) {
		super(props);
		this.state = { drawerOpen: false, user: app.get('user'), section: 'BFest' };

		// console.log("Layout constructed: ", this.state);

		this.sections = [
			{ text: "Venues", path: "/venues"},
			{ text: "Events", path: "/gigs"},
			{ text: "Users", path: "/users"},
		]
		window.layout = this; // FIXME REMOVE!
	}
	componentDidMount() {
		app.authenticate().then(this.handleLogin);
		app.on('authenticated', this.handleLogin);
	}
	componentWillUnmount() {
		if(app) {
			app.removeListener('authenticated', this.handleLogin);
		}
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
		this.setState({user: null});
		app.logout();
		browserHistory.push('/out');
	}
	handleLogin = () => {
		console.log("-=-=- AUTHENTICATED (EVENT)-=-=-");
		this.setState({user: app.get('user')});
	}
	handleDrawer = (open, reason) => {
		console.log(`Open: ${open} for ${reason}`);
		this.setState({...this.state, drawerOpen: open})
	}
	render() { 
		console.log("------------ LAYOUT ------------");
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
					onRequestChange={this.handleDrawer}
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