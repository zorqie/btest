import React from 'react'
import { browserHistory } from 'react-router'

import Divider from 'material-ui/Divider'
import FlatButton from 'material-ui/FlatButton'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import {List, ListItem} from 'material-ui/List'
import Subheader from 'material-ui/Subheader'

import app from '../main.jsx'
import { addIcon } from './icons.jsx'
import UserRolesDialog from './user-roles-dialog.jsx'
import ActDialog from './act-dialog.jsx'
import { Kspan } from './hacks.jsx'

export default class UserCard extends React.Component {
	state = {
		user: {},
		rolesDialog: {
			open: false, 
		},
		actDialog: {
			open: false, 
			act: {},
		}
	}
	componentWillMount() {
		app.authenticate().then(this.fetchData)
	}

	componentDidMount() {
		//setup listeners
		app.service('users').on('patched', this.patchedListener)
	}
	componentWillUnmount() {
		//remove listeners
		if(app) {
			app.service('users').removeListener('patched', this.patchedListener)
		}
	}

	fetchData = () => {
		const {userId} = this.props.params
		app.service('users').get(userId)
		.then(user => this.setState({user}))
	}

// Listeners
	
	patchedListener = role => {
		// TODO user fetch as listener
		this.fetchData()
		
	}

	//??? 
	editRole = () => {
		this.setState({...this.state, rolesDialog: {open: true}})
	} 

	addRole = role => {
		this.setState({...this.state, rolesDialog: {open: false}})
		const {user} = this.state
		if(!user.roles || user.roles.indexOf(role) < 0) {
			const roles = user.roles && user.roles.concat(role) || [role]
			const u = Object.assign(user, {roles})
			app.service('users').patch(user._id, u)
			if(role==='master' || role==='performer') {
				// TODO check that we don't have one already
				app.service('acts').create({name: user.name, user_id: user._id})
				.then(act => this.setState({actDialog: {open: true, act}}))
			}
		}
	}

	deleteRole = role => {
		// TODO make sure we don't remove the last sysadmin
		const userId = this.state.user._id
		if(!(userId === app.get("user")._id && role === 'sysadmin')) {
			const roles = this.state.user.roles.filter(r => r !== role)
			const u = Object.assign(this.state.user, {roles})
			app.service('users').patch(userId, u)
		} else {
			app.emit('notify', 'Cannot remove role "sysadmin" from self.')
		}
	}

	dialogClose = () => {
		this.setState({...this.state, rolesDialog: {open: false}})
	}

	closeActDialog = () => {
		this.setState({actDialog: {open: false, act: {}}})
	}

	render() {
		const { user, rolesDialog, actDialog } = this.state
		return <div style={{margin:'2em'}}>
			<h2>{user.name || (user.facebook && user.facebook.name)}</h2>
			<p>{user.email}</p>
			<List>
				<Subheader>Roles</Subheader>
				{user.roles && user.roles.map(role => 
					<ListItem 
						key={role} 
						primaryText={role}
						secondaryText=' '
						rightIconButton={
							<FlatButton label="Delete" onTouchTap={this.deleteRole.bind(this, role)} />
						}

					/>
				)}
			</List>
			<FloatingActionButton onTouchTap={this.editRole}>{addIcon}</FloatingActionButton>
			<UserRolesDialog 
				{...rolesDialog} 
				onClose={this.dialogClose} 
				onSelect={this.addRole} 
			/>
			<ActDialog {...actDialog} onClose={this.closeActDialog}/>
		</div>
	}
}
