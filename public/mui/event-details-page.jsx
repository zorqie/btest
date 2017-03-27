import React from 'react'
import {Link, browserHistory} from 'react-router'
import moment from 'moment'

import ContentAdd from 'material-ui/svg-icons/content/add'
import ActionDashboard from 'material-ui/svg-icons/action/dashboard'

import Dialog from 'material-ui/Dialog'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import IconButton from 'material-ui/IconButton'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import {List, ListItem} from 'material-ui/List'
import {Tabs, Tab} from 'material-ui/Tabs'


import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card'

import app from '../main.jsx'
import GigDialogForm from './gig-dialog-form.jsx'
import GigTypesList from './gig-types-list.jsx'
import GigTimespan from './gig-timespan.jsx'
import GigsTab from './gigs-tab.jsx'
import { Kspan } from './hacks.jsx'
import { plusOutline } from './icons.jsx'

const types = gigs => gigs.map(g => g.type).filter((e, i, a) => a.indexOf(e)===i)


export default class EventPage extends React.Component {
	state = {
		gigs:[], 
		event: {},
		dialog: {
			open: false, 
			gig: {}, 
			sites:[], 
			errors: {}
		},
		typesOpen: false,
	}
	componentWillMount() {
		app.authenticate()
		.then(this.fetchData)
	}
	componentDidMount() {
		app.service('gigs').on('removed', this.removedListener)
		app.service('gigs').on('created', this.createdListener)
		app.service('gigs').on('patched', this.patchedListener)
	}
	componentWillUnmount() {
		if(app) {
			app.service('gigs').removeListener('removed', this.removedListener)
			app.service('gigs').removeListener('created', this.createdListener)
			app.service('gigs').removeListener('patched', this.patchedListener)
		}
	}
	fetchData = () => {
		const {eventId} = this.props.params

		app.service('gigs').get(eventId)
		.then(event => {
			app.emit('gig.root', event)
			app.service('gigs').find({
				query: {
					parent: eventId,
					$sort: { start: 1 },
					// $limit: this.props.limit || 7
				}
			})
			.then(page => {
				// console.log("Got result: ", page)
				
				this.setState({...this.state, event, gigs: page.data })
			})
		})
		.catch(err => console.error("ERAR: ", err))
	}

	/*
	
	*/

	handleDialogCancel = () => {
		// console.log("Canceling...")
		const { dialog } = this.state
		Object.assign(dialog, {open: false})
		this.setState({...this.state, dialog})
	}
	handleDialogSubmit = () => {
		const {gig} = this.state.dialog
		// console.log("Submitting...", gig)
		if(!gig.venue_id) { //mutating ?!?!?!
			gig.venue_id = this.state.venue_id
		}
		if(gig._id) {
			app.service('gigs').patch(gig._id, gig)
			// .then(gig => console.log("Updated gig", gig)) // this is handled in patchedListener
			.catch(err => {
				console.error("Didn't update", err)
				this.setState({...this.state, dialog: {open: true, errors: err.errors, gig}})
			})
		} else {
			app.service('gigs').create(gig)
			// .then(gig => console.log("Created gig", gig)) // handled in createdListener
			.catch(err => {
				console.error("Didn't create gig", JSON.stringify(err))
				this.setState({...this.state, dialog: {open: true, errors: err.errors, gig}})
			})
		}
		
	}
	handleGigDelete = gig => {
		console.log("Deleting gig ", gig)
		app.service('gigs').remove(gig._id)
		// .then(gig => console.log("Deleted gig", gig)) // this is handled in removedListener
		.catch(err => console.error("Delete failed: ", err))
	}
	handleGigEdit = (gig, type) => {
		// console.log("Hanlediting...", gig)
		const { dialog, event } = this.state
		const dg = gig ? 
			Object.assign({}, gig) 
			: Object.assign({}, {
				parent: event._id, 
				start: event.start, 
				type
			})
		app.service('venues')
		.find({query: {parent: event.venue_id}})
		.then(page => {
			Object.assign(dialog, {open: true, gig: dg, sites: page.data, errors:{}})

			this.setState({...this.state, typesOpen: false, gig, })
		})
	}
	handleGigSelect = gig => {
		console.log("Selected gig, forwarding", gig)
		browserHistory.push('/gigs/'+ gig._id) //seems a waste to having gig -> id > get(id)
	}

	dialogActions = () => [
		<FlatButton
			label="Cancel"
			onTouchTap={this.handleDialogCancel}
		/>,
		<RaisedButton
			label={this.state.dialog.gig._id ? "Save" : "Add"}
			primary={true}
			onTouchTap={this.handleDialogSubmit}
		/>,
	]

	removedListener = gig => {
		// console.log("Removed: ", gig)
		const {dialog, gigs} = this.state
		Object.assign(dialog, {open: false,  errors:{}})
		this.setState({
			...this.state, 
			gigs: gigs.filter(g => g._id !== gig._id),
			dialog
		})
	}
	createdListener = gig => {
		// console.log("Added: ", gig)
		const {dialog, gigs} = this.state
		Object.assign(dialog, {open: false, errors: {}})
		this.setState({
			...this.state, 
			gigs: gigs.concat(gig),
			dialog,
		})
	}
	patchedListener = gig => {
		// console.log("Updated: ", gig)
		// do something to reflect update
		const {dialog, gigs} = this.state
		Object.assign(dialog, {open: false, errors: {}})
		this.setState({
			...this.state, 
			gigs: gigs.filter(g => g._id !== gig._id).concat(gig), //remove+add ?
			dialog,
		})
	}

// types 
	handleTypesCancel = () => {
		// console.log("Canceling...")
		this.setState({typesOpen: false})
	}
	handleTypesSelect = type => {
		// this.setState({...this.state, typesOpen: false})
		this.handleGigEdit(null, type.name)
	}
	openTypesDialog = () => {
		this.setState({...this.state, typesOpen: true})
	}

	render() {
		const {event, gigs, dialog} = this.state
		// console.log("GIGGGINGING: ", this.state) 
		const title = (<span><b>{event.name}</b> at <b>{event.venue && event.venue.name}</b></span>)

		const subtitle = <GigTimespan gig={event} showRelative={true}/>

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
					<img src={`/img/${event._id}_poster.jpg`} />
				</CardMedia>
				<CardText >
					<p>{event.description}</p>
					<Tabs>
						{types(gigs).map(type => 
							GigsTab({event, type, gigs, onEdit:this.handleGigEdit, 
								onDelete:this.handleGigDelete,
								onSelect:this.handleGigSelect,
							})
						)}
					</Tabs>
				</CardText>
				<Dialog
					open={dialog.open}
					actions={this.dialogActions()}
					onRequestClose={this.handleDialogCancel}
				>
					<GigDialogForm 
						gig={dialog.gig} 
						venues={dialog.sites}
						errors={dialog.errors}/>
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
					<GigTypesList onSelect={this.handleTypesSelect} />
				</Dialog>
				
				<CardActions>
					<FloatingActionButton onTouchTap={this.openTypesDialog}>
						<ContentAdd />
					</FloatingActionButton>
				</CardActions>
			</Card>
		)
	}
}