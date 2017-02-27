import React from 'react';

import Checkbox from 'material-ui/Checkbox';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Divider from 'material-ui/Divider';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import IconButton from 'material-ui/IconButton';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';

import app from '../main.jsx'

class ExpandableVenueItem extends React.Component {
	constructor(props) {
		super(props);
		this.state = { venues: [<ListItem key="loading" primaryText="Loading..." />] }
	}
	handleNested = (v) => {
		const { venue } = this.props;
		app.service("venues").find({query:{parent: venue._id}})
		.then(page => {
			const venues = page.data.map(
				v => <ListItem 
					key={v._id} 
					leftCheckbox={<Checkbox />}
					primaryText={v.name} 
					secondaryText={'Capacity: ' + v.capacity} 
				/>
			);
			this.setState({...this.state, venues});
		})
		.catch(err => console.error("Got error:", err));
	}
	render() {
		const { venue } = this.props;
		return (
			<ListItem 
				leftCheckbox={<Checkbox />}
				onTouchTap={this.props.onSelect}
				primaryText={venue.name} 
				secondaryText={'Capacity: ' + venue.capacity}
				nestedItems={this.state.venues}
				onNestedListToggle={this.handleNested}
			/>
		);
	}
}

export default class VenueList extends React.Component {
	constructor(props) {
		super(props);
	}
	handleSelection(v){
		// console.log("Handling... " + JSON.stringify(v));
		this.props.onVenueSelected(v)
	}
    
	render() {
		
		return (
			<List >
				{this.props.venues.map(
					v => <ExpandableVenueItem 
							onSelect={this.handleSelection.bind(this, v)} 
							venue={v} 
							key={v._id}
						/>
				)}
				<FloatingActionButton secondary onClick={this.handleSelection.bind(this, {name:"", capacity:""})}>
					<ContentAdd />
				</FloatingActionButton>
			</List>
		);
	}
}

