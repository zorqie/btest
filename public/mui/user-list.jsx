import React from 'react'
import { browserHistory } from 'react-router'

import ContentAdd from 'material-ui/svg-icons/content/add'
import ActionSettings from 'material-ui/svg-icons/action/settings'
import CommunicationChatBubble from 'material-ui/svg-icons/communication/chat-bubble'
import CommunicationChatBubbleOutline from 'material-ui/svg-icons/communication/chat-bubble-outline'

import {grey400, darkBlack, lightBlack, lightGreen500} from 'material-ui/styles/colors'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import IconButton from 'material-ui/IconButton'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import {List, ListItem} from 'material-ui/List'
import Subheader from 'material-ui/Subheader'

import moment from 'moment'

import app from '../main.jsx'
import errorHandler from './err'
import UserItem from './user-list-item.jsx'


export default class UserList extends React.Component {
	constructor(props) {
		super(props)
		this.state = {users:[]}
		// this.handleSelection.bind(this)
	}
	createdListener = user => this.setState({
		users: this.state.users.concat(user)
	})
	removedListener = user => {
		this.setState({users: this.state.users.filter(u => u._id !== user._id)})
	}
	patchedListener = user => {
		console.log("<<<<<<<<<< PATCHED >>>>>>>>>>", user)
		// FIXME update only user perhaps?
		this.fetchUsers()
	}

	componentDidMount() {
		this.fetchUsers()

		// Listen to newly created/removed users
		app.service('users').on('created', this.createdListener)
		app.service('users').on('removed', this.removedListener)
		app.service('users').on('patched', this.patchedListener)
	}
	componentWillUnmount() {
		if(app) {
			app.service('users').removeListener('created', this.createdListener)
			app.service('users').removeListener('removed', this.removedListener)
			app.service('users').removeListener('patched', this.patchedListener)
		}
	}

	fetchUsers = () => {
		app.service('users').find({
			query: {
				$sort: { name: 1, 'facebook.name': 1 },
				$limit: this.props.limit || 77
			}
		})
		.then(page => this.setState({
			users: page.data
		}))
		.catch(errorHandler)
	}

	handleSelect(u){
		if(this.props.onUserSelected) {
			this.props.onUserSelected(u || {})
		} else {
			browserHistory.push('users/'+u._id)
		}
	}

	render() {
		return <List >
				{this.state.users.map( u => 
					<UserItem 
						onSelect={this.handleSelect.bind(this, u)} 
						user={u} 
						key={u._id}
					/>
				)}
			</List>
	}
}

