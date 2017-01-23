import React from 'react';
import { List, ListItem, ListSubHeader, ListDivider } from 'react-toolbox/components/list'
import { Button, IconButton } from 'react-toolbox/components/button';

class VenueItem extends React.Component {
	render() {
		const clack = function(e) {
			console.log('Clacked. ' + JSON.stringify(this.props.venue.name));
		}
		const cleck = () => this.props.onSelect(this.props.venue);
		
		const editIcon = <IconButton icon='edit' onClick={clack.bind(this)}/>;
		return (
			<ListItem 
				onClick={cleck.bind(this)}
				caption={this.props.venue.name} 
				legend={'Capacity: ' + this.props.venue.capacity}
				rightActions={[editIcon]}
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
			<List selectable ripple >
				<ListSubHeader caption='Venues' />
				{this.props.venues.map((v) => (
					<VenueItem onSelect={this.handleSelection.bind(this, v)} venue={v} key={v._id}/>)
				)}
				<Button icon='add' floating accent onClick={this.handleSelection.bind(this, {name:"", capacity:""})}/>
			</List>
		);
	}
}

