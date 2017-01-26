import React from 'react';

import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

import VenueList from './venue-list.jsx';

const BLANK_VENUE =  { name: '', capacity: ''};
console.log("Blank: " + JSON.stringify(BLANK_VENUE));

class VenueForm extends React.Component {
	constructor(props) {
    	super(props);
    	this.app = props.feathers;
    	this.venueService = this.app.service('venues');
		this.state = {venue: BLANK_VENUE, venues: []};
		// console.log("INITIAL STATE: " + JSON.stringify(this.state));
		this.saveVenue = this.saveVenue.bind(this);
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
		this.venueService.find({
			query: {
				parent: { $exists: false},
				$sort: { createdAt: -1 },
				$limit: this.props.limit || 7
			}
		}).then(page => this.setState({
			venues: page.data,
			venue: page.data[0] || BLANK_VENUE
		}));
		// Listen to newly created messages
		this.venueService.on('created', venue => this.setState({
			venues: this.state.venues.concat(venue)
		}));
	};

	saveVenue = (ev) => {
		const v = this.state.venue;
		console.log('Saving ' + JSON.stringify(v));
		
		if(this.state.venue._id) {
			this.venueService.patch(this.state.venue._id, v)
			.then(() => console.log("Saviated " + JSON.stringify(v)))
			.catch(err => console.log("Errar: " + JSON.stringify(err)));
		} else {
			//create
			console.log("Createning..")
			this.venueService.create(v)
			.then(() => console.log("Created " + JSON.stringify(v)))
			.catch(err => console.log("Erroir: " + JSON.stringify(err)));
		}
		ev.preventDefault();
	};

	handleVenueSelection = (v) => {
		// console.log("Handling venue selection: " + JSON.stringify(v));
		this.setState({venue: v});
	}

	render() {
		return (
			<div>
				<Paper>
					<VenueList 
						onVenueSelected = {this.handleVenueSelection.bind(this)}
						venues={this.state.venues} />
				</Paper>
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