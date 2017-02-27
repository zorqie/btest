import React from 'react';

import ContentAdd from 'material-ui/svg-icons/content/add';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';

export default class GigTypes extends React.Component {
	constructor(props) {
		super(props);
		this.types = [
			{ 
				name: "Performance", 
				description: "Activity has performer(s) and anyone can attend"
			},
			{ 
				name: "Workshop", 
				description: "Activity has leader(s), attendance is limited and requires sign up"
			},
			{ 
				name: "Volunteer", 
				description: "A shift of hard unrewarded labor"
			},
		];
	}
	handleSelect = type => this.props.onSelect(type);	
	render() {
		return <List>
			{this.types.map(
				t => <ListItem 
					key={t.name} 
					primaryText={t.name} 
					secondaryText={t.description} 
					onTouchTap={this.handleSelect.bind(this, t)}
				/>
			)}
		</List>
	}
}