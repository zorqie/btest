import React from 'react';
import { browserHistory } from 'react-router';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

import VenueList from './venue-list.jsx';
import app from '../main.jsx';
import errorHandler from './err';

const BLANK_VENUE =  { name: '', description: '', capacity: ''};

class VenueForm extends React.Component {
	state = {
		venue: BLANK_VENUE, 
		venues: [], 
		errors: {},
		dialog: false
	}
	
	componentDidMount() {
		app.service('venues').find({
			query: {
				parent: { $exists: false},
				$sort: { createdAt: -1 },
				$limit: this.props.limit || 37
			}
		})
		.then(page => this.setState({
			venues: page.data
		}))
		.catch(errorHandler);
		// Listen to newly created venues
		app.service('venues').on('created', this.createdListener);
		app.service('venues').on('removed', this.removedListener);
	}

	componentWillUnmount() {
		if(app) {
			app.service('venues').removeListener('created', this.createdListener);
			app.service('venues').removeListener('removed', this.removedListener);
		}
	}

	handleChange = (e) => {
		const { name, value } = e.target;
		var v = this.state.venue;
		Object.assign(v, {[name] : value});
		this.validate(v);
		this.setState({venue: v});
	}
	validate = venue => {
		// const v = new mongoose.Document(venue, venueSchema);//
		// console.log("Validificating: " + JSON.stringify(v));
	}
	createdListener = venue => this.setState({
		venues: this.state.venues.concat(venue)
	})
	removedListener = venue => this.setState({
		venues: this.state.venues.filter(v => v._id!==venue._is)
	})
	saveVenue = e => {
		e.preventDefault();
		const {venue} = this.state;
		console.log('Saving venue', venue);
		
		if(venue._id) {
			app.service('venues').patch(venue._id, venue)
			.then(() => {
				this.setState({...this.state, dialog: false, errors: {}});
			})
			.catch(err => {
				console.log("Errar: " + JSON.stringify(err))
				this.setState({...this.state, errors: err.errors})
			});
		} else {
			//create
			app.service('venues').create(venue)
			.then(() => {
				this.setState({...this.state, dialog: false, errors: {}})
			})
			.catch(err => {
				// FIXME check for error type
				console.log("Erroir: " + JSON.stringify(err))
				this.setState({...this.state, errors: err.errors})
			});
		}
	}

	handleVenueSelect = venue => {
		// console.log("Handling venue selection: " + JSON.stringify(v));
		browserHistory.push('venues/' + venue._id)
	}

	handleVenueEdit = venue => {
		this.setState({...this.state, dialog: true, venue})
	}

	handleDialogCancel = () => {
		this.setState({...this.state, dialog: false, errors: {}})
	}

	focus = input => this.nameInput = input;



	render() {
		const { venue, errors } = this.state;
		return (
			<div>
				<VenueList 
					onSelect={this.handleVenueSelect}
					onEdit={this.handleVenueEdit}
					venues={this.state.venues} 
				/>
				<Dialog
					title={venue._id ? null : 'Add new venue'}
					open={this.state.dialog}
					onRequestClose={this.handleDialogCancel}
					actions={[
						<FlatButton label='Cancel' onTouchTap={this.handleDialogCancel} />,
						<RaisedButton label={venue._id ? 'Save' : 'Add'} onTouchTap={this.saveVenue} primary/>
					]}
				>
					<form onSubmit={this.saveVenue}>
						<TextField 
							name='name'
							floatingLabelText="Venue name"
							value={venue.name} 
							maxLength='30'
							onChange={this.handleChange} 
							errorText={(errors.name && errors.name.message) || ''}
							ref={this.focus}
						/>
						<TextField 
							name='description'
							floatingLabelText="Venue description"
							fullWidth={true}
							maxLength='60'
							value={venue.description || ''} 
							onChange={this.handleChange} 
						/>
						<TextField 
							name='capacity'
							type='number' min='0'
							floatingLabelText="Max capacity"
							value={venue.capacity} 
							onChange={this.handleChange} 
							errorText={(errors.capacity && errors.capacity.message) || ''}
						/>
						
					</form>
				</Dialog>
			</div>
		);
	}
};

export default VenueForm;