import React from 'react'
import TextField from 'material-ui/TextField';

const focus = input => this.nameInput = input;

export default class VenueDialogForm extends React.Component {
	state = {
		venue = this.props.venue
	}
	handleChange = e => {
		const { name, value } = e.target
		const venue = Object.assign(this.state.venue, {[name] : value})
		this.setState({...this.state, venue})
	}
	render() {
		const { venue } = this.state
		const { errors } = this.props
		return <form >
					<TextField 
						name='name'
						floatingLabelText="Venue name"
						value={venue.name || ''} 
						onChange={this.handleChange} 
						errorText={(errors.name && errors.name.message) || ''}
						ref={focus}
					/>
					<TextField 
						name='description'
						floatingLabelText="Venue description"
						value={venue.description || ''} 
						onChange={this.handleChange} 
					/>
					<TextField 
						name='capacity'
						type='number' min='0'
						floatingLabelText="Max capacity"
						value={venue.capacity || ''} 
						onChange={this.handleChange} 
						errorText={(errors.capacity && errors.capacity.message) || ''}
					/>
				</form>
	}
}