import React from 'react'
import { browserHistory } from 'react-router'

import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'

import app from '../main.jsx'
import ActsList from './acts-list.jsx'
import ActDialogForm from './act-dialog-form.jsx'

const blankDialog = {open: false, act: {}, errors:{}}

export default class ActsPage extends React.Component {
	state = {
		acts: [],
		dialog: blankDialog
	}
	componentWillMount() {
		this.fetchData()
	}
	componentDidMount() {
		app.service('acts').on('created', this.fetchData)
		app.service('acts').on('patched', this.fetchData)
		app.service('acts').on('removed', this.fetchData)
	}
	componentWillUnmount() {
		app.service('acts').removeListener('created', this.fetchData)
		app.service('acts').removeListener('patched', this.fetchData)
		app.service('acts').removeListener('removed', this.fetchData)
	}

	fetchData = () => {
		app.service('acts').find({query:{$sort: {name: 1}, $limit: 20}})
		.then(result => this.setState({acts: result.data}))
		.catch(err => console.error('Acts are acting out', err))
	}

	viewAct = act => browserHistory.push('/acts/'+act._id)

	handleEdit = act => {
		const dialog = {open: true, errors:{}, act: Object.assign({}, act)} // create new copy of act
		this.setState({...this.state, dialog})
	}
	handleDelete = act => {
		console.log("Deleting", act) // must ensure not in any gig first?
									 // or force-remove from gigs?
		app.service('acts').remove(act._id)
		.catch(err => console.error('Deleting acts are acting out', err))
	}
	handleEditCancel = () => {
		const dialog = Object.assign({}, blankDialog)
		this.setState({...this.state, dialog})
	}
	handleEditSubmit = () => {
		
		const {act} = this.state.dialog

		if(act.name && act.name.length) {
			console.log("Saving", act)
			if(act._id) {
				app.service('acts').patch(act._id, act)
				.then(() => this.handleEditCancel)
				.catch(err => console.error('Updating acts are acting out', err))
			} else {
				app.service('acts').create(act)
				.then(() => this.handleEditCancel)
				.catch(err => console.error('Creating acts are acting out', err))
			}
		}
	}
	render() {
		const {acts, dialog} = this.state
		return <div>
			<ActsList 
				acts={acts} 
				allowAdd={true} 
				onSelect={this.viewAct}
				onEdit={this.handleEdit} 
				onDelete={this.handleDelete}
			/>
			<Dialog 
				title={dialog.act._id ? null : 'Add Act'}
				open={dialog.open}
				actions={[
					<FlatButton
						label="Cancel"
						onTouchTap={this.handleEditCancel}
					/>,
					<FlatButton
						label="Save"
						primary={true}
						onTouchTap={this.handleEditSubmit}
					/>
				]}
				onRequestClose={this.handleEditCancel}
			>
				<ActDialogForm act={dialog.act}  errors={dialog.errors}/>
			</Dialog>	
		</div>
	}
}