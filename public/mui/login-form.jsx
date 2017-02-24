import React from 'react';

import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

import { Link, browserHistory } from 'react-router';

import app from '../main.jsx';

class LoginForm extends React.Component {
	constructor(props) {
    	super(props);
		this.state = {email: "", password: ""};
	}

	handleChange = (e) => {
		const { name, value } = e.target;
		this.setState({...this.state, [name] : value});
	};

	// componentDidMount() {

	// };

	doLogin = (e) => {
		e.preventDefault();
		console.log("Attemptifying to login with state: ", this.state);
		const { email, password } = this.state;
		app.service('users').on('authenticated', u => console.log('\n---\n~~~\n--- STOP THE PRESSES: ', u));
		app.authenticate({
			type: 'local',
			email,
			password,
		})
		.then(() => {
			// const handler = this.props.onSuccess || this.props.route.onSuccess;
			// if(handler) {
			// 	handler();
			// }
			const user = app.get('user');
			app.service('users').patch(user._id, {online: true}).then(u => {
				app.emit('authenticated', user);
				app.service('users').emit('authenticated', user);
				browserHistory.push('/home');
				console.log("Login complete");
			});
		})
		.catch((error) => console.error("Errorated: ", error));
		
	};

	render() {
		return (
			<Paper>
				<h2>Llogin</h2>
				<p>No account? Perhaps you can <Link to='/signup'>Sign up</Link></p>
				<form onSubmit={this.doLogin}>
					<TextField 
						type='email'
						name='email'
						hintText='Email'
						floatingLabelText="Email"
						value={this.state.email} 
						onChange={this.handleChange} 
					/>
					<TextField 
						type='password'
						name='password'
						hintText='Password'
						floatingLabelText="Password"
						value={this.state.password} 
						onChange={this.handleChange} 
					/>
					<RaisedButton type='submit' label='Login' onTouchTap={this.doLogin} primary/>
				</form>
				
			</Paper>
		);
	}
};

export default LoginForm;