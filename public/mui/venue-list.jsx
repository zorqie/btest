import React from 'react';
import { browserHistory } from 'react-router';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import IconButton from 'material-ui/IconButton';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';

import {addIcon} from './icons.jsx';

const  VenueItem = ({venue, onSelect, onEdit}) =>
	
			<ListItem 
				onTouchTap={onSelect}
				primaryText={venue.name} 
				secondaryText={'Capacity: ' + venue.capacity}
				rightIconButton={onEdit && <IconButton 
					iconClassName="material-icons" 
					tooltip="Edit" 
					onTouchTap={onEdit}>edit</IconButton>
				}
			/>	


export default class VenueList extends React.Component {

	handleSelect = v => this.props.onSelect(v)
	handleEdit = v => this.props.onEdit(v)	
    
	render() {
		
		return (
			<List >
				{this.props.venues.map(v => <VenueItem 
					onSelect={this.handleSelect.bind(this, v)} 
					onEdit={this.handleEdit.bind(this, v)} 
					venue={v} 
					key={v._id}/>)
				}
				<FloatingActionButton 
					secondary 
					onClick={this.handleEdit.bind(this, {name:"", capacity:""})}
				>
					{addIcon}
				</FloatingActionButton>
			</List>
		);
	}
}

