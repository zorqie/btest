import React from 'react';
import { browserHistory } from 'react-router';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import FlatButton from 'material-ui/FlatButton';
import {List, ListItem} from 'material-ui/List';

import { addIcon } from './icons.jsx'

//hack because Material-UI forces a onKeyboardFocus onto the span and React complains
const Kspan = ({onKeyboardFocus, ...others}) => <span {...others}/>; 

export default class ActsList extends React.Component { 
	edit =   act => this.props.onEdit(act);
	delete = act => this.props.onDelete(act);
	select = act => this.props.onSelect && this.props.onSelect(act);

	render() {
		const { acts, allowAdd, onEdit, onDelete} = this.props;
		return <List>
			{acts.map(act => <ListItem 
							key={act._id} 
							primaryText={act.name}
							onTouchTap={this.select.bind(this, act)}
							secondaryText={act.description || ' '}
							rightIconButton={<Kspan>
								{onEdit && <FlatButton label="Edit" onTouchTap={this.edit.bind(this, act)}/>}
								{onDelete && <FlatButton label="Delete" onTouchTap={this.delete.bind(this, act)}/>}
							</Kspan>}
			/>)}
			{allowAdd && <FloatingActionButton onTouchTap={this.edit.bind(this, null)}>{addIcon}</FloatingActionButton>}
		</List>
	}
}