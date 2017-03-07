import React from 'react'
import moment from 'moment'
import mongoose from 'mongoose'
import { browserHistory } from 'react-router';

import Avatar from 'material-ui/Avatar'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'
import {List, ListItem} from 'material-ui/List'
import Subheader from 'material-ui/Subheader'
import Divider from 'material-ui/Divider'
import Dialog from 'material-ui/Dialog'

import ActsList from './acts-list.jsx'
import ActDialogForm from './act-dialog-form.jsx'
import GigTimespan from './gig-timespan.jsx'
import app from '../main.jsx'
import { mic } from './icons.jsx'

import PerformanceCard from './cards/performance-card.jsx'
import WorkshopCard from './cards/workshop-card.jsx'
import VolunteerCard from './cards/volunteer-card.jsx'





export default class GigDetailsPage extends React.Component {
	state = {
		fans: [],  
		gig: {},
		venue: {},
		selectDialog: false,
		dialogActs: [],
		editDialog: {open: false, act: {}, errors: {}},
	}
	componentWillMount() {
		app.authenticate().then(this.fetchData)
		.catch(err => console.error("It can't be, an erro: ", err))
	}
	componentDidMount() {
		// attach listeners
		app.service('gigs').on('patched', this.fetchData)
	}
	componentWillUnmount() {
		// remove listners
		app.service('gigs').removeListener('patched', this.fetchData)
	}

	fetchData = () => {
		const { gigId } = this.props.params
		
		 
		app.service('gigs').get(gigId)
		.then(gig => {	
			document.title=gig.name	
			this.setState({venue: gig.venue, gig})
		})
		.then(() => app.service('fans')
			.find({query:{gig_id:gigId, status: 'Attending'}})
			.then(result => this.setState({fans: result.data})))
	} 

	selectAct = () => {
		app.service('acts').find()
		.then(result => {
			if(result.total > 0) {
				this.setState({dialogActs: result.data, selectDialog: true})
			}
		})
	}
	removeAct = act => {
		console.log("Remove act", act)
		const { gig } = this.state
		Object.assign(gig, {act_id: gig.act_id.filter(a_id => a_id !== act._id)})
		app.service('gigs').patch(gig._id, gig)
	}
	replaceAct = act => {
		this.removeAct(act)
		this.selectAct()
	}
	viewActDetails = act => browserHistory.push('/acts/'+act._id)

	handleActsEdit = act => {
		console.log("Editing act", act)
		const {editDialog} = this.state
		Object.assign(editDialog, {open: true, errors:{}, act: act || {}})
		this.setState({selectDialog:false, editDialog})
	}
	handleActsSelect = act => {
		console.log("Act selected", act)
		const { gig } = this.state
		Object.assign(gig, {act_id: gig.act_id.concat(act._id)})
		app.service('gigs').patch(gig._id, gig)
		.then(gig => console.log("Gig patched", gig))
		.catch(err => console.error("Most erroneous thing happened", err))
	}
	handleActsCancel = () => {
		this.setState({selectDialog: false})
	}


	handleActEditCancel = () => {
		this.setState({editDialog: {open: false}})
	}

	handleActEditSubmit = e => {
		const {act} = this.state.editDialog
		if(act._id) {
			// patch
			app.service('acts').patch(act._id, act)
			.then(this.selectAct)
			.catch(this.handleActEditError)
		} else {
			//create
			app.service('acts').create(act)
			.then(this.selectAct)
			.catch(this.handleActEditError)
		}
		// this.selectAct()
	}

	handleActEditError = err => {
		console.log("Act error", err)
		const { editDialog } = this.state;
		Object.assign(editDialog, {errors: err.errors})
		this.setState({...this.state, editDialog})
	}

	render() {
		const { gig, venue, fans, dialogActs } =  this.state
		// console.log("GIIG", this.state)
		const card = 
			gig.type==='Workshop' ? 
				<WorkshopCard 
					gig={gig} 
					fans={fans}
					onMasterSelect={this.viewActDetails}
					onMasterEdit={this.replaceAct} 
					onMasterDelete={this.removeAct} 
				/> : 
				gig.type==='Volunteer' ?
					<VolunteerCard gig={gig} /> : 
					<PerformanceCard 
						gig={gig} 
						onPerformerSelect={this.viewActDetails}
						onPerformerEdit={this.replaceAct} 
						onPerformerDelete={this.removeAct} 
					/>
		const gigTitle = <span>
					<span className='acts'>{gig.acts && gig.acts.map(a => a.name).join(', ')}</span>
					{venue && <span> at the {venue.name}</span>}</span>
		return <Card>
			<CardHeader 
				title={gigTitle} 
				subtitle={<GigTimespan gig={gig} showDuration={true} />}
				avatar={<Avatar>{gig.type && gig.type.charAt(0)}</Avatar>}>
			</CardHeader>
			<CardText>
				
				{card}
			</CardText>
			<CardActions>
				{gig.type !== 'Volunteer' && <FlatButton icon={mic} label='Add performer' onTouchTap={this.selectAct}/>}
			</CardActions>
			<Dialog
				title='Acts'
				open={this.state.selectDialog}
					actions={[
						<FlatButton
							label="Cancel"
							primary={true}
							onTouchTap={this.handleActsCancel}
						/>
					]}
					onRequestClose={this.handleActsCancel}
			>
				<ActsList acts={dialogActs} 
					onSelect={this.handleActsSelect} 
					allowAdd={true}
					onEdit={this.handleActsEdit}/>
			</Dialog>
			<Dialog
				title='Act'
				open={this.state.editDialog.open}
					actions={[
						<FlatButton
							label="Cancel"
							
							onTouchTap={this.handleActEditCancel}
						/>,
						<FlatButton
							label="Save"
							primary={true}
							onTouchTap={this.handleActEditSubmit}
						/>
					]}
					onRequestClose={this.handleActEditCancel}
			>
				<ActDialogForm act={this.state.editDialog.act}  errors={this.state.editDialog.errors}/>
			</Dialog>
		</Card>
	}
}