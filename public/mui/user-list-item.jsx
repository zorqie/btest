import React from 'react'

import {grey400, darkBlack, lightBlack, lightGreen500} from 'material-ui/styles/colors'
import ActionSettings from 'material-ui/svg-icons/action/settings'
import CommunicationChatBubble from 'material-ui/svg-icons/communication/chat-bubble'
import CommunicationChatBubbleOutline from 'material-ui/svg-icons/communication/chat-bubble-outline'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'

import FloatingActionButton from 'material-ui/FloatingActionButton'
import IconButton from 'material-ui/IconButton'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import { ListItem } from 'material-ui/List'

import app from '../main.jsx'

const moreButton = (
	<IconButton
		touch={true}
		tooltip="more"
		tooltipPosition="bottom-left"
	>
		<MoreVertIcon />
	</IconButton>
)


export default function UserItem({user, onSelect, onEdit}) {
	const self = user._id === app.get("user")._id
	console.log("UserItem: ", user)
	const userMenu = user.facebookId ? null : (
		<IconMenu iconButtonElement={moreButton}>
			<MenuItem onTouchTap={onEdit}>Edit</MenuItem>
			{/*<MenuItem onTouchTap={this.delete}>Delete</MenuItem>*/}
		</IconMenu>
	) 
	const chatIcon = self 
		? <ActionSettings /> 
		: user.online 
			? <CommunicationChatBubble color={lightGreen500}/> 
			: <CommunicationChatBubbleOutline />
	const roles = user.roles && user.roles.join(', ') || ' '
	return (
		<ListItem 
			leftIcon={chatIcon}
			onTouchTap={onSelect}
			primaryText={user.name || (user.facebook && user.facebook.name)} 
			secondaryText={roles}
			rightIconButton={userMenu}
		/>
	)
}
