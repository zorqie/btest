import React from 'react';

import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

const BLANK_VENUE =  { name: '', capacity: '', type: '' };

export default class VenueDialogForm extends React.Component {
	constructor(props) {
    	super(props);
		this.state = {
			open: false,
			venue: props.venue || BLANK_VENUE
		};
		// console.log("Dialog venue: ", this.state.venue);
	}

	handleChange = (e) => {
		const { name, value } = e.target;
		// console.log("Changed: " + name + " -> " + JSON.stringify(value));
		let {venue} = this.state;
		Object.assign(venue, {[name] : value});
		this.validate(venue);
		this.setState({...this.state, venue});
		
	};
	validate = (venue) => {
		// const v = new mongoose.Document(venue, venueSchema);//
		// console.log("Validificating: " + JSON.stringify(v));
	};

	render() {
		const {venue} = this.state;
		// console.log("Dialog state: ", venue);
		return (
				<form onSubmit={this.props.handleSubmit}>
					<TextField 
						name='name'
						hintText='Name'
						floatingLabelText="Name"
						value={venue.name} 
						onChange={this.handleChange} 
					/>
					<TextField 
						name='type'
						hintText='Type'
						floatingLabelText="Type"
						value={venue.type} 
						onChange={this.handleChange} 
					/>
					<TextField 
						name='capacity'
						type='number' min='0'
						hintText='Capacity'
						floatingLabelText="Max capacity"
						value={venue.capacity} 
						onChange={this.handleChange} 
					/>
				</form>
		);
	}
};