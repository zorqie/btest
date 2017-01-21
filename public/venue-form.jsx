import React from 'react';
import { Button } from 'react-toolbox/components/button';
import { Input } from 'react-toolbox/components/input';

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
		var v = this.state.venue;
		Object.assign(v, {[name] : value});
		this.setState({venue: v});
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
		const v = this.state.venue;
		console.log('Saving ' + JSON.stringify(v));
		// Create a new message with the text from the input field
		if(this.state.venue._id) {
			this.venueService.patch(this.state.venue._id, v)
			.then(() => console.log("Saved " + JSON.stringify(v)))
			.catch(err => console.log("Errar: " + JSON.stringify(err)));
		} else {
			//create
		}
		ev.preventDefault();
	};

	render() {
		return (
			<form onSubmit={this.saveVenue}>
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
				<Button label='Save' onClick={this.saveVenue} primary={true}/>
			</form>
		);
	}
};

export default VenueForm;