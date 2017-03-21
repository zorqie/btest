import React from 'react'

import FloatingActionButton from 'material-ui/FloatingActionButton'
import IconButton from 'material-ui/IconButton'
import FlatButton from 'material-ui/FlatButton'
import {List, ListItem} from 'material-ui/List'
import {Tabs, Tab} from 'material-ui/Tabs'

import { addIcon } from './icons.jsx'
import { Kspan } from './hacks.jsx'

export default function VenueSites({ venues, allowAdd, allowNewType, onSelect, onEdit, onDelete}) {
	const types = venues.map(v => v.type).filter((e, i, a) => a.indexOf(e)===i)
	return <Tabs>
		{types.map(type => 
			<Tab key={type || 'Venue'} label={type || 'Venue'}>
				{venues.filter(v => v.type===type)
					.map(v => 
						<ListItem 
							key={v._id} 
							primaryText={v.name}
							onTouchTap={onSelect.bind(null, v)}
							secondaryText={'Capacity: ' + v.capacity}
							rightIconButton={<Kspan>
								{onEdit && <FlatButton label="Edit" onTouchTap={onEdit.bind(null, v, v.type)}/>}
								{onDelete && <FlatButton label="Delete" onTouchTap={onDelete.bind(null, v)}/>}
							</Kspan>}
						/>
					)}
				{allowAdd && <FloatingActionButton onTouchTap={onEdit.bind(null, null, type)}>{addIcon}</FloatingActionButton>}
			</Tab>)}
			{allowNewType && <Tab key="add" label="Add..." onActive={onEdit.bind(null, null, '')}/>}
		</Tabs>
}
