import React from 'react';

import ContentAdd from 'material-ui/svg-icons/content/add';
import ActionSettings from 'material-ui/svg-icons/action/settings';
import CommunicationChatBubble from 'material-ui/svg-icons/communication/chat-bubble';
import CommunicationChatBubbleOutline from 'material-ui/svg-icons/communication/chat-bubble-outline';

import {grey400, darkBlack, lightBlack, lightGreen500} from 'material-ui/styles/colors';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';

import moment from 'moment'

import app from '../main.jsx';
import errorHandler from './err';

const moreButton = (
	<IconButton
		touch={true}
		tooltip="more"
		tooltipPosition="bottom-left"
	>
		<MoreVertIcon color={grey400} />
	</IconButton>
);


class UserItem extends React.Component {
	edit = (e) => this.props.onSelect(this.props.user);
	delete = (e) => {
		e.preventDefault();
		app.service('users').remove(this.props.user._id)
		.catch(err => console.error("Couldn't delete.", err));
		console.log('Deleting... ', this.props.user)
	};
	render() {
		const { user } = this.props;
		const self = user._id === app.get("user")._id;
		console.log("User: ", user);
		const rightIconMenu = (
		  <IconMenu iconButtonElement={moreButton}>
		    <MenuItem onTouchTap={this.edit}>Edit</MenuItem>
		    <MenuItem onTouchTap={this.delete}>Delete</MenuItem>
		  </IconMenu>
		);
		const chatIcon = self ? <ActionSettings /> : user.online ? <CommunicationChatBubble color={lightGreen500}/> : <CommunicationChatBubbleOutline />
		return (
			<ListItem 
				leftIcon={chatIcon}
				onTouchTap={this.edit}
				primaryText={user.name} 
				secondaryText={user.email}
				rightIconButton={rightIconMenu}
			/>
		);
	}
}

export default class UserList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {users:[]};
		// this.handleSelection.bind(this);
	}
	createdListener = user => this.setState({
		users: this.state.users.concat(user)
	});
	removedListener = user => {
		this.setState({users: this.state.users.filter(u => u._id !== user._id)})
	};
	patchedListener = user => {
		console.log("<<<<<<<<<< PATCHED >>>>>>>>>>", user);
		// FIXME update only user perhaps?
		this.fetchUsers();
	}

	componentDidMount() {
		this.fetchUsers();

		// Listen to newly created/removed users
		app.service('users').on('created', this.createdListener);
		app.service('users').on('removed', this.removedListener);
		app.service('users').on('patched', this.patchedListener);
	};
	componentWillUnmount() {
		if(app) {
			app.service('users').removeListener('created', this.createdListener);
			app.service('users').removeListener('removed', this.removedListener);
			app.service('users').removeListener('patched', this.patchedListener);
		}
	}

	fetchUsers = () => {
		app.service('users').find({
			query: {
				$sort: { email: 1 },
				$limit: this.props.limit || 77
			}
		})
		.then(page => this.setState({
			users: page.data
		}))
		.catch(errorHandler);
	}

	handleSelect(u){
		if(this.props.onUserSelected) {
			this.props.onUserSelected(u || {});
		}
	}

	render() {
		console.log(">>>>___USER-LIST");
		return (
			<List >
				{this.state.users.map( u => <UserItem 
												onSelect={this.handleSelect.bind(this, u)} 
												user={u} 
												key={u._id}
											/>
				)}
				{/*<FloatingActionButton secondary onTouchTap={this.handleSelection.bind(this, null)}>
					<ContentAdd />
				</FloatingActionButton>*/}
			</List>
		);
	}
}

