import React from 'react'

import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';

const focus = input => input && input.focus()

export default class ActDialogForm extends React.Component {
	state={
		act: this.props.act  || {
									name: '',
									description: ''
								},
	}
	handleChange = (e) => {
		const { name, value } = e.target
		const act = Object.assign(this.state.act, {[name] : value})
		this.setState({...this.state, act})
		// console.log("State: " + JSON.stringify(this.state));
	}
	render() {
		const { act } = this.state
		const { errors } = this.props
		return <form>
			<TextField
				name='name'
				floatingLabelText='Act name'
				value={act.name || ''}
				onChange={this.handleChange}
				errorText={errors.name && errors.name.message}
				fullWidth={true}
				maxLength={30}
				ref={focus}
			/>
			<TextField
				name='description'
				floatingLabelText='Act description'
				value={act.description || ''}
				onChange={this.handleChange}
				fullWidth={true}
				maxLength={90}
			/>
		</form>
	}

}