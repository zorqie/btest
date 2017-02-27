import React from 'react';
import { browserHistory } from 'react-router';

import ContentAdd from 'material-ui/svg-icons/content/add';
import Dialog from 'material-ui/Dialog';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import FlatButton from 'material-ui/FlatButton';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import {Tabs, Tab} from 'material-ui/Tabs';


//hack because Material-UI forces a onKeyboardFocus onto the span and React complains
const Kspan = ({onKeyboardFocus, ...others}) => <span {...others}/>; 

const addIcon = <FontIcon className="material-icons" >add</FontIcon>;

export default class VenueSites extends React.Component { 
	edit = (venue, type) => this.props.onEdit(venue, type);
	delete = venue => this.props.onDelete(venue);
	select = venue => this.props.onSelect && this.props.onSelect(venue);

	render() {
		const { venues, allowAdd, allowNewType, onEdit, onDelete} = this.props;
		const types = venues.map(v => v.type).filter((e, i, a) => a.indexOf(e)===i);
		return <Tabs>
			{types.map(type => <Tab key={type} label={type}>
				{venues.filter(v => v.type===type)
					.map(v => <ListItem 
							key={v._id} 
							primaryText={v.name}
							onTouchTap={this.select.bind(this, v)}
							secondaryText={'Capacity: ' + v.capacity}
							rightIconButton={<Kspan>
								{onEdit && <FlatButton label="Edit" onTouchTap={this.edit.bind(this, v)}/>}
								{onDelete && <FlatButton label="Delete" onTouchTap={this.delete.bind(this, v)}/>}
							</Kspan>}
					/>)}
				{allowAdd && <FloatingActionButton onTouchTap={this.edit.bind(this, null, type)}>{addIcon}</FloatingActionButton>}
			</Tab>)}
			{allowNewType && <Tab key="add" label="Add..." onActive={this.edit.bind(this, null, '')}/>}
		</Tabs>
	}
}