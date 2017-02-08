import React from 'react';

import ContentAdd from 'material-ui/svg-icons/content/add';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

export default class VenuePage extends React.Component {
	render() {
		console.log("VenuePage props: ", this.props);
		const v = this.props.venue || {name:"Ze Venue"};
		const editIcon = <IconButton iconClassName="material-icons" tooltip="Edit" >edit</IconButton>;
		return (
			<Card>
			    <CardHeader
			    	title={v.name}
			    	subtitle="Venue"
			    />
			    <CardMedia overlay={<CardTitle title="Overlay title" subtitle="Overlay subtitle" />} >
					<img src="/img/588bf21d9d47e5d6f61ba9f0.jpg" />
				</CardMedia>
				<CardTitle title="Card title" subtitle="Card subtitle" />
				<CardText>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi. Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque. Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
				</CardText>
				<CardActions>
					<FlatButton label="Action1" />
					<FlatButton label="Action2" />
				</CardActions>
			</Card>
		);
	}
}