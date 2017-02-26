import React from 'react';

import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Snackbar from 'material-ui/Snackbar';

import moment from 'moment';

import app from '../main.jsx';
import errorHandler from './err';
import GigList from './gig-list.jsx';

const blankGig = () => {
	return { 
		name: '', 
		description: '', 
		venue: '',
		type: '', 
		start: new Date(), 
		end: new Date()
	}
};

class GigForm extends React.Component {
	constructor(props) {
    	super(props);
		this.state = {
			gig: blankGig(), 
			snackOpen: false, 
			message: '', 
			errors:{}
		};
	}

	handleChange = (e) => {
		// TODO: ensure end Date is after start Date

		const { name, value } = e.target;
		var gig = this.state.gig;
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
		this.validate(gig);
		this.setState({ gig });
		// console.log("State: " + JSON.stringify(this.state));
	};
	validate = (gig) => {
		// const v = new mongoose.Document(Gig, GigSchema);//
		// console.log("Validificating: " + JSON.stringify(v));
	};
	

	saveGig = (e) => {
		e.preventDefault();
		const { gig } = this.state;
		console.log('Saving gig: ', gig);
		
    	const service = app.service('gigs');

		if(gig._id) {
			service.patch(gig._id, gig)
			.then(() => {
				this.setState({...this.state, snackOpen: true, message: "Updated gig", errors: {}}); 
				console.log("Saved gig: ", gig)
			})
			.catch(err => console.error("Error saving gig: ", err));
		} else {
			//create
			service.create(gig)
			.then(() => {
				this.setState({...this.state, snackOpen: true, message: "Created gig", errors:{}}); 
				console.log("Created gig: ", gig)
			})
			.catch(err => {
				console.error("Error creating gig: ", err);
				console.log("Errors: " + JSON.stringify(err));
				this.setState({
					...this.state, 
					snackOpen: true, 
					message: 'Save failed. Fix errors first.',
					errors: err.errors
				});
			});
		}
	};

	handleGigSelection = (gig) => {
		this.setState({...this.state, errors:{}, gig});
	}
	handleRequestClose = () => { this.setState({ snackOpen:false }); }

	render() {
		const {gig, errors} = this.state;
		console.log("GIG-FORM________");
		return (
			<div>
				<Paper>
					<GigList onGigSelected = {this.handleGigSelection} />
				</Paper>
				<form onSubmit={this.saveGig}>
					<TextField 
						name='name'
						hintText='Name'
						floatingLabelText="Name"
						value={gig.name} 
						onChange={this.handleChange} 
					/>
					<TextField 
						name='description'
						hintText='Description'
						floatingLabelText="Gig description"
						value={gig.description} 
						onChange={this.handleChange} 
					/>
					<TextField 
						name='type'
						hintText='Gig type'
						floatingLabelText="Type"
						value={gig.type} 
						onChange={this.handleChange} 
						errorText={(errors.type && errors.type.message) || ''}
					/>
					<TextField 
						name='venue'
						hintText='Venue'
						floatingLabelText="Venue"
						value={gig.venue || ''} 
						onChange={this.handleChange} 
						errorText={(errors.venue && errors.venue.message) || ''}
					/>
					<div>
						<TextField 
							type='date'
							name='start'
							hintText='Gig start'
							floatingLabelText="Start"
							value={moment(gig.start).format('YYYY-MM-DD')} 
							onChange={this.handleChange} 
						/>
						<TextField 
							type='time'
							name='startTime'
							floatingLabelFixed={true}
							floatingLabelText="Start time"
							value={moment(gig.start).format('HH:mm')} 
							onChange={this.handleChange} 
						/>
					</div>
					<div>
						<TextField 
							type='date'
							name='end'
							hintText='Gig end'
							floatingLabelText="End"
							value={moment(gig.end).format('YYYY-MM-DD')} 
							onChange={this.handleChange} 
						/>
						<TextField 
							type='time'
							name='endTime'
							floatingLabelFixed={true}
							floatingLabelText="Start time"
							value={moment(gig.end).format('HH:mm')} 
							onChange={this.handleChange} 
						/>
					</div>
					
					<RaisedButton type='submit' label={gig._id ? 'Save' : 'Add'} onClick={this.saveGig} primary/>
				</form>
				<Snackbar
					open={this.state.snackOpen}
					message={this.state.message}
					autoHideDuration={4000}
					onRequestClose={this.handleRequestClose}
		        />
			</div>
		);
	}
};

export default GigForm;