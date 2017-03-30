import React from 'react'
import { browserHistory } from 'react-router'

import RaisedButton from 'material-ui/RaisedButton'

import app from '../../main.jsx'
import EventCardTitle from './event-card-title.jsx'
import EventGigsList from './event-gigs-list.jsx'
import EventStrategyDialog from './event-strategy.jsx'
import EventInfoDialog from './event-info.jsx'
import EventToolbar from './event-toolbar.jsx'

import EventSchedule from '../event-schedule.jsx'
import GigDialog from '../gig/gig-dialog.jsx'

import {plusOutline} from '../icons.jsx'

const startTimeSort = (a, b) => +(a.start > b.start) || +(a.start === b.start) - 1


export default class EventPage extends React.Component{
	state = {
		event: {},
		gigs: [],
		types: [],
		gigDialog: {open: false, gig: {}},
		rulesDialog: {open: false},
		infoDialog: {open: false},
	}
	selectView = (mode='event', type) => {
		const {eventId} = this.props.params
		browserHistory.push(`/${mode}/${eventId}/${type}`)
	}

	componentWillMount() {
		this.fetchData()
	}

	componentDidMount() {
		app.service('gigs').on('removed', this.removedListener)
		app.service('gigs').on('created', this.createdListener)
		app.service('gigs').on('patched', this.patchedListener)
	}
	componentWillUnmount() {
		if(app) {
			app.service('gigs').removeListener('removed', this.removedListener)
			app.service('gigs').removeListener('created', this.createdListener)
			app.service('gigs').removeListener('patched', this.patchedListener)
		}
	}

	fetchData = () => {
		const {eventId} = this.props.params

		app.service('gigs').get(eventId)
		.then(event => {
			app.emit('gig.root', event)
			app.service('gigs').find({
				query: {
					parent: eventId,
					$sort: { start: 1 },
					// $limit: this.props.limit || 7
				}
			})
			.then(page => {
				// console.log("Got result: ", page)
				const gigs = page.data
				const types = gigs.map(g => g.type).filter((e, i, a) => a.indexOf(e)===i)
				this.setState({event, gigs, types })
			})
			.then(() => app.service('venues').find({
				query: {
					parent: event.venue_id
				}
			}))
			.then(page => this.setState({venues: page.data}))
		})
		.catch(err => console.error("ERAR: ", err))
	}


	removedListener = gig => {
		// console.log("Removed: ", gig)
		const {gigs} = this.state
		this.setState({
			gigs: gigs.filter(g => g._id !== gig._id).sort(startTimeSort)
		})
	}
	createdListener = gig => {
		// console.log("Added: ", gig)
		const {gigs} = this.state
		this.setState({
			gigs: gigs.concat(gig).sort(startTimeSort)
		})
	}

	patchedListener = gig => {
		// console.log("Updated: ", gig)
		// do something to reflect update
		if(gig._id === this.state.event._id) {
			// so far only public is editable 
			// otherwise we lose venue
			this.setState({
				event: Object.assign(this.state.event, {public: gig.public})
			})
		} else {
			const {gigs} = this.state
			this.setState({
				gigs: gigs.filter(g => g._id !== gig._id).concat(gig).sort(startTimeSort) //remove+add ?
			})
		}
	}

	viewGig = gig => this.setState({gigDialog: {open: true, gig}})
	closeGigDialog = () => this.setState({gigDialog: {open: false, gig: {}}})
	saveGig = () => {
		const {gig} = this.state.gigDialog
		// console.log("Submitting...", gig)
		if(!gig.venue_id) { //mutating ?!?!?!
			gig.venue_id = this.state.event.venue_id
		}
		Promise.resolve( gig._id 
			? app.service('gigs').patch(gig._id, gig)
			: app.service('gigs').create(gig))
		.then(() => this.setState({gigDialog: {open: false, gig: {}}}))
		.catch(err => this.setState({gigDialog: {open: true, errors: err.errors, gig}}))
		// if(gig._id) {
		// 	app.service('gigs').patch(gig._id, gig)
		// 	// .then(gig => console.log("Updated gig", gig)) // this is handled in patchedListener
		// 	.catch(err => {
		// 		console.error("Didn't update", err)
		// 		this.setState({gigDialog: {open: true, errors: err.errors, gig}})
		// 	})
		// } else {
		// 	app.service('gigs').create(gig)
		// 	// .then(gig => console.log("Created gig", gig)) // handled in createdListener
		// 	.catch(err => {
		// 		console.error("Didn't create gig", JSON.stringify(err))
		// 		this.setState({gigDialog: {open: true, errors: err.errors, gig}})
		// 	})
		// }
		
	}

	viewStrategy = open => this.setState({rulesDialog: {open}})
	viewInfo = open => this.setState({infoDialog: {open}})

	actions = [
		<RaisedButton style={{margin:'10px 0'}} key='addActivity' primary={true} icon={plusOutline} label='Add Activity' onTouchTap={this.viewGig.bind(this, {})} />,
		<RaisedButton key='viewRules' primary={true} label='View rules' onTouchTap={this.viewStrategy.bind(this, true)} />,
		<RaisedButton style={{margin:'10px 0'}} key='viewInfo' primary={true} label='View info' onTouchTap={this.viewInfo.bind(this, true)} />,
	]

	render() {
		const {eventId, type} = this.props.params
		const mode = this.props.params.mode || 'List'
		const {event, gigs, types, venues, gigDialog, rulesDialog, infoDialog} = this.state
		 
		return <div>
			<EventCardTitle event={event} />
			<EventToolbar 
				eventId={eventId} 
				selectedType={type} 
				types={types} 
				onSelectView={this.selectView}
				actions={this.actions}
			/>
			{mode==='List'  ? <EventGigsList 
								event={event} 
								gigs={gigs} 
								type={type} 
								onSelect={this.viewGig}
								/>
							: <EventSchedule 
								params={{eventId, type}} 
								/>
			}
			<EventStrategyDialog open={rulesDialog.open} event={event} onClose={this.viewStrategy.bind(this, false)} />
			<EventInfoDialog open={infoDialog.open} event={event} onClose={this.viewInfo.bind(this, false)} />
			<GigDialog {...gigDialog} venues={venues} onSubmit={this.saveGig} onClose={this.closeGigDialog} />
		</div>
	}
}