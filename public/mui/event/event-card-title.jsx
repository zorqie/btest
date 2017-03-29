import React from 'react'

import {CardTitle} from 'material-ui/Card'
import GigTimespan from '../gig-timespan.jsx'

export default class EventCardTitle extends React.Component {
	render() {
		const {event} = this.props
		const title = (<span><b>{event.name}</b> at <b>{event.venue && event.venue.name}</b></span>)

		const subtitle = <GigTimespan gig={event} showRelative={true}/>

		return <CardTitle 
					title={title} 
					subtitle={subtitle} 
			    />

	}
}