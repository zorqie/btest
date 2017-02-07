import React from 'react';

import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

export default class SignupForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			email: "",
			name: "",
			password: "",
			password2: "",
		}
	}
	handleChange = (e) => {
		const { name, value } = e.target;
		this.setState({...this.state, [name] : value});
	}
	render() {
		return (
			<Paper>
				<h2>Signup</h2>
				<form method="post" action="/signup">
					<TextField
						type="email" 
						name='email'
						hintText='Where you at'
						floatingLabelText="E-mail"
						value={this.state.email} 
						onChange={this.handleChange}
					/>
					<TextField 
						name='name'
						hintText='What you wish to be called'
						floatingLabelText="Name"
						value={this.state.name} 
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
					<TextField 
						type='password'
						name='password'
						hintText='Password'
						floatingLabelText="Password"
						value={this.state.password2} 
						onChange={this.handleChange} 
					/>
					<RaisedButton label='Signup' primary/>
				</form>
			</Paper>
		)
	}
}