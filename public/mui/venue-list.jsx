import React from 'react';

import ContentAdd from 'material-ui/svg-icons/content/add';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import IconButton from 'material-ui/IconButton';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';

class VenueItem extends React.Component {
	render() {
		const clack = function(e) {
			console.log('Clacked. ' + JSON.stringify(this.props.venue.name));
		}
		const cleck = () => this.props.onSelect(this.props.venue);
		
		const editIcon = <IconButton iconClassName="material-icons" tooltip="Edit" onClick={clack.bind(this)}>edit</IconButton>;
		return (
			<ListItem 
				onClick={cleck.bind(this)}
				primaryText={this.props.venue.name} 
				secondaryText={'Capacity: ' + this.props.venue.capacity}
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

