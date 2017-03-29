import React from 'react'
import { Link } from 'react-router'

import ActionDashboard from 'material-ui/svg-icons/action/dashboard';

import Avatar from 'material-ui/Avatar'
import FlatButton from 'material-ui/FlatButton'
import FloatingActionButton from 'material-ui/FloatingActionButton';
import { List, ListItem } from 'material-ui/List'
import { Tab } from 'material-ui/Tabs'
import ActionLockIcon from 'material-ui/svg-icons/action/lock'
import ActionLockOpenIcon from 'material-ui/svg-icons/action/lock-open'

import GigTimespan from '../gig-timespan.jsx'
import { Kspan } from '../hacks.jsx'

const Subgig = ({ gig, showAvatar, onSelect, onEdit, onDelete }) => 
	<ListItem 	
		primaryText={gig.name} 
		secondaryText={<GigTimespan gig={gig} />} 
		rightIconButton={<Kspan>
			{onEdit && <FlatButton label="Edit" onTouchTap={onEdit.bind(null, gig)}/>}
			{onDelete && <FlatButton label="Delete" onTouchTap={onDelete.bind(null, gig)}/>}
		</Kspan>}
		leftAvatar={showAvatar && <Avatar>{gig.type && gig.type.charAt(0)}</Avatar>}
		onTouchTap={onSelect && onSelect.bind(null, gig)}
	/>

export default function EventGigsList({event, type, gigs, ...others}) {

	return <List>
				{gigs.filter(g => type==='All' || g.type===type)
					.map(gig => 
						<Subgig 
							key={gig._id} 
							gig={gig}
							showAvatar={type==='All'}
							{...others}
						/>
				)}				
			</List>
}