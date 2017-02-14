import React from 'react';
import { browserHistory } from 'react-router';

import ContentAdd from 'material-ui/svg-icons/content/add';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import IconButton from 'material-ui/IconButton';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';

class VenueItem extends React.Component {
	clicked = () => this.props.onSelect(this.props.venue);
	edit = (e) => browserHistory.push('/venues/'+ this.props.venue._id);
	render() {
		const { venue } = this.props;		
		const editIcon = <IconButton iconClassName="material-icons" tooltip="Edit" onClick={this.edit}>edit</IconButton>;
		return (
			<ListItem 
				onClick={this.clicked}
				primaryText={venue.name} 
				secondaryText={'Capacity: ' + venue.capacity}
				rightIcon={editIcon}
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
				<Subheader>Venues</Subheader>
				{this.props.venues.map((v) => (
					<VenueItem onSelect={this.handleSelection.bind(this, v)} venue={v} key={v._id}/>)
				)}
				<FloatingActionButton secondary onClick={this.handleSelection.bind(this, {name:"", capacity:""})}>
					<ContentAdd />
				</FloatingActionButton>
			</List>
		);
	}
}

