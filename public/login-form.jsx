import React from 'react';

import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

import { Link, browserHistory } from 'react-router';
class LoginForm extends React.Component {
	constructor(props) {
    	super(props);
    	this.app = props.feathers;
		this.state = {email: "", password: ""};
	}

	handleChange = (e) => {
		const { name, value } = e.target;
		console.log("Changed: " + name + " -> " + JSON.stringify(value));
		this.setState({...this.state, [name] : value});
	};

	// componentDidMount() {

	// };

	doLogin = (ev) => {
		console.log("Attemptifying to login...");
		console.log("In state: " + JSON.stringify(this.state));
		this.app.authenticate({
			type: 'local',
			email: this.state.email,
			password: this.state.password
		})
			.then(() => {browserHistory.push('/');console.log("Loginized");})
			.catch((error) => console.log("Errorated."));
		ev.preventDefault();
	};

	render() {
		return (
			<Paper>
				<h2>Lag in</h2>			
				<form onSubmit={this.doLogin}>
					<TextField 
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
					<RaisedButton label='Login' onClick={this.doLogin} primary/>
				</form>
				<Link to='/signup'>Sign up</Link>
			</Paper>
		);
	}
};

export default LoginForm;