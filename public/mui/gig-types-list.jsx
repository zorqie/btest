import React from 'react'

import ContentAdd from 'material-ui/svg-icons/content/add'
import {List, ListItem} from 'material-ui/List'
import Subheader from 'material-ui/Subheader'

const types = [
	{ 
		name: "Performance", 
		description: "Activity has performer(s) and anyone can attend"
	},
	{ 
		name: "Workshop", 
		description: "Activity has leader(s), attendance is limited and requires sign up"
	},
	{ 
		name: "Volunteer", 
		description: "A shift of hard unrewarded labor"
	},
	{
		name: "Mandatory",
		description: "(not implemented) Added to users's lineup upon getting event ticket"
	}
]

export default function GigTypes({onSelect}) {
	return <List>
		{types.map(
			t => <ListItem 
				key={t.name} 
				primaryText={t.name} 
				secondaryText={t.description} 
				onTouchTap={onSelect.bind(null, t)}
			/>
		)}
	</List>
}