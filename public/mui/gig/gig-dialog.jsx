import React from 'react'

import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'

import GigDialogForm from '../gig-dialog-form.jsx'

export default class GigDialog extends React.Component{
	render() {
		const {open, gig, venues, onClose, onCancel, onSubmit} = this.props
		return <Dialog
				open={open}
				title={gig._id ? null : 'Add activity'}
				actions={[
					<FlatButton label={onCancel ? 'Cancel': 'Close'} onTouchTap={onCancel || onClose} />,
					onSubmit ? <RaisedButton label={gig._id ? 'Save' : 'Add'} primary={true} onTouchTap={onSubmit} /> : null
					]}
				onRequestClose={onClose}
				>
				<GigDialogForm gig={gig} errors={{}} venues={venues}/>
			</Dialog>
	}
}