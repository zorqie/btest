import React from 'react';

import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

import VenueList from './venue-list-compact.jsx';
import app from '../main.jsx';
import errorHandler from './err';

const BLANK_VENUE =  { name: '', capacity: ''};

class VenueForm extends React.Component {
	constructor(props) {
    	super(props);
		this.state = {venue: BLANK_VENUE, venues: [], errors: {}};
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
	createdListener = venue => this.setState({
		venues: this.state.venues.concat(venue)
	});
	removedListener = venue => this.setState({
		venues: this.state.venues.filter(v => v._id!==venue._is)
	});
	componentDidMount() {
		app.service('venues').find({
			query: {
				parent: { $exists: false},
				$sort: { createdAt: -1 },
				$limit: this.props.limit || 37
			}
		}).then(page => this.setState({
			venues: page.data,
			venue: page.data[0] || BLANK_VENUE
		}))
		.catch(errorHandler);
		// Listen to newly created venues
		app.service('venues').on('created', this.createdListener);
		app.service('venues').on('removed', this.removedListener);
	};
	componentWillUnmount() {
		if(app) {
			app.service('venues').removeListener('created', this.createdListener);
			app.service('venues').removeListener('removed', this.removedListener);
		}
	};
	saveVenue = (e) => {
		e.preventDefault();
		const {venue} = this.state;
		console.log('Saving venue', venue);
		
		if(venue._id) {
			app.service('venues').patch(venue._id, venue)
			.then(() => {
				console.log("Saviated venue.");
				this.setState({...this.state, errors: {}});
			})
			.catch(err => console.log("Errar: " + JSON.stringify(err)));
		} else {
			//create
			console.log("Createning..")
			app.service('venues').create(venue)
			.then(() => {
				console.log("Created venue");
				this.setState({...this.state, errors: {}});
			})
			.catch(err => {
				// FIXME check for error type
				console.log("Erroir: " + JSON.stringify(err));
				this.setState({...this.state, errors: err.errors});
			});
		}
	};

	handleVenueSelection = (venue) => {
		// console.log("Handling venue selection: " + JSON.stringify(v));
		this.setState({venue});
	}

	render() {
		const { venue, errors } = this.state;
		return (
			<div>
				<Paper>
					<VenueList 
						onVenueSelected = {this.handleVenueSelection}
						venues={this.state.venues} />
				</Paper>
				<form onSubmit={this.saveVenue}>
					<TextField 
						name='name'
						hintText='Name'
						floatingLabelText="Name"
						value={venue.name} 
						onChange={this.handleChange} 
						errorText={(errors.name && errors.name.message) || ''}
					/>
					<TextField 
						name='capacity'
						type='number' min='0'
						hintText='Capacity'
						floatingLabelText="Max capacity"
						value={venue.capacity} 
						onChange={this.handleChange} 
						errorText={(errors.capacity && errors.capacity.message) || ''}
					/>
					<RaisedButton label='Save' onClick={this.saveVenue} primary type='submit'/>
				</form>
				
			</div>
		);
	}
};

export default VenueForm;