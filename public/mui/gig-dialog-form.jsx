import React from 'react'

import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'

import moment from 'moment'

import app from '../main.jsx'
import VenueSites from './venue-sites.jsx'
import styles from './styles'
import { gigDuration, focus } from './hacks.jsx'


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



export default class GigDialogForm extends React.Component {
	state = {
		gig: this.props.gig || blankGig(),
		venueName: (this.props.gig.venue && this.props.gig.venue.name) || '',
		dialogOpen: false,
	}

	handleChange = e => {
		// TODO: ensure end Date is after start Date
		// TODO: keep the time if the date changes
		
		const { name, value } = e.target
		const { gig } = this.state
		// console.log("Changed: " + name + " -> " + JSON.stringify(value))
		if( name.indexOf("Time") > -1 ) {
			//handle time changes
			const dateName = name.substr(0, name.indexOf("Time"))
			const date = this.state.gig[dateName]
			const hours = moment(value, 'HH:mm')
			const newDate = moment(date)
				.hours(hours.hours())
				.minutes(hours.minutes())
				.toDate()
			// console.log("Changing: " + dateName + " = " + (date) + "\n--> " + newDate)
			Object.assign(gig, {[dateName] : newDate})
		} else {
			Object.assign(gig, {[name] : value})
		}

		// this.validate(gig)
		this.setState({...this.state, gig})
		// console.log("State: " + JSON.stringify(this.state))
	}


	// TODO do validate
	// validate = (gig) => {
	// 	if(gig.start && gig.end && !moment(gig.start).isBefore(moment(gig.end))) {
	// 		console.log("WHAT are you thinking.")
	// 	}
	// 	// const v = new mongoose.Document(Gig, GigSchema)//
	// 	// console.log("Validificating: " + JSON.stringify(v))
	// }
	chooseVenue = () => {
		this.setState({...this.state, dialogOpen: true})
	}
	handleDialogSelect = venue => {
		console.log("Selected ", venue)
		const { gig } = this.state
		Object.assign(gig, {venue_id: venue._id})
		this.setState({...this.state, dialogOpen: false, venueName: venue.name, gig})
	}
	handleDialogCancel = e => {
		// console.log("Canceling...")
		this.setState({dialogOpen: false})
	}
	dialogActions = () => [
		<FlatButton
			label="Cancel"
			primary={true}
			onTouchTap={this.handleDialogCancel}
		/>,
	]

	render() {
		const {gig, duration, venueName} = this.state
		const {errors, venues} = this.props
		return (
			<form >
				<TextField 
					name='name'
					floatingLabelText="Name"
					value={gig.name || ''} 
					maxLength={30}
					onChange={this.handleChange} 
					errorText={(errors.name && errors.name.message) || ''}
					ref={focus}
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
						name='venue_id'
						floatingLabelText="Venue ID"
						value={venueName || gig.venue_id || ''} 
						errorText={(errors.venue_id && errors.venue_id.message) || ''}
					/>
					{' '}
					{venues && <FlatButton label="Choose venue" onTouchTap={this.chooseVenue}/>}
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
						style={styles.dateInput}
					/>
					<TextField 
						type='time'
						name='startTime'
						floatingLabelFixed={true}
						floatingLabelText="Start time"
						value={(gig.start && moment(gig.start).format('HH:mm')) || ''} 
						onChange={this.handleChange} 
						style={styles.timeInput}
					/>
					<TextField 
						name='duration'
						floatingLabelFixed={true}
						floatingLabelText="Duration"
						value={gigDuration(gig)} 
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
						style={styles.dateInput}
					/>
					<TextField 
						type='time'
						name='endTime'
						floatingLabelFixed={true}
						floatingLabelText="End time"
						value={(gig.end && moment(gig.end).format('HH:mm')) || ''} 
						onChange={this.handleChange} 
						style={styles.timeInput}
					/>
				</div>
				<Dialog
					title="Choose site"
					open={this.state.dialogOpen}
					actions={this.dialogActions()}
					onRequestClose={this.handleDialogCancel}
				>
					<VenueSites venues={venues} onSelect={this.handleDialogSelect}/>
				</Dialog>
			</form>
		)
	}
}