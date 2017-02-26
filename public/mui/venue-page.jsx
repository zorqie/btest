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

//hack because Material-UI forces a onKeyboardFocus onto the span and React complains
const Kspan = ({onKeyboardFocus, ...others}) => <span {...others}/>; 

const Subvenue = ({ venue, onEdit, onDelete }) => <ListItem 
		primaryText={venue.name} 
		secondaryText={"Capacity " + venue.capacity} 
		rightIconButton={<Kspan>
			<FlatButton label="Edit" onTouchTap={onEdit}/>
			<FlatButton label="Delete" onTouchTap={onDelete}/>
		</Kspan>}
	/>;


export default class VenuePage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			venues:[], 
			venue: props.venue || {},
			dialog: false,
			dialogVenue: props.venue || {},
			types: ['performance', 'service'],
		};
	}

	componentWillMount() {
		this.fetchData();
		// Listen to newly created messages
		// this.venueService.on('created', venue => this.setState({
		// 	venues: this.state.venues.concat(venue)
		// }));
		app.service('venues').on('created', this.createdListener);
		app.service('venues').on('removed', this.removedListener);
	}
	componentWillUnmount() {
		if(app) {
			app.service('venues').removeListener('created', this.createdListener);
			app.service('venues').removeListener('removed', this.removedListener);
		}
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
			// .then(v => console.log("Created v", v)) // on('created') handles this
			.catch(err => console.error("Failed to create venue", JSON.stringify(err)));
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
		// .then(v => console.log("Deleted venue", v))  // on('removed') handles this
		.catch(err => console.error("Delete failed: ", err));
	}
	
	createdListener = venue => {
		console.log("Added: ", venue);
		if(this.state.types.indexOf(venue.type) <0) {
			this.fetchData()
		} else {
			this.setState({venues: this.state.venues.concat(venue)});
		}
	}
	removedListener = venue => {
		console.log("Removed: ", venue);
		this.setState({venues: this.state.venues.filter(v => v._id !== venue._id)})
	}

	fetchData = () => {
		const parentId = this.props.params.venueId;
		// console.log("Looking for parent: " + parentId);
		app.service('venues').get(parentId)
		.then(venue => {
			this.setState({...this.state, venue});
			document.title = venue.name;
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
			const types = page.data.map(v => v.type).filter((e, i, a) => a.indexOf(e)===i);
			// console.log("Types: ", types);
			this.setState({...this.state, types, venues: page.data });
		})
		.catch(err => console.error("ERAR: ", err));
	}
	list = (type) => this.state.venues
		.filter(v => v.type===type)
		.map(v => <Subvenue 
			key={v._id} 
			venue={v} 
			onEdit={this.handleEdit.bind(this, v)} 
			onDelete={this.handleDelete.bind(this, v)} 
		/>)
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
						{this.state.types.map(type => 
							<Tab label={type} key={type}>
								<List>
									{ this.list(type) }
								</List>
								<FloatingActionButton onTouchTap={this.handleEdit.bind(this, null, type)}>
									{addIcon}
								</FloatingActionButton>
							</Tab>
						)}
						<Tab label="Add..." onActive={this.handleEdit.bind(this, null, '')}>
							
						</Tab>
					</Tabs>
				</CardText>
				<Dialog
					title="Venue"
					open={this.state.dialog}
					actions={this.actions}
					onRequestClose={this.handleCancel}
				>
					<VenueDialogForm venue={this.state.dialogVenue} types={this.state.types} />
				</Dialog>
				{/*<CardActions>
					<FlatButton label="Action1" />
					<FlatButton label="Action2" />
				</CardActions>*/}
			</Card>
		);
	}
}