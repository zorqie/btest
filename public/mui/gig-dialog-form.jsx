import React from 'react';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Snackbar from 'material-ui/Snackbar';

import moment from 'moment';

import app from '../main.jsx';
import VenueSites from './venue-sites.jsx';

const blankGig = () => {
	return { 
		name: '', 
		description: '', 
		venue: '',
		act: '',
		type: '', 
		start: new Date(), 
		end: new Date()
	}
};

export default class GigDialogForm extends React.Component {
	constructor(props) {
    	super(props);
		this.state = {
			gig: props.gig || blankGig(),
			dialogOpen: false,
		};
	}

	handleChange = (e) => {
		// TODO: ensure end Date is after start Date

		const { name, value } = e.target;
		const { gig } = this.state;
		// console.log("Changed: " + name + " -> " + JSON.stringify(value));
		if( name.indexOf("Time") > -1 ) {
			//handle time changes
			const dateName = name.substr(0, name.indexOf("Time"));
			const date = this.state.gig[dateName];
			const hours = moment(value, 'HH:mm');
			const newDate = moment(date)
				.hours(hours.hours())
				.minutes(hours.minutes())
				.toDate();
			// console.log("Changing: " + dateName + " = " + (date) + "\n--> " + newDate);
			Object.assign(gig, {[dateName] : newDate});
		} else {
			Object.assign(gig, {[name] : value});
		}
		// this.validate(gig);
		this.setState({...this.state, gig });
		// console.log("State: " + JSON.stringify(this.state));
	};
	// TODO do validate
	// validate = (gig) => {
	// 	if(gig.start && gig.end && !moment(gig.start).isBefore(moment(gig.end))) {
	// 		console.log("WHAT are you thinking.")
	// 	}
	// 	// const v = new mongoose.Document(Gig, GigSchema);//
	// 	// console.log("Validificating: " + JSON.stringify(v));
	// };
	chooseVenue = () => {
		this.setState({...this.state, dialogOpen: true});
	}
	handleDialogSelect = venue => {
		console.log("Selected ", venue);
		const { gig } = this.state;
		Object.assign(gig, {venue: venue._id});
		this.setState({...this.state, dialogOpen: false, gig})
	}
	handleDialogCancel = (e) => {
		// console.log("Canceling...");
		this.setState({dialogOpen: false})
	}
	dialogActions = () => [
		<FlatButton
			label="Cancel"
			primary={true}
			onTouchTap={this.handleDialogCancel}
		/>,
	];

	render() {
		const {gig} = this.state;
		const {errors} = this.props;
		return (
			<form onSubmit={this.saveGig}>
				<TextField 
					name='name'
					floatingLabelText="Name"
					value={gig.name || ''} 
					maxLength={30}
					onChange={this.handleChange} 
					errorText={(errors.name && errors.name.message) || ''}
				/>
				<TextField 
					name='description'
					floatingLabelText="Short description"
					value={gig.description || ''} 
					fullWidth={true}
					maxLength={60}
					onChange={this.handleChange} 
				/>
				<TextField 
					name='type'
					floatingLabelText="Type"
					value={gig.type || ''} 
					onChange={this.handleChange} 
					errorText={(errors.type && errors.type.message) || ''}
				/>
				<div>
					<TextField 
						name='venue'
						hintText='Venue'
						floatingLabelText="Venue"
						value={gig.venue || ''} 
						onChange={this.handleChange} 
						errorText={(errors.venue && errors.venue.message) || ''}
					/>
					<RaisedButton label="Choose" onTouchTap={this.chooseVenue}/>
				</div>
				<div>
					<TextField 
						type='date'
						name='start'
						floatingLabelFixed={true}
						floatingLabelText="Start date"
						value={(gig.start && moment(gig.start).format('YYYY-MM-DD')) || ''} 
						errorText={(errors.start && errors.start.message) || ''}
						onChange={this.handleChange} 
					/>
					<TextField 
						type='time'
						name='startTime'
						floatingLabelFixed={true}
						floatingLabelText="Start time"
						value={(gig.start && moment(gig.start).format('HH:mm')) || ''} 
						onChange={this.handleChange} 
					/>
				</div>
				<div>
					<TextField 
						type='date'
						name='end'
						floatingLabelFixed={true}
						floatingLabelText="End date"
						value={(gig.end && moment(gig.end).format('YYYY-MM-DD')) || ''} 
						errorText={(errors.end && errors.end.message) || ''}
						onChange={this.handleChange} 
					/>
					<TextField 
						type='time'
						name='endTime'
						floatingLabelFixed={true}
						floatingLabelText="End time"
						value={(gig.end && moment(gig.end).format('HH:mm')) || ''} 
						onChange={this.handleChange} 
					/>
				</div>
				<Dialog
					title="Choose site"
					open={this.state.dialogOpen}
					actions={this.dialogActions()}
					onRequestClose={this.handleDialogCancel}
				>
					<VenueSites venues={this.props.venues} onSelect={this.handleDialogSelect}/>
				</Dialog>
			</form>
		);
	}
};