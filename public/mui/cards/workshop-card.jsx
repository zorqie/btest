import React from 'react'
import { browserHistory } from 'react-router'

import Divider from 'material-ui/Divider'
import { ListItem } from 'material-ui/List'
import FlatButton from 'material-ui/FlatButton'
import FloatingActionButton from 'material-ui/FloatingActionButton'

import app from '../../main.jsx'
import { addIcon } from '../icons.jsx'
import GigTimespan from '../gig-timespan.jsx'
import SessionDialog from './session-dialog.jsx'
import styles from '../styles'
import { Kspan } from '../hacks.jsx'

function FanList({fans}) {
	return <div style={{padding: '1em 0'}} >
				Attending: {fans.length}
				<ul>
					{fans.map(fan => 
						<li key={fan._id}>{fan.user.name || (fan.user.facebook && fan.user.facebook.name)}</li>
					)}
				</ul>
			</div>
}

const viewSession = session => browserHistory.push('/sessions/'+session._id)

function SessionItem({session, onEdit, onDelete, onSelect}) {
	const title = <div>
		<span className='session-name'>{session.name}</span>{' - '}
		<span className='session-desc'>{session.description}</span>
	</div>
	return <ListItem 
				primaryText={title}
				secondaryText={<GigTimespan gig={session} showDuration/>}
				onTouchTap={onSelect.bind(null, session)}
				rightIconButton={<Kspan>
					{onEdit && <FlatButton label='Edit' onTouchTap={onEdit.bind(null, session)}/>}
					{onDelete && <FlatButton label='Delete' onTouchTap={onDelete.bind(null, session)}/>}
				</Kspan>}
			/>
}

export default class WorkshopCard extends React.Component {
	state = {
		loading: true,
		sessions: [],
		dialog: {
			open: false, 
			session: {}, 
			errors: {},
		},
	}
	componentWillMount() {
		app.authenticate().then(this.fetchData)
	}

	componentDidMount() {
		//setup listeners
		app.service('gigs').on('created', this.createdListener)
		app.service('gigs').on('removed', this.removedListener)
		app.service('gigs').on('patched', this.patchedListener)
	}
	componentWillUnmount() {
		//remove listeners
		if(app) {
			app.service('gigs').removeListener('created', this.createdListener)
			app.service('gigs').removeListener('removed', this.removedListener)
			app.service('gigs').removeListener('patched', this.patchedListener)
		}
	}

	fetchData = () => {
		this.setState({loading: true})
		app.service('gigs').find({
			query: { 
				parent: this.props.gig._id, 
				$sort: {start: 1}
			}
		})
		.then(result => this.setState({loading: false, sessions: result.data}))
	}

// Listeners
	createdListener = session => {
		console.log("Created", session)
		console.log("THIS IS", this.props.gig)
		if(session.parent === this.props.gig._id) {
			this.setState({...this.state, sessions: this.state.sessions.concat(session)})
		}
	}
	removedListener = session => {
		if(session.parent === this.props.gig._id) {
			this.setState({...this.state, sessions: this.state.sessions.filter(s => s._id !== session._id)})
		}
	}
	patchedListener = session => {
		if(session.parent === this.props.gig._id) {
			this.fetchData()
		}
	}


	editSession = session => {
		const { dialog } = this.state
		const { gig } = this.props
		const dialogSession = session || Object.assign({}, gig, {parent: gig._id})
		if(!session) {
			// only if clone of gig, delete its id
			delete dialogSession._id
		}
		Object.assign(dialog, {open: true, errors: {}, session: dialogSession})
		this.setState({...this.state, dialog})
	} 

	deleteSession = session => {
		app.service('gigs').remove(session._id)
	}

	dialogCancel = () => {
		this.setState({...this.state, dialog: {open: false, session:{}, errors:{}}})
	}

	dialogSubmit = e => {
		const { dialog } = this.state
		const { session } = dialog
		Object.assign(dialog, {open: false, errors: {}})
		this.setState({...this.state, dialog})
		//
		// TODO if parent has attending or performers
		// it will be left in an inconsistent state
		// 
		if(session._id) {
			//patch
			app.service('gigs').patch(session._id, session)
			// .then(session =>)
		} else {
			//create
			app.service('gigs').create(session)
		}
	}

	render() {
		const {loading, sessions, dialog} = this.state
		const {gig, acts, fans} = this.props

		return !loading && <div>
				<span style={styles.gigType}>{gig.type}</span>
				<h2>{gig.name}</h2>
				<p>{gig.description}</p>
				<Divider style={{marginTop:'1em'}} />
				{sessions.length && 
					<div>
						{sessions.map(session => 
							<SessionItem 
								key={session._id} 
								session={session} 
								onSelect={viewSession} 
								onEdit={this.editSession}
								onDelete={this.deleteSession}
							/>
						)}
					</div>
					||
					<div>
						{acts}
						<Divider style={{marginTop:'1em'}} />
						<FanList fans={fans} />
					</div>
				}
				
				<Divider style={{marginBottom:'1em'}} />
				<FloatingActionButton onTouchTap={this.editSession.bind(this, null)}>{addIcon}</FloatingActionButton>
				<SessionDialog {...dialog} onCancel={this.dialogCancel} onSubmit={this.dialogSubmit} />
			</div>
			|| null
	}
}