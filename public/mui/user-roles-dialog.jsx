import React from 'react'

import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import {ListItem} from 'material-ui/List'

const options = [
	{
		name: "sysadmin",
		description: "God Almighty of the System",
	}, 
	{
		name: "manager",
		description: "Perhaps in charge of volunteers (not yet implemented)",
	},
	{
		name: "master",
		description: "Master of crafts and arts workshops",
	},
	{
		name: "performer",
		description: "Adding this role will create a performer profile",
	},
]

export default function UserRolesDialog({open, onSelect, onClose, roles}) {
	const items = roles || options
	return <Dialog
				open={open}
				title='Select role to add'
				onRequestClose={onClose}
				actions={[<FlatButton label='Close' onTouchTap={onClose} />]}
			>
		{items.map(r=>
			<ListItem
				key={r.name}
				primaryText={r.name || r}
				secondaryText={r.description || ''}
				onTouchTap={onSelect.bind(null, r.name)}
			/>
		)}
	</Dialog>
}