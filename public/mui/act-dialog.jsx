import React from 'react'
import { browserHistory } from 'react-router'

import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'

import app from '../main.jsx'
import ActDialogForm from './act-dialog-form.jsx'

export default class ActDialog extends React.Component {
	state = {
		act: Object.assign({}, this.props.act),
		errors: {},
	}	

	componentWillReceiveProps(nextProps) {
		this.setState({act: nextProps.act})
	}

	handleSubmit = () => {
		const {act} = this.state
		const onClose = this.props.onAfterSubmit || this.props.onClose
		if(act.name && act.name.length) {
			
			if(act._id) {
				app.service('acts').patch(act._id, act)
				.then(onClose)
				.catch(err => {
					console.error('Updating acts are acting out', err)
					this.setState({errors: err.errors})
				})
			} else {
				app.service('acts').create(act)
				.then(onClose)
				.catch(err => {
					console.error('Creating acts are acting out', err)
					this.setState({errors: err.errors})
				})
			}
		}
	}

	render() {
		const {act, errors} = this.state
		const {open, onClose} = this.props
		return <Dialog 
				title={act && act._id ? null : 'Add Act'}
				open={open}
				actions={[
					<FlatButton
						label="Cancel"
						onTouchTap={onClose}
					/>,
					<RaisedButton
						label="Save"
						primary={true}
						onTouchTap={this.handleSubmit}
					/>
				]}
				onRequestClose={onClose}
			>
				<ActDialogForm act={act}  errors={errors}/>
			</Dialog>	
	}
}