import React from 'react'

import Paper from 'material-ui/Paper'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'

import { Link, browserHistory } from 'react-router'

import app from '../main.jsx'

class LoginForm extends React.Component {
	state = {
		email: "", 
		password: "", 
		errors: {}
	}
	
	handleChange = (e) => {
		const { name, value } = e.target
		this.setState({...this.state, [name] : value})
	}

	doLogin = (e) => {
		e.preventDefault()
		const { email, password } = this.state
		app.authenticate({
			type: 'local',
			email,
			password,
		})
		.then(() => {
			const user = app.get('user')
			app.service('users').patch(user._id, {online: true}).then(u => {
				app.emit('authenticated', user)
				browserHistory.push('/home')
				console.log("Login complete")
			})
		})
		.catch(error => {
			console.error("Errorated: ", error)
			this.setState({...this.state, errors: error})
		})
		
	}

	render() {
		const { email, password, errors } = this.state
		return (
			<Paper>
				<h2>Login</h2>
				<p>No account? Perhaps you can <Link to='/signup'>Sign up</Link></p>
				<form onSubmit={this.doLogin}>
					<div style={{visibility: errors.message ? 'visible' : 'hidden'}}>
						{errors.message}
					</div>
					<TextField 
						type='email'
						name='email'
						floatingLabelText="Email"
						value={email} 
						onChange={this.handleChange} 
					/>
					<TextField 
						type='password'
						name='password'
						floatingLabelText="Password"
						value={password} 
						onChange={this.handleChange} 
					/>
					<RaisedButton type='submit' label='Login' primary/>
				</form>
				
			</Paper>
		)
	}
}

export default LoginForm