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
import VenueSites from './venue-sites.jsx';

export default class VenuePage extends React.Component {
	state = {
		venues:[], 
		venue: this.props.venue || {},
		dialog: false,
		dialogVenue: this.props.venue || {},
		types: ['performance', 'service'],
		errors: {}
	}

	componentWillMount() {
		app.authenticate().then(this.fetchData);
		// Listen to newly created messages
		// this.venueService.on('created', venue => this.setState({
		// 	venues: this.state.venues.concat(venue)
		// }));
		app.service('venues').on('created', this.createdListener);
		app.service('venues').on('patched', this.patchedListener);
		app.service('venues').on('removed', this.removedListener);
	}
	componentWillUnmount() {
		if(app) {
			app.service('venues').removeListener('created', this.createdListener);
			app.service('venues').removeListener('patched', this.patchedListener);
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
			.then(v => this.setState({dialog: false, errors:{}}))
			.catch(err => console.error("Didn't update", err));
		} else {
			app.service('venues').create(v)
			.then(v => this.setState({dialog: false, errors:{}})) 
			.catch(err => {
				console.error("Failed to create venue", JSON.stringify(err));
				this.setState({...this.state, errors: err.errors});
			});
		}
		
	}
	handleEdit = (v, type) => {
		// console.log("Hanlediting...", v);
		const dv = v ? Object.assign({}, v) : Object.assign({}, {parent: this.state.venue._id, type});
		const types = this.state.venues.map(v => v.type).filter((e, i, a) => a.indexOf(e)===i);
		this.setState({dialog: true, dialogVenue: dv, types});
	}
	handleDelete = v => {
		// check that there aren't events perhaps? 
		app.service('venues').remove(v._id)
		// .then(v => console.log("Deleted venue", v))  // on('removed') handles this
		.catch(err => console.error("Delete failed: ", err));
	}
	
	createdListener = venue => {
		console.log("Added: ", venue);
		// if(this.state.types.indexOf(venue.type) < 0) {
		// 	this.fetchData()
		// } else {
			this.setState({venues: this.state.venues.concat(venue)});
		// }
	}
	patchedListener = venue => {
		// if(this.state.types.indexOf(venue.type) < 0) {
			//possibly changed type, easier to 
			this.fetchData()
		// } else {
		// 	// update the one item. but later FIXME
		// 	this.fetchData()
		// }
	}
	removedListener = venue => {
		console.log("Removed: ", venue);
		this.setState({venues: this.state.venues.filter(v => v._id !== venue._id)})
	}

	fetchData = () => {
		const parentId = this.props.params.venueId
		// console.log("Looking for parent: " + parentId);
		app.service('venues').get(parentId)
		.then(venue => {
			this.setState({...this.state, venue})
			document.title = venue.name;
		})
		.then(() =>
			app.service('venues').find({
				query: {
					parent: parentId,
					// $sort: { createdAt: -1 },
					// $limit: this.props.limit || 7
				}
			}))
		.then(page => {
			this.setState({...this.state,  venues: page.data })
		})
		.catch(err => console.error("ERAR: ", err))
	}

	dialogActions = [
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
	]

	zEdit = e => {
		console.log("Attempting an edit perhaps: ", e.target);
	}
	render() {
		// console.log("VenuePage props: ", this.props);
		const {venue} = this.state;
		const title = <CardTitle 
			title={venue.name} 
			subtitle={"Capacity: " + venue.capacity} 
			actAsExpander={true} 
			showExpandableButton={true}
		/>;
		return (
			<Card>
			    {/*<CardHeader title={v.name} subtitle="Venue" />*/}
			    {title}
			    <CardMedia overlay={title} expandable={true}>
					<img src={`/img/${venue._id}.jpg`} />
				</CardMedia>
				{/*<CardTitle title="Card title" subtitle="Card subtitle" />*/}
				<CardText>
					<VenueSites 
						venues={this.state.venues} 
						allowAdd={true} 
						allowNewType={true} 
						onEdit={this.handleEdit} 
						onSelect={this.zEdit}
						onDelete={this.handleDelete}
						/>

				</CardText>
				<Dialog
					title="Venue"
					open={this.state.dialog}
					actions={this.dialogActions}
					onRequestClose={this.handleCancel}
				>
					<VenueDialogForm venue={this.state.dialogVenue} types={this.state.types} errors={this.state.errors}/>
				</Dialog>
				{/*<CardActions>
					<FlatButton label="Action1" />
					<FlatButton label="Action2" />
				</CardActions>*/}
			</Card>
		);
	}
}

