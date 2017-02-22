import React from 'react';

import ContentAdd from 'material-ui/svg-icons/content/add';

import {grey400, darkBlack, lightBlack} from 'material-ui/styles/colors';
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

const iconButtonElement = (
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
		app.service('users').remove(this.props.user._id);
		console.log('Deleting... ', this.props.user)
	};
	render() {
		const { user } = this.props;
		console.log("User: ", user);
		const rightIconMenu = (
		  <IconMenu iconButtonElement={iconButtonElement}>
		    <MenuItem onTouchTap={this.edit}>Edit</MenuItem>
		    <MenuItem onTouchTap={this.delete}>Delete</MenuItem>
		  </IconMenu>
		);

		return (
			<ListItem 
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
	componentDidMount() {
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

		// Listen to newly created/removed users
		app.service('users').on('created', this.createdListener);
		app.service('users').on('removed', this.removedListener);
	};
	componentWillUnmount() {
		if(app) {
			app.service('users').removeListener('created', this.createdListener);
			app.service('users').removeListener('removed', this.removedListener);	
		}
	}
	handleSelect(u){
		this.props.onUserSelected(u || {})
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

