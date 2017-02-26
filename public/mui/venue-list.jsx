import React from 'react';
import { browserHistory } from 'react-router';

import ContentAdd from 'material-ui/svg-icons/content/add';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import IconButton from 'material-ui/IconButton';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';

class VenueItem extends React.Component {
	edit = (e) => browserHistory.push('/venues/'+ this.props.venue._id);
	editIcon = <IconButton iconClassName="material-icons" tooltip="Edit" onTouchTap={this.edit}>edit</IconButton>;
	render() {
		const { venue } = this.props;		
		return (
			<ListItem 
				onTouchTap={this.props.onSelect}
				primaryText={venue.name} 
				secondaryText={'Capacity: ' + venue.capacity}
				rightIconButton={this.editIcon}
			/>
		);
	}
}

export default class VenueList extends React.Component {
	constructor(props) {
		super(props);
		// this.handleSelection.bind(this);
	}
	handleSelection(v){
		// console.log("Handling... " + JSON.stringify(v));
		this.props.onVenueSelected(v)
	}
    
	render() {
		
		return (
			<List >
				{this.props.venues.map(v => (
					<VenueItem onSelect={this.handleSelection.bind(this, v)} venue={v} key={v._id}/>)
				)}
				<FloatingActionButton secondary onClick={this.handleSelection.bind(this, {name:"", capacity:""})}>
					<ContentAdd />
				</FloatingActionButton>
			</List>
		);
	}
}

