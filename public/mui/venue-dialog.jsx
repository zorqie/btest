import React from 'react';

import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

const BLANK_VENUE =  { name: '', capacity: ''};

class VenueDialog extends React.Component {
	constructor(props) {
    	super(props);
		this.state = {venue: BLANK_VENUE};
	}

	handleChange = (e) => {
		const { name, value } = e.target;
		// console.log("Changed: " + name + " -> " + JSON.stringify(value));
		var v = this.state.venue;
		Object.assign(v, {[name] : value});
		this.validate(v);
		this.setState({venue: v});
		// console.log("State: " + JSON.stringify(this.state));
	};
	validate = (venue) => {
		// const v = new mongoose.Document(venue, venueSchema);//
		// console.log("Validificating: " + JSON.stringify(v));
	};
	componentDidMount() {
		
	};

	render() {
		return (
			<div>
				<form onSubmit={this.saveVenue}>
					<TextField 
						name='name'
						hintText='Name'
						floatingLabelText="Name"
						value={this.state.venue.name} 
						onChange={this.handleChange} 
					/>
					<TextField 
						name='capacity'
						hintText='Capacity'
						floatingLabelText="Max capacity"
						value={this.state.venue.capacity} 
						onChange={this.handleChange} 
					/>
					<RaisedButton label='Save' onClick={this.saveVenue} primary/>
				</form>
				
			</div>
		);
	}
};

export default VenueForm;