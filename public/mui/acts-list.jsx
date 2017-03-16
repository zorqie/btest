import React from 'react';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import FlatButton from 'material-ui/FlatButton';
import {List, ListItem} from 'material-ui/List';

import { addIcon } from './icons.jsx'
import { Kspan } from './hacks.jsx'


export default class ActsList extends React.Component { 
	edit =   act => this.props.onEdit(act);
	delete = act => this.props.onDelete(act);
	select = act => this.props.onSelect && this.props.onSelect(act);

	render() {
		const { acts, allowAdd, compact, onEdit, onDelete} = this.props;
		return <div>
			<List>
				{acts.map(act => <ListItem 
								key={act._id} 
								primaryText={act.name}
								onTouchTap={this.select.bind(this, act)}
								secondaryText={compact ? '' : (act.description || ' ')}
								rightIconButton={<Kspan>
									{onEdit && <FlatButton label="Edit" onTouchTap={this.edit.bind(this, act)}/>}
									{onDelete && <FlatButton label="Delete" onTouchTap={this.delete.bind(this, act)}/>}
								</Kspan>}
				/>)}
				
			</List>
			{allowAdd && <FloatingActionButton onTouchTap={this.edit.bind(this, null)}>{addIcon}</FloatingActionButton>}
		</div>
	}
}