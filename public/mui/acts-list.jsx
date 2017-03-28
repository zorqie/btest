import React from 'react';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import FlatButton from 'material-ui/FlatButton';
import {List, ListItem} from 'material-ui/List';

import { addIcon } from './icons.jsx'
import { Kspan } from './hacks.jsx'


export default function ActsList ({ acts, onSelect, onEdit, onDelete, allowAdd, compact, addButton}) {
	const addAction = allowAdd && 
		(addButton || <FloatingActionButton onTouchTap={onEdit.bind(null, null)}>{addIcon}</FloatingActionButton>)
	return <div>
		<List>
			{acts && acts.map(act => 
				<ListItem 
					key={act._id} 
					primaryText={act.name}
					onTouchTap={onSelect.bind(null, act)}
					secondaryText={compact ? '' : (act.description || ' ')}
					rightIconButton={<Kspan>
						{onEdit && <FlatButton label="Edit" onTouchTap={onEdit.bind(null, act)}/>}
						{onDelete && <FlatButton label="Delete" onTouchTap={onDelete.bind(null, act)}/>}
					</Kspan>}
				/>
			)}
			
		</List>
		{addAction}
	</div>
}