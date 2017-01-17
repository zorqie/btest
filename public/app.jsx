import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import AppBar from 'material-ui/AppBar';
import Avatar from 'material-ui/Avatar';
import Divider from 'material-ui/Divider';
import {List, ListItem} from 'material-ui/List';
import Paper from 'material-ui/Paper';
import Subheader from 'material-ui/Subheader';
import TextField from 'material-ui/TextField';
import {grey600, darkBlack, lightBlack} from 'material-ui/styles/colors';

import React from 'react';
import ReactDOM from 'react-dom';

// touchy-screen stuff 
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

const feathers = require('feathers/client');
const auth = require('feathers-authentication/client');
const socketio = require('feathers-socketio/client');
const hooks = require('feathers-hooks');
const io = require('socket.io-client');

console.log("Happning now.");

// A placeholder image if the user does not have one
const PLACEHOLDER = 'https://placeimg.com/60/60/people';
// An anonymous user if the message does not have that information
const dummyUser = {
  avatar: PLACEHOLDER,
  email: 'Anonymous'
};

// Establish a Socket.io connection
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

const ComposeMessage = React.createClass({
	getInitialState() {
		return { text: '' };
	},

	updateText(ev) {
		this.setState({ text: ev.target.value });
	},

	sendMessage(ev) {
		// Get the messages service
		const messageService = app.service('messages');
		// Create a new message with the text from the input field
		messageService.create({
			text: this.state.text
		})
		.then(() => this.setState({ text: '' }));

		ev.preventDefault();
	},

	render() {
		return (
			<form className="ui form" onSubmit={this.sendMessage}>
				<div className="ui fluid action input">
					<TextField
						floatingLabelText="Message:"
						fullWidth={true}
						value={this.state.text} 
						onChange={this.updateText}
					/>
					<RaisedButton label='Send' onTouchTap={this.sendMessage}/>
				</div>
			</form>
		);
	}
});

const UserItem = function(props) {
	return (
		<ListItem  key={props.user._id}
				primaryText={props.user.name}
				secondaryText={props.user.email}
				leftAvatar={<Avatar src={PLACEHOLDER} size={30}/>}
		/>
	);
};
const UserList = React.createClass({
	logout() {
		app.logout().then(() => window.location.href = '/index.html');
	},

	render() {
		const users = this.props.users;

		return (
			<List>
				<Subheader>{users.length} users</Subheader>
				{users.map(user => <UserItem user={user} key={user._id} /> )}
			</List>
		);
	}
});

const MessageList = React.createClass({
	// Render a single message
	renderMessage(message) {
		const sender = message.sentBy || dummyUser;

		return (
			<ListItem key={message._id}
				leftAvatar={<Avatar src={sender.avatar || PLACEHOLDER} alt={sender.email} />}
				primaryText={
					<span>
						<span style={{color: darkBlack}}>{sender.email}</span>
						<span style={{color: grey600}}>
							{moment(message.createdAt).format('MMM Do, hh:mm:ss')}
						</span>
					</span>
				}
				secondaryText={message.text}
			/>
			
		);
	},

	render() {
		return (
			<Paper zDepth={2}>
				<List>
					{this.props.messages.map(this.renderMessage)}
				</List>
			</Paper>
		);
	}
});

const ChatApp = React.createClass({
	getInitialState() {
		return {
			users: [],
			messages: []
		};
	},

	componentDidUpdate: function() {
		// Whenever something happened, scroll to the bottom of the chat window
		// const node = document.getElementById('chat');
		// node.scrollTop = node.scrollHeight - node.clientHeight;
	},

	componentDidMount() {
		const userService = app.service('users');
		const messageService = app.service('messages');

		// Find all users initially
		userService.find().then(page => this.setState({ users: page.data }));
		// Listen to new users so we can show them in real-time
		userService.on('created', user => this.setState({
			users: this.state.users.concat(user)
		}));

		// Find the last 10 messages
		messageService.find({
			query: {
				$sort: { createdAt: -1 },
				$limit: this.props.limit || 10
			}
		}).then(page => this.setState({ messages: page.data.reverse() }));
		// Listen to newly created messages
		messageService.on('created', message => this.setState({
			messages: this.state.messages.concat(message)
		}));
	},

	render() {
		return (
			<div className="ui grid container">
				<AppBar title="Ze Chat" />
				<UserList users={this.state.users} className="five wide column"/>
				<Paper>
					<MessageList messages={this.state.messages} />
					<ComposeMessage />
				</Paper>
				<footer>
					<a href="#" className="ui negative basic button " onClick={this.logout}>
						Sign Out
					</a>
				</footer>
			</div>
		);
	}
});

app.authenticate().then(() => {
	ReactDOM.render(
		<MuiThemeProvider>
			
				

				 <ChatApp />

			
		</MuiThemeProvider>, document.getElementById("app"));
})
/*.catch(error => {
	if(error.code === 401) {
		window.location.href = '/login.html'
	}

	console.error(error);
})*/;