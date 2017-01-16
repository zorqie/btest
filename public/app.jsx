// A placeholder image if the user does not have one
const PLACEHOLDER = 'https://placeimg.com/60/60/people';
// An anonymous user if the message does not have that information
const dummyUser = {
  avatar: PLACEHOLDER,
  email: 'Anonymous'
};

// Establish a Socket.io connection
const socket = io();
// Initialize our Feathers client application through Socket.io
// with hooks and authentication.
const app = feathers()
	.configure(feathers.socketio(socket))
	.configure(feathers.hooks())
	// Use localStorage to store our login token
	.configure(feathers.authentication({
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
					<input type="text" name="text" value={this.state.text} onChange={this.updateText} />
					<button className="ui primary button" type="submit">Send</button>
				</div>
			</form>
		);
	}
});

const UserItem = function(props) {
	return (
		<li className="item" key={props.user._id}>
			<div className="content">
				<img src={props.user.avatar || ''} className="avatar" />
				<span className="name">{props.user.name}</span>
				<span className="username">{props.user.email}</span>
			</div>
		</li>
	);
};
const UserList = React.createClass({
	logout() {
		app.logout().then(() => window.location.href = '/index.html');
	},

	render() {
		const users = this.props.users;

		return (
			<aside className={this.props.className}>
				<header className="header">
					<h4>
						<span className="">{users.length}</span> users
					</h4>
				</header>

				<ul className="ui relaxed divided list">
					{users.map(user => <UserItem user={user} key={user._id} /> )}
				</ul>
				<footer className="">
					<a href="#" className="ui negative basic button " onClick={this.logout}>
						Sign Out
					</a>
				</footer>
			</aside>
		);
	}
});

const MessageList = React.createClass({
	// Render a single message
	renderMessage(message) {
		const sender = message.sentBy || dummyUser;

		return (
			<div className="event" key={message._id}>
				<div className="label"><img src={sender.avatar || PLACEHOLDER} alt={sender.email} className="small image" /></div>
				<div className="content">
					<div className="summary">
						<span className="username">{sender.email}</span>
						<span className="date">
							{moment(message.createdAt).format('MMM Do, hh:mm:ss')}
						</span>
					</div>
					<p className="extra text">
						{message.text}
					</p>
				</div>
			</div>
		);
	},

	render() {
		return (
			<main id="chat" className="ui chat feed">
				{this.props.messages.map(this.renderMessage)}
			</main>
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
		const node = document.getElementById('chat');
		node.scrollTop = node.scrollHeight - node.clientHeight;
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
		return <div className="ui grid container">
				<UserList users={this.state.users} className="five wide column"/>
				<div className="nine wide column">
					<MessageList messages={this.state.messages} />
					<ComposeMessage />
				</div>
			</div>;
	}
});

app.authenticate().then(() => {
	ReactDOM.render(
		<div id="app" className="">
			<header className="ui header">
				<h1>
					<span className="title">Ze Chat</span>
				</h1>
			</header>

			<ChatApp />
		</div>, document.body);
}).catch(error => {
	if(error.code === 401) {
		window.location.href = '/login.html'
	}

	console.error(error);
});