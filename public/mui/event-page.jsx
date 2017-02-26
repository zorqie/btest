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
// import EventDialogForm from './event-dialog.jsx';

//hack because Material-UI forces a onKeyboardFocus onto the span and React complains
const Kspan = ({onKeyboardFocus, ...others}) => <span {...others}/>; 

const editIcon = <IconButton iconClassName="material-icons" tooltip="Edit" >edit</IconButton>;
		
const addIcon = <FontIcon className="material-icons" >add</FontIcon>;
	// <IconButton iconClassName="material-icons" >add</IconButton>;

const Subgig = ({ gig, onEdit, onDelete }) => <ListItem 
		primaryText={gig.name} 
		secondaryText={gig.description} 
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
			dialog: false,
			dialoggig: props.gig || {},
		};
	}
	componentWillMount() {
		const eventId = this.props.params.eventId;

		app.service('gigs').get(eventId)
		.then(gig => {
			document.title = gig.name;
			app.service('venues').get(new mongoose.Types.ObjectId(gig.venue))		
			.then(venue => this.setState({...this.state, gig, venue}));
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
	}
	componentWillUnmount() {
		if(app) {
			app.service('gigs').removeListener('removed', this.removedListener);
			app.service('gigs').removeListener('created', this.createdListener);
		}
	}

	handleCancel = (e) => {
		// console.log("Canceling...");
		this.setState({dialog: false})
	}
	handleSubmit = (e) => {
		const gig = this.state.dialoggig;
		// console.log("Submitting...", gig);
		if(gig._id) {
			app.service('gigs').patch(gig._id, v)
			.then(gig => console.log("Updated gig", gig))
			.catch(err => console.error("Didn't update", err));
		} else {
			app.service('gigs').create(gig)
			.then(gig => console.log("Created gig", gig))
			.catch(err => console.error("Didn't create gig", JSON.stringify(err)));
		}
		this.setState({dialog: false})
	}

	handleEdit = (g, type) => {
		// console.log("Hanlediting...", v);
		const dg = g ? Object.assign({}, g) : Object.assign({}, {parent: this.state.gig._id, type});
		this.setState({dialog: true, dialoggig: dg});
	}
	handleDelete = (gig) => {
		console.log("Deleting gig ", gig);
		app.service('gigs').remove(gig._id)
		// .then(gig => console.log("Deleted gig", gig)) // this is handled in removedListener
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

	removedListener = gig => {
		console.log("Removed: ", gig);
		this.setState({gigs: this.state.gigs.filter(v => v._id !== gig._id)})
	}
	createdListener = gig => {
		console.log("Added: ", gig);
		this.setState({gigs: this.state.gigs.concat(gig)});
	}
	
	list = (type) => this.state.gigs
		.filter(g => g.type===type)
		.map(g => <Subgig 
			key={g._id} 
			gig={g} 
			onEdit={this.handleEdit.bind(this, g)} 
			onDelete={this.handleDelete.bind(this, g)} 
		/>)

	render() {
		// console.log("EventPage props: ", this.props);
		const {gig, venue} = this.state;
		// console.log("Got gig: ", gig);
		console.log("GIGGGINGING: ", this.state);
		const title = (<span><b>{gig.name}</b> at <b>{venue.name}</b></span>)

		// TODO extract this calculation somewhere

		const startDate = moment(gig.start).format('ddd M/D/YY');
		const endDate = moment(gig.end).format('ddd M/D/YY');
		const subtitle = <span>
			{startDate} at {moment(gig.start).format('h:mm a')}
			<i> to </i> 
			{endDate==startDate ? '' : endDate + ' at '}{moment(gig.end).format('h:mm a')};
		</span>;
		// TODO extract the above calculation somewhere

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
					Details go here. 
					{/*<Tabs>
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
					</Tabs>*/}
				</CardText>
				 
				<CardActions>
					<FlatButton label="Actionize" />
					<FlatButton label="Deactionify" />
				</CardActions>
			</Card>
		);
	}
}