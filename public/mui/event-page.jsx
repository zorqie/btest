import React from 'react';
import { browserHistory } from 'react-router';
import moment from 'moment'
import mongoose from 'mongoose'; 

import ContentAdd from 'material-ui/svg-icons/content/add';
import Dialog from 'material-ui/Dialog';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import {Tabs, Tab} from 'material-ui/Tabs';


import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

import app from '../main.jsx'
import GigDialogForm from './gig-dialog-form.jsx'
import GigTypes from './gig-types.jsx'
import GigTimespan from './gig-timespan.jsx'
import { plusOutline } from './icons.jsx'

//hack because Material-UI forces a onKeyboardFocus onto the span and React complains
const Kspan = ({onKeyboardFocus, ...others}) => <span {...others}/>; 

const Subgig = ({ gig, onSelect, onEdit, onDelete }) => <ListItem 
		primaryText={gig.name} 
		secondaryText={<GigTimespan gig={gig} />} 
		rightIconButton={<Kspan>
			<FlatButton label="Edit" onTouchTap={onEdit}/>
			<FlatButton label="Delete" onTouchTap={onDelete}/>
		</Kspan>}
		onTouchTap={onSelect}
	/>;


export default class EventPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			gigs:[], 
			gig: props.gig || {},
			venue: {},
			sites: [],
			dialogOpen: false,
			dialogGig: {},
			errors: {},
			typesOpen: false,
		};
	}
	componentWillMount() {
		const eventId = this.props.params.eventId;

		app.service('gigs').get(eventId)
		.then(gig => {
			app.service('venues')
			.find({query: {parent: new mongoose.Types.ObjectId(gig.venue_id)}})
			.then(page => this.setState({...this.state, sites: page.data, gig, venue: gig.venue}))
		})
		.then(() =>
			app.service('gigs').find({
				query: {
					parent: new mongoose.Types.ObjectId(eventId),
					$sort: { start: 1 },
					// $limit: this.props.limit || 7
				}
			}))
		.then(page => {
			// console.log("Got result: ", page);
			
			this.setState({...this.state, gigs: page.data });
		})
		.catch(err => console.error("ERAR: ", err));

		app.service('gigs').on('removed', this.removedListener);
		app.service('gigs').on('created', this.createdListener);
		app.service('gigs').on('patched', this.patchedListener);
	}
	componentWillUnmount() {
		if(app) {
			app.service('gigs').removeListener('removed', this.removedListener);
			app.service('gigs').removeListener('created', this.createdListener);
			app.service('gigs').removeListener('patched', this.patchedListener);
		}
	}

	handleDialogCancel = (e) => {
		// console.log("Canceling...");
		this.setState({dialogOpen: false})
	}
	handleDialogSubmit = (e) => {
		const gig = this.state.dialogGig;
		// console.log("Submitting...", gig);
		if(!gig.venue_id) { //mutating ?!?!?!
			gig.venue_id = this.state.venue_id
		}
		if(gig._id) {
			app.service('gigs').patch(gig._id, gig)
			// .then(gig => console.log("Updated gig", gig)) // this is handled in patchedListener
			.catch(err => {
				console.error("Didn't update", err);
				this.setState({...this.state, errors: err.errors});
			});
		} else {
			app.service('gigs').create(gig)
			// .then(gig => console.log("Created gig", gig)) // handled in createdListener
			.catch(err => {
				console.error("Didn't create gig", JSON.stringify(err));
				this.setState({...this.state, errors: err.errors});
			});
		}
		
	}
	handleGigDelete = (gig) => {
		console.log("Deleting gig ", gig);
		app.service('gigs').remove(gig._id)
		// .then(gig => console.log("Deleted gig", gig)) // this is handled in removedListener
		.catch(err => console.error("Delete failed: ", err));
	}
	handleGigEdit = (gig, type) => {
		// console.log("Hanlediting...", g);
		const dg = gig ? Object.assign({}, gig) : Object.assign({}, {parent: this.state.gig._id, start: this.state.gig.start, type});
		this.setState({dialogOpen: true, dialogGig: dg});
	}
	handleGigSelect = gig => {
		console.log("Selected gig, forwarding", gig)
		browserHistory.push('/gigs/'+ gig._id) //seems a waste to having gig -> id > get(id)
	}
	dialogActions = () => [
		<FlatButton
			label="Cancel"
			primary={true}
			onTouchTap={this.handleDialogCancel}
		/>,
		<FlatButton
			label={this.state.dialogGig._id ? "Save" : "Add"}
			primary={true}
			onTouchTap={this.handleDialogSubmit}
		/>,
	];

	removedListener = gig => {
		// console.log("Removed: ", gig);
		this.setState({
			...this.state, 
			dialogOpen: false,
			errors: {},
			gigs: this.state.gigs.filter(g => g._id !== gig._id),
		});
	}
	createdListener = gig => {
		// console.log("Added: ", gig);
		this.setState({
			...this.state, 
			dialogOpen: false, 
			errors: {},
			gigs: this.state.gigs.concat(gig),
		});
	}
	patchedListener = gig => {
		// console.log("Updated: ", gig);
		// do something to reflect update
		this.setState({...this.state, dialogOpen: false, errors:{}});
	}

// types 
	handleTypesCancel = () => {
		// console.log("Canceling...");
		this.setState({typesOpen: false})
	}
	handleTypesSelect = type => {
		this.setState({typesOpen: false});
		this.handleGigEdit(null, type.name);
	}
	handleTypesOpen = () => {
		this.setState({typesOpen: true});
	}

	render() {
		const {gig, venue} = this.state;
		// console.log("GIGGGINGING: ", this.state);
		const title = (<span><b>{gig.name}</b> at <b>{venue.name}</b></span>);

		const subtitle = <GigTimespan gig={gig} showRelative={true}/>;

		return (
			<Card>
			    {/*<CardHeader title={v.name} subtitle="gig" />*/}
			    <CardTitle 
			    	title={title} 
			    	subtitle={subtitle} 
			    	actAsExpander={true} 
			    	showExpandableButton={true}
			    />
			    <CardMedia overlay={<FlatButton label="Change poster" style={{color:'white'}}/>}  expandable={true}>
					<img src={`/img/${gig._id}_poster.jpg`} />
				</CardMedia>
				<CardText >
					<p>{gig.description}</p>

					{this.state.gigs.map(
						gig => <Subgig 
							key={gig._id} 
							gig={gig}
							onEdit={this.handleGigEdit.bind(this, gig)}
							onDelete={this.handleGigDelete.bind(this, gig)}
							onSelect={this.handleGigSelect.bind(this, gig)}
					/>)}
				</CardText>
				<Dialog
					open={this.state.dialogOpen}
					actions={this.dialogActions()}
					onRequestClose={this.handleDialogCancel}
				>
					<GigDialogForm 
						gig={this.state.dialogGig} 
						venues={this.state.sites}
						errors={this.state.errors}/>
				</Dialog>
				<Dialog
					title="Select activity type"
					open={this.state.typesOpen}
					actions={[<FlatButton
						label="Cancel"
						primary={true}
						onTouchTap={this.handleTypesCancel}
					/>]}
					onRequestClose={this.handleTypesCancel}
				>
					<GigTypes onSelect={this.handleTypesSelect} />
				</Dialog>
				
				<CardActions>
					<FlatButton icon={plusOutline} label="Activity" onTouchTap={this.handleTypesOpen}/>
				</CardActions>
			</Card>
		);
	}
}