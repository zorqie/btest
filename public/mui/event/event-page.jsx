import React from 'react'
import { browserHistory } from 'react-router'

import app from '../../main.jsx'
import EventCardTitle from './event-card-title.jsx'
import EventGigsList from './event-gigs-list.jsx'
import EventSchedule from '../event-schedule.jsx'
import EventToolbar from './event-toolbar.jsx'

export default class EventPage extends React.Component{
	state = {
		event: {},
		gigs: [],
		types: [],
	}
	selectType = (mode='event', type) => {
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
		})
		.catch(err => console.error("ERAR: ", err))
	}


	removedListener = gig => {
		// console.log("Removed: ", gig)
		const {gigs} = this.state
		this.setState({
			...this.state, 
			gigs: gigs.filter(g => g._id !== gig._id),
		})
	}
	createdListener = gig => {
		// console.log("Added: ", gig)
		const {gigs} = this.state
		this.setState({
			...this.state, 
			gigs: gigs.concat(gig),
		})
	}

	patchedListener = gig => {
		// console.log("Updated: ", gig)
		// do something to reflect update
		const {gigs} = this.state
		this.setState({
			...this.state, 
			gigs: gigs.filter(g => g._id !== gig._id).concat(gig), //remove+add ?
		})
	}

	render() {
		const {eventId, type} = this.props.params
		const mode = this.props.params.mode || 'List'
		const {event, gigs, types} = this.state
		return <div>
			<EventCardTitle event={event} />
			<EventToolbar eventId={eventId} selected={type} types={types} onSelect={this.selectType}/>
			{mode==='List'  ? <EventGigsList event={event} gigs={gigs} type={type} />
							: <EventSchedule params={{eventId, type}} />
			}
		</div>
	}
}