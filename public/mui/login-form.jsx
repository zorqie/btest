import React from 'react';

import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

import { Link, browserHistory } from 'react-router';

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
		console.log("Attemptifying to login...");
		console.log("In state: ", this.state);
		const { email, password } = this.state;
		const app = this.props.feathers || this.props.route.feathers;
		app.authenticate({
			type: 'local',
			email,
			password,
		})
		.then(() => {
			browserHistory.push('/home');
			const handler = this.props.onSuccess || this.props.route.onSuccess;
			if(handler) {
				handler();
			}
			console.log("Loginized");
		})
		.catch((error) => console.error("Errorated: ", error));
		
	};

	render() {
		return (
			<Paper>
				<h2>Laag in</h2>			
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
				<p>No account? Perhaps you can <Link to='/signup'>Sign up</Link></p>
			</Paper>
		);
	}
};

export default LoginForm;