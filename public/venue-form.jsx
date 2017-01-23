import React from 'react';
import { Button } from 'react-toolbox/components/button';
import { Input } from 'react-toolbox/lib/input';
import { ThemeProvider } from 'react-css-themr';
import { Layout, Panel } from 'react-toolbox/lib/layout';

import VenueList from './venue-list.jsx';

const BLANK_VENUE = { name: '', capacity: ''};

class VenueForm extends React.Component {
	constructor(props) {
    	super(props);
    	this.app = props.feathers;
    	this.venueService = this.app.service('venues');
		this.state = {venue: BLANK_VENUE, venues: []};
		// console.log("INITIAL STATE: " + JSON.stringify(this.state));
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
			<Layout>
				<Panel>
				<VenueList 
					onVenueSelected = {this.handleVenueSelection.bind(this)}
					venues={this.state.venues} />
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
					<Button label='Save' onClick={this.saveVenue} primary raised/>
				</form>
				</Panel>
			</Layout>
		);
	}
};

export default VenueForm;