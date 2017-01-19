import React from 'react';
import { Button } from 'react-toolbox/lib/button';
import Input from 'react-toolbox/lib/input';

const BLANK_VENUE = { name: '', capacity: ''};

class VenueForm extends React.Component {
	constructor(props) {
    	super(props);
    	this.app = props.feathers;
    	this.venueService = this.app.service('venues');
		this.state = {venue: BLANK_VENUE};
		console.log("INITIAL STATE: " + JSON.stringify(this.state));
		this.saveVenue = this.saveVenue.bind(this);
	}

	handleChange = (name, value) => {
		this.setState({venue: {[name]: value}});
		console.log("State: " + JSON.stringify(this.state));
	};

	componentDidMount() {
		this.venueService.find({
			query: {
				$sort: { createdAt: -1 },
				$limit: this.props.limit || 1
			}
		}).then(page => this.setState({venue: page.data[0] || BLANK_VENUE}));
		// Listen to newly created messages
		// venueService.on('created', message => this.setState({
		// 	messages: this.state.messages.concat(message)
		// }));
	};

	saveVenue = (ev) => {
		console.log('Saving ' + JSON.stringify(this.state.venue));
		// Create a new message with the text from the input field
		this.venueService.create(this.state.venue)
		.then(() => console.log("Saved."))
		.catch(err => console.log(err));

		ev.preventDefault();
	};

	render() {
		return (
			<form className="" onSubmit={this.saveVenue}>
				<Input type='text'
					name='name'
					label="Name"
					value={this.state.venue.name} 
					onChange={this.handleChange.bind(this, 'name')} 
				/>
				<Input type='text'
					name='capacity'
					label="Max capacity"
					value={this.state.venue.capacity} 
					onChange={this.handleChange.bind(this, 'capacity')} 
				/>
				<Button label='Save' onClick={this.saveVenue}/>
			</form>
		);
	}
};

export default VenueForm;