import React from 'react';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

import moment from 'moment';

import app from '../../main.jsx';

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
}

const focus = input => input && input.focus();

export default class ShiftDialog extends React.Component {
	state = {
		gig: this.props.shift || blankGig(),
	}
	componentWillReceiveProps(nextProps) {
		this.setState({gig: nextProps.shift})
	}
	handleChange = e => {
		// TODO: ensure end is after start
		// TODO: keep the time if the date changes
		
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
	}
	
	dialogActions = [
		<FlatButton
			label="Cancel"
			primary={true}
			onTouchTap={this.props.onCancel}
		/>,
		<RaisedButton
			label="Save"
			primary={true}
			onTouchTap={this.props.onSubmit}
		/>,
	]

	render() {
		// console.log("Props", this.props)
		const { gig } = this.state;
		const {errors, open} = this.props;
		return (
			<Dialog 
				title={(gig._id ? '' : 'Add ') + gig.type + ' shift'}
				open={open}
				actions={this.dialogActions}
				onRequestClose={this.props.onCancel}
			>
				<form >
					<div>
						<TextField 
							name='name'
							floatingLabelText="Name"
							value={gig.name || ''} 
							maxLength={30}
						/>
						<TextField 
							name='venue'
							floatingLabelText="Location"
							value={(gig.venue && gig.venue.name) || ''} 
						/>
					</div>
					<TextField 
						name='description'
						floatingLabelText="Short description"
						value={gig.description || ''} 
						fullWidth={true}
						maxLength={60}
						onChange={this.handleChange} 
					/>
					<div>
						<TextField 
							type='date'
							name='start'
							floatingLabelFixed={true}
							floatingLabelText="Start date"
							value={(gig.start && moment(gig.start).format('YYYY-MM-DD')) || ''} 
							errorText={(errors.start && errors.start.message) || ''}
							onChange={this.handleChange} 
							ref={focus}
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
				</form>
			</Dialog>
		)
	}
}