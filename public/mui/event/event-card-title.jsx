import React from 'react'

import {CardHeader} from 'material-ui/Card'
import IconButton from 'material-ui/IconButton'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem';

import ActionLockIcon from 'material-ui/svg-icons/action/lock'
import ActionLockOpenIcon from 'material-ui/svg-icons/action/lock-open'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'

import app from '../../main.jsx'
import GigTimespan from '../gig-timespan.jsx'

const moreButton = <IconButton touch={true} >
					<MoreVertIcon />
				 </IconButton>

// TODO move to hacks
const publish = gig => {
	app.authenticate().then(() => 
		app.service('gigs').patch(gig._id, {public: !gig.public}))
}


export default class EventCardTitle extends React.Component {
	render() {
		const {event} = this.props
		const title = <span style={{fontSize:'24pt'}}>
			<b>{event.name}</b> at <b>{event.venue && event.venue.name}</b>
			
		</span>

		const subtitle = <GigTimespan gig={event} showRelative={true}/>

		return <CardHeader 
					avatar={event.public ? <ActionLockOpenIcon /> : <ActionLockIcon />}
					title={title} 
					subtitle={subtitle} 
			    >
			    <IconMenu iconButtonElement={moreButton} style={{float:'right'}}>
					<MenuItem primaryText="Add poster" />
					<MenuItem primaryText={event.public ? 'Make private' : 'Publish'} onTouchTap={publish.bind(null, event)} />
				</IconMenu>
				</CardHeader>
	}
}