import React from 'react'

import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import {ListItem} from 'material-ui/List'

const Requirement = ({req}) => 
	req && 
	<span>{req.status} - {req.minCount && `Min: ${req.minCount}`} </span>
	|| null

const TicketRule = ({rule}) => <div>
	<div>From status: {rule.status || '<None>'}</div>
	<div>
		{rule.requires 
			&& <div>Requires: {rule.requires.length 
		 			&& rule.requires.map((r, i) => <Requirement key={i} req={r} />)
		 			|| <Requirement req={rule.requires}/>}
		 		</div> 
		}
	</div>
	<ul>
		{rule.actions.map((action, i) => action.name && 
			<ListItem 
				key={i}
				primaryText={action.name}
				secondaryText={action.path || `New status: ${action.newStatus}`}
			>

			</ListItem> 
		)}

	</ul>
</div>

export class EventStrategy extends React.Component {
	render() {
		const { event } = this.props
		console.log("E-vent-E", this.props)
		return <div>
			{event.ticket_rules && event.ticket_rules.map((rule, i) => <TicketRule key={i} rule={rule} />)}
		</div>
	}
}

export default class EventStrategyDialog extends React.Component {
	render() {
		const { event, open, onClose } = this.props
		return <Dialog 
			open={open}
			autoScrollBodyContent={true}
			actions={[<FlatButton label='Close' onTouchTap={onClose} />]}
			onRequestClose={onClose}
			>
			<EventStrategy event={event} />
		</Dialog>
	}
}