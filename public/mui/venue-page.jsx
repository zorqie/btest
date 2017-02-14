import React from 'react';
import mongoose from 'mongoose'; 

import ContentAdd from 'material-ui/svg-icons/content/add';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

import app from '../main.jsx';

class Subvenue extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		const { venue } = this.props;
		console.log("Sub:", venue);
		return <ListItem 
			primaryText={venue.name} 
			secondaryText={"Capacity " + venue.capacity} 
			rightIconButton={<span><FlatButton label="Edit" /><FlatButton label="Delete" /></span>}
		/>;
	}
}

export default class VenuePage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {venues:[], venue: props.venue || {}};
	}
	componentDidMount() {
		const parentId = this.props.params.venueId;
		console.log("Looking for parent: " + parentId);
		app.service('venues').get(parentId)
		.then((venue) => this.setState({...this.state, venue}))
		.then(() =>
			app.service('venues').find({
				query: {
					parent: new mongoose.Types.ObjectId(parentId),
					// $sort: { createdAt: -1 },
					// $limit: this.props.limit || 7
				}
			}))
		.then(page => {
			// console.log("Got result: ", page);
			this.setState({...this.state, venues: page.data });
		})
		.catch(err => console.error("ERAR: ", err));
		// Listen to newly created messages
		// this.venueService.on('created', venue => this.setState({
		// 	venues: this.state.venues.concat(venue)
		// }));
	}
	
	list = (type) => this.state.venues.filter(v => v.type===type).map(v => <Subvenue key={v._id} venue={v} />)

	render() {
		// console.log("VenuePage props: ", this.props);
		const v = this.state.venue || {name:"Ze Venue"};
		console.log("Got venue: ", v);
		const editIcon = <IconButton iconClassName="material-icons" tooltip="Edit" >edit</IconButton>;
		const title = <CardTitle title={v.name} subtitle={"Capacity " + v.capacity} actAsExpander={true} showExpandableButton={true}/>;
		return (
			<Card>
			    {/*<CardHeader title={v.name} subtitle="Venue" />*/}
			    {title}
			    <CardMedia overlay={title} expandable={true}>
					<img src={`/img/${v._id}.jpg`} />
				</CardMedia>
				{/*<CardTitle title="Card title" subtitle="Card subtitle" />*/}
				<CardText>
					<List>
						<ListItem 
							primaryText="Performance"
							nestedItems={
								this.list('performance')
							}
						/>
						<ListItem primaryText="Volunteering" 
							nestedItems={
								this.state.venues.filter(v => v.type==="volunteer").map(v => <Subvenue key={v._id} venue={v} />)
							}
						/>
					</List>
				</CardText>
				<CardActions>
					<FlatButton label="Action1" />
					<FlatButton label="Action2" />
				</CardActions>
			</Card>
		);
	}
}