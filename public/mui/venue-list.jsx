import React from 'react';
import { browserHistory } from 'react-router';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import IconButton from 'material-ui/IconButton';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';

import {addIcon} from './icons.jsx';

function VenueItem({venue, onSelect, onEdit}) {
	return <ListItem 
			onTouchTap={onSelect}
			primaryText={venue.name} 
			secondaryText={'Capacity: ' + venue.capacity}
			rightIconButton={onEdit && 
				<IconButton 
					iconClassName="material-icons" 
					tooltip="Edit" 
					onTouchTap={onEdit}>edit</IconButton>
			}
		/>	
}

export default function VenueList({venues, onSelect, onEdit}) {	
	return <List>
			{venues.map(v => 
				<VenueItem 
					onSelect={onSelect.bind(null, v)} 
					onEdit={onEdit.bind(null, v)} 
					venue={v} 
					key={v._id}
				/>)
			}
			<FloatingActionButton 
				secondary={true} 
				onClick={onEdit.bind(null, {name:"", description: "", capacity:""})}
			>
				{addIcon}
			</FloatingActionButton>
		</List>

}

