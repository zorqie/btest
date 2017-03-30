import React from 'react'

import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import {ListItem} from 'material-ui/List'

const StatusInfo = ({info}) => <ListItem>
	Status: <b>{info.status || '<None>'}</b>
	<p style={{marginLeft:'2em'}}>
		{info.text}
	</p>
</ListItem>

export class EventInfo extends React.Component {
	render() {
		const { event } = this.props
		console.log("E-vent-E", this.props)
		return <div>
			{event.info && event.info.map((info, i) => <StatusInfo key={i} info={info} />)}
		</div>
	}
}

export default class EventInfoDialog extends React.Component {
	render() {
		const { event, open, onClose } = this.props
		return <Dialog 
			open={open}
			onRequestClose={onClose}
			actions={[<FlatButton label='Close' onTouchTap={onClose} />]}
			>
			<EventInfo event={event} />
		</Dialog>
	}
}