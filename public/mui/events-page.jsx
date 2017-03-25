import React from 'react';

import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';

import moment from 'moment';

import app from '../main.jsx';
import errorHandler from './err';
import EventsList from './events-list.jsx';
import GigDialogForm from './gig-dialog-form.jsx';

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

export default class EventsPage extends React.Component {
	state = {
		gig: blankGig(), 
		dialogOpen: false, 
		message: '', 
		errors:{}
	}
	

	saveGig = e => {
		e.preventDefault();
		const { gig } = this.state;
		console.log('Saving gig: ', gig);
		
		if(gig._id) {
			app.service('gigs').patch(gig._id, gig)
			.then(() => {
				this.setState({...this.state, dialogOpen: false, errors: {}}); 
				// console.log("Saved gig: ", gig)
			})
			.catch(err => console.error("Error saving gig: ", err));
		} else {
			//create
			app.service('gigs').create(gig)
			.then(() => {
				this.setState({...this.state, dialogOpen: false, errors:{}}); 
				// console.log("Created gig: ", gig)
			})
			.catch(err => {
				console.error("Error creating gig: ", err);
				console.log("Errors: " + JSON.stringify(err));
				this.setState({
					...this.state, 
					dialogOpen: true, 
					message: 'Save failed. Fix errors first.',
					errors: err.errors
				});
			});
		}
	}

	dialogActions = () => ([
			<FlatButton
				label="Cancel"
				primary={true}
				onTouchTap={this.handleRequestClose}
			/>,
			<RaisedButton
				label={this.state.gig._id ? "Save" : "Add"}
				primary={true}
				onTouchTap={this.saveGig}
			/>,
		])

	handleEdit = gig => {
		app.service('venues').find({
			query: {
				parent: {$exists:false},
				$sort: { name: 1 },
				$limit: 370
			}
		}).then(result => this.setState({...this.state, venues: result.data}))
		this.setState({...this.state, errors: {}, dialogOpen: true, gig})
	}
	handleRequestClose = () => { this.setState({ dialogOpen:false }); }

	render() {
		const {gig, errors, venues} = this.state;
		return (
			<div>				
				<EventsList onEdit={this.handleEdit} />			
				<Dialog
					open={this.state.dialogOpen}
					title={gig._id ? null : 'Add event'}
					onRequestClose={this.handleRequestClose}
					actions={this.dialogActions()}
		        >	
		        	<GigDialogForm gig={gig} errors={errors} venues={venues} />
		        </Dialog>
			</div>
		)
	}
}