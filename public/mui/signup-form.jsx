import React from 'react';

import { browserHistory } from 'react-router';

import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

import app from '../main.jsx';

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
	handleSubmit = (e) => {
		console.log("CREATING USER >>>>>>>>>>>>", this.state);
		e.preventDefault();
		const {email, name, password} = this.state;
		app.service('users').create({
			email,
			password,
			name,
		})
		.then(user => browserHistory.push('/login'))
		.catch(err => console.error("Error signing up: ", JSON.stringify(err)));
	}
	render() {
		return (
			<Paper>
				<h2>Signup</h2>
				<form method="post" action="/signup" onSubmit={this.handleSubmit}>
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
						name='password2'
						hintText='Confirm password'
						floatingLabelText="Confirm password"
						value={this.state.password2} 
						onChange={this.handleChange} 
					/>
					<RaisedButton type='submit' label='Signup' primary onTouchTap={this.handleSubmit}/>
				</form>
			</Paper>
		)
	}
}
