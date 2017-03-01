import React from 'react';
import moment from 'moment'
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
import GigDialogForm from './gig-dialog-form.jsx';
import GigTypes from './gig-types.jsx';

//hack because Material-UI forces a onKeyboardFocus onto the span and React complains
const Kspan = ({onKeyboardFocus, ...others}) => <span {...others}/>; 

const editIcon = <IconButton iconClassName="material-icons" tooltip="Edit" >edit</IconButton>;
		
const addIcon = <FontIcon className="material-icons" >add</FontIcon>;
const addBoxIcon = <FontIcon className="material-icons" >add_box</FontIcon>;
	// <IconButton iconClassName="material-icons" >add</IconButton>;

const GigTimeSpan = ({gig, showRelative, ...others}) => {
	const mNow = moment();
	const mStart = moment(gig.start);
	const dateFormat = mNow.year() == mStart.year() ? 'ddd M/D' : 'ddd M/D/YY';
	const startDate = mStart.format(dateFormat);
	const endDate = gig.end && moment(gig.end).format(dateFormat);
	const relative = showRelative ? ' (' + moment().to(mStart) + ')' : '';

	// {...others} passes the styling on
	return <span {...others}>
			{startDate} at {mStart.format('h:mm a')}
			{endDate && (<span> {'\u2013'} {endDate===startDate ? '' : endDate + ' at '}{moment(gig.end).format('h:mm a')}</span>)}
			{relative}
		</span>;
}

const Subgig = ({ gig, onEdit, onDelete }) => <ListItem 
		primaryText={gig.name} 
		secondaryText={<GigTimeSpan gig={gig} />} 
		rightIconButton={<Kspan>
			<FlatButton label="Edit" onTouchTap={onEdit}/>
			<FlatButton label="Delete" onTouchTap={onDelete}/>
		</Kspan>}
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
			document.title = gig.name;
			app.service('venues')
			.get(new mongoose.Types.ObjectId(gig.venue))
			.then(venue => app.service('venues')
				.find({query: {parent: new mongoose.Types.ObjectId(venue._id)}})
				.then(page => this.setState({...this.state, sites: page.data, gig, venue}))
			)
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
	handleDelete = (gig) => {
		console.log("Deleting gig ", gig);
		app.service('gigs').remove(gig._id)
		// .then(gig => console.log("Deleted gig", gig)) // this is handled in removedListener
		.catch(err => console.error("Delete failed: ", err));
	}

	handleEdit = (gig, type) => {
		// console.log("Hanlediting...", g);
		const dg = gig ? Object.assign({}, gig) : Object.assign({}, {parent: this.state.gig._id, start: this.state.gig.start, type});
		this.setState({dialogOpen: true, dialogGig: dg});
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
		this.handleEdit(null, type.name);
	}
	handleTypesOpen = () => {
		this.setState({typesOpen: true});
	}

	render() {
		const {gig, venue} = this.state;
		// console.log("GIGGGINGING: ", this.state);
		const title = (<span><b>{gig.name}</b> at <b>{venue.name}</b></span>);

		const subtitle = <GigTimeSpan gig={gig} showRelative={true}/>;

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
							onEdit={this.handleEdit.bind(this, gig)}
							onDelete={this.handleDelete.bind(this, gig)}
					/>)}

					<FloatingActionButton onTouchTap={this.handleEdit.bind(this, null, '')}>{addIcon}</FloatingActionButton>
					
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
					<FlatButton icon={addIcon} label="Activity" onTouchTap={this.handleTypesOpen}/>
				</CardActions>
			</Card>
		);
	}
}