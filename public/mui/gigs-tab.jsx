import React from 'react'
import { Link } from 'react-router'

import ActionDashboard from 'material-ui/svg-icons/action/dashboard';
import ContentAdd from 'material-ui/svg-icons/content/add';

import FlatButton from 'material-ui/FlatButton'
import FloatingActionButton from 'material-ui/FloatingActionButton';
import { ListItem } from 'material-ui/List'
import { Tab } from 'material-ui/Tabs'

import GigTimespan from './gig-timespan.jsx'
import { Kspan } from './hacks.jsx'

const Subgig = ({ gig, onSelect, onEdit, onDelete }) => <ListItem 
		primaryText={gig.name} 
		secondaryText={<GigTimespan gig={gig} />} 
		rightIconButton={<Kspan>
			<FlatButton label="Edit" onTouchTap={onEdit.bind(null, gig)}/>
			<FlatButton label="Delete" onTouchTap={onDelete.bind(null, gig)}/>
		</Kspan>}
		onTouchTap={onSelect.bind(null, gig)}
	/>

export default function GigsTab({event, type, gigs, ...others}) {

	return <Tab key={type || 'none'} label={type} >
				{gigs.filter(g => g.type===type)
					.map(gig => 
						<Subgig 
							key={gig._id} 
							gig={gig}
							{...others}
						/>
				)}
				{event && type && 
					<Link to={`/schedule/${event._id}/${type}`}>
						<FlatButton secondary={true} icon={<ActionDashboard />} label='Schedule' />
					</Link>
					|| ''
				}
			</Tab>
}