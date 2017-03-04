import React from 'react'
import moment from 'moment'
import mongoose from 'mongoose'

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

const styles = {
	acts: {
		fontSize: '18dp',
		fontWeight: 300,
	},
	gigType: {
		fontSize: '12dp',
		fontWeight: '300',
		float: 'right'
	}
}

const WorkshopCard = ({gig, acts, fans}) => <div>
	<span style={styles.gigType}>{gig.type}</span>
	<h2>{gig.name}</h2>
	{gig.acts && gig.acts.length ?
		<div>
			<Divider />
			Performing: 
			<ul>
				{gig.acts.map(act => <li key={act._id}>{act.name}</li>)}
			</ul>
		</div>
		: ''
	}
	<Divider />
	<div>
		Attending: {fans.length}
		<ul>
			{fans.map(fan => <li key={fan._id}>{fan.user.name}</li>)}
		</ul>
	</div>
</div>

const VolunteerCard = ({gig}) => <div>
	<span style={styles.gigType}>Volunteer opportunity</span> 
	<h2>{gig.name}</h2>
</div>

const PerformanceCard = ({gig}) => <div>
	<h2>{gig.name}</h2>
	<Divider />
	{gig.acts && gig.acts.length ?
		<div>
			With performances by: 
			<ul>
				{gig.acts.map(act => <li key={act._id}>{act.name}</li>)}
			</ul>
		</div>
		: ''
	}
</div>

export default class GigPage extends React.Component {
	state = {
		fans: [],  
		gig: {},
		venue: {},
		dialog: false,
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
				this.setState({dialogActs: result.data, dialog: true})
			}
		})
	}
	handleActsEdit = act => {
		console.log("Editing act", act)
		const {editDialog} = this.state
		Object.assign(editDialog, {open: true, errors:{}, act})
		this.setState({dialog:false, editDialog})
	}
	handleActsSelect = act => {
		console.log("Act selected", act)
		const { gig } = this.state
		Object.assign(gig, {act_id: act._id})
		app.service('gigs').patch(gig._id, gig)
		.then(gig => console.log("Gig patched", gig))
		.catch(err => console.error("Most erroneous thing happened", err))
	}
	handleActsCancel = () => {
		this.setState({dialog: false})
	}


	handleActEditCancel = () => {
		this.setState({editDialog: {open: false}})
	}

	handleActEditSubmit = act => {
		if(act._id) {
			//create

		} else {
			// patch
		}
		this.setState({editDialog: {open: false}})
		this.selectAct()
	}

	render() {
		const { gig, venue, fans, dialogActs } =  this.state
		console.log("GIIG", this.state)
		const card = gig.type==='Workshop' ? <WorkshopCard gig={gig} fans={fans}/> : 
			gig.type==='Volunteer' ? <VolunteerCard gig={gig} /> : <PerformanceCard gig={gig} />
		return <Card>
			<CardHeader 
				title={gig.name} 
				subtitle={<GigTimespan gig={gig} />}
				avatar={<Avatar>{gig.type && gig.type.charAt(0)}</Avatar>}/>
			<CardText>
				<p>
					<span className='acts'>{gig.acts && gig.acts.map(a => a.name).join(',')}</span>
					{venue && <span> at the {venue.name}</span>}</p>
				{card}
			</CardText>
			<CardActions>
				{gig.type !== 'Volunteer' && <FlatButton icon={mic} label='Add performer' onTouchTap={this.selectAct}/>}
			</CardActions>
			<Dialog
				title='Acts'
				open={this.state.dialog}
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