import React from 'react'
import { browserHistory } from 'react-router';

import Avatar from 'material-ui/Avatar'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'
import {List, ListItem} from 'material-ui/List'
import Divider from 'material-ui/Divider'
import Dialog from 'material-ui/Dialog'

import ActsList from './acts-list.jsx'
import ActDialog from './act-dialog.jsx'
import ActSelectDialog from './act-select-dialog.jsx'
import GigTimespan from './gig-timespan.jsx'
import GigTitle from './gig-title.jsx'

import app from '../main.jsx'
import { mic } from './icons.jsx'

import PerformanceCard from './cards/performance-card.jsx'
import WorkshopCard from './cards/workshop-card.jsx'
import VolunteerCard from './cards/volunteer-card.jsx'
import GigActsList from './cards/gig-acts-list.jsx'

function GigCard({gig, fans, actsList}) {
	return gig.type==='Workshop' 
			? 	<WorkshopCard 
					gig={gig} 
					fans={fans}
					acts={actsList}
				/> 
				: gig.type==='Volunteer' 
					? <VolunteerCard gig={gig} /> 
					: <PerformanceCard 
						gig={gig} 
						acts={actsList}
					/>
}

export default class GigDetailsPage extends React.Component {
	state = {
		fans: [],  
		gig: {},
		selectDialog: false,
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

	componentWillReceiveProps(nextProps) {
		if(nextProps.params.gigId !== this.props.gigId) {
			this.setState({
				fans: [],  
				gig: {},
				selectDialog: false,
				editDialog: {open: false, act: {}, errors: {}},
			})
			app.authenticate().then(this.fetchData) // TODO hack to force fetch after we're out of here...
		}
	}

	
	fetchData = () => {
		const { gigId } =  this.props.params
		console.log("Fetching", gigId)
		app.service('gigs').get(gigId)
		.then(gig => {	
			document.title=gig.name	
			this.setState({gig})
		})
		.then(() => app.service('fans')
			.find({
				query:{
					gig_id:gigId, 
					status: 'Attending'
				}
			})
			.then(result => this.setState({fans: result.data}))
		)
	} 

	selectAct = () => {
		this.setState({selectDialog: true, editDialog:{open: false}})
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

	micButton = <FlatButton icon={mic} label='Add performer' onTouchTap={this.selectAct}/>

	render() {
		const { gig, fans } =  this.state
		// console.log("GIIG", this.state)			
		
		return <div>
					{gig._id && <div>
							<CardHeader 
								title={<GigTitle gig={gig} />} 
								subtitle={<GigTimespan gig={gig} showDuration={true} />}
								avatar={<Avatar>{gig.type && gig.type.charAt(0)}</Avatar>}>
							</CardHeader>
							<CardText>
								<GigCard 
									gig={gig} 
									fans={fans} 
									actsList={<GigActsList 
										gig={gig} 
										onSelect={this.viewActDetails}
										onEdit={this.replaceAct} 
										onDelete={this.removeAct} 
										allowAdd={true}
										addButton={this.micButton}
									/>}
								/>
							</CardText>
							<CardActions>
								
							</CardActions>			
						</div>
					}

					<ActSelectDialog 
						open={this.state.selectDialog}
						onCancel={this.handleActsCancel}
						onSelect={this.handleActsSelect} 
						allowAdd={true}
						onEdit={this.handleActsEdit}
					/>
					
					<ActDialog 
						act={this.state.editDialog.act} 
						open={this.state.editDialog.open} 
						onClose={this.handleActEditCancel} 
						onAfterSubmit={this.selectAct}
					/>
				</div>
	}
}