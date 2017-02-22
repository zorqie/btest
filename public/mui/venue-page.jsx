import React from 'react';
import mongoose from 'mongoose'; 

import ContentAdd from 'material-ui/svg-icons/content/add';
import Dialog from 'material-ui/Dialog';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import FlatButton from 'material-ui/FlatButton';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import {Tabs, Tab} from 'material-ui/Tabs';

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

import app from '../main.jsx';
import VenueDialogForm from './venue-dialog.jsx';

const editIcon = <IconButton iconClassName="material-icons" tooltip="Edit" >edit</IconButton>;
		
const addIcon = <FontIcon className="material-icons" >add</FontIcon>;
	// <IconButton iconClassName="material-icons" >add</IconButton>;

const Subvenue = ({ venue, onEdit, onDelete }) => <ListItem 
		primaryText={venue.name} 
		secondaryText={"Capacity " + venue.capacity} 
		rightIconButton={<span>
			<FlatButton label="Edit" onTouchTap={onEdit}/>
			<FlatButton label="Delete" onTouchTap={onDelete}/>
		</span>}
	/>;


export default class VenuePage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			venues:[], 
			venue: props.venue || {},
			dialog: false,
			dialogVenue: props.venue || {},
		};
	}
	handleCancel = (e) => {
		// console.log("Canceling...");
		this.setState({dialog: false})
	}
	handleSubmit = (e) => {
		const v = this.state.dialogVenue;
		// console.log("Submitting...", v);
		if(v._id) {
			app.service('venues').patch(v._id, v)
			.then(v => console.log("Updated v", v))
			.catch(err => console.error("Didn't update", err));
		} else {
			app.service('venues').create(v)
			.then(v => console.log("Created v", v))
			.catch(err => console.error("Didn't create venue", JSON.stringify(err)));
		}
		this.setState({dialog: false})
	}
	handleEdit = (v, type) => {
		// console.log("Hanlediting...", v);
		const dv = v ? Object.assign({}, v) : Object.assign({}, {parent: this.state.venue._id, type});
		this.setState({dialog: true, dialogVenue: dv});
	}
	handleDelete = (v) => {
		console.log("Deleting venue ", v);
		app.service('venues').remove(v._id)
		.then(v => console.log("Deleted venue", v))
		.catch(err => console.error("Delete failed: ", err));
	}
	actions = [
			<FlatButton
				label="Cancel"
				primary={true}
				onTouchTap={this.handleCancel}
			/>,
			<FlatButton
				label="Save"
				primary={true}
				onTouchTap={this.handleSubmit}
			/>,
		];
	createdListener = venue => {
		console.log("Removed: ", venue);
		this.setState({venues: this.state.venues.filter(v => v._id !== venue._id)})
	}
	removedListener = venue => {
		console.log("Added: ", venue);
		this.setState({venues: this.state.venues.concat(venue)});
	}
	componentWillMount() {
		const parentId = this.props.params.venueId;
		// console.log("Looking for parent: " + parentId);
		app.service('venues').get(parentId)
		.then((venue) => {
			this.setState({...this.state, venue});
			document.title = venue.name;
			console.log("document.title: ", document.title)
		})
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
		app.service('venues').on('removed', this.createdListener);
		app.service('venues').on('created', this.removedListener);
	}
	componentWillUnmount() {
		if(app) {
			app.service('venues').removeListener('removed', this.createdListener);
			app.service('venues').removeListener('created', this.removedListener);
		}
	}
	list = (type) => this.state.venues
		.filter(v => v.type===type)
		.map(v => <Subvenue 
			key={v._id} 
			venue={v} 
			onEdit={this.handleEdit.bind(this, v)} 
			onDelete={this.handleDelete.bind(this, v)} 
		/>)

	render() {
		// console.log("VenuePage props: ", this.props);
		const v = this.state.venue;
		// console.log("Got venue: ", v);
		const title = <CardTitle title={v.name} subtitle={"Capacity: " + v.capacity} actAsExpander={true} showExpandableButton={true}/>;
		return (
			<Card>
			    {/*<CardHeader title={v.name} subtitle="Venue" />*/}
			    {title}
			    <CardMedia overlay={title} expandable={true}>
					<img src={`/img/${v._id}.jpg`} />
				</CardMedia>
				{/*<CardTitle title="Card title" subtitle="Card subtitle" />*/}
				<CardText>
					<Tabs>
						<Tab label="Performance">
							<List>
								{ this.list('performance') }
							</List>
							<FloatingActionButton onTouchTap={this.handleEdit.bind(this, null, 'performance')}>{addIcon}</FloatingActionButton>
						</Tab>
						<Tab label="Service">
							<List>
								{ this.list('service') }
							</List>
							<FloatingActionButton onTouchTap={this.handleEdit.bind(this, null, 'service')}>{addIcon}</FloatingActionButton>
						</Tab>
						<Tab label="Add">
							
						</Tab>
					</Tabs>
				</CardText>
				<Dialog
					title="Edit venue"
					open={this.state.dialog}
					actions={this.actions}
					onRequestClose={this.handleClose}
				>
					<VenueDialogForm venue={this.state.dialogVenue}/>
				</Dialog>
				<CardActions>
					<FlatButton label="Action1" />
					<FlatButton label="Action2" />
				</CardActions>
			</Card>
		);
	}
}