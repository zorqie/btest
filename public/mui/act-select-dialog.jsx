import React from 'react'

import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'

import app from '../main.jsx'
import ActsList from './acts-list.jsx'

export default class ActSelectDialog extends React.Component {
	state = {
		acts: []
	}
	componentWillReceiveProps(nextProps) {
		if(nextProps.open) {
			this.fetchData()
		}
	}
	fetchData = () => {
		app.service('acts').find()
		.then(result => {
			if(result.total > 0) {
				this.setState({acts: result.data})
			}
		})
	}
	render() {
		const { acts } = this.state
		const { open, onCancel, onSelect, allowAdd, onEdit } = this.props
		return <Dialog
					title='Choose an Act'
					open={open}
					actions={[
						<FlatButton
							label="Close"
							primary={true}
							onTouchTap={onCancel}
						/>
					]}
					onRequestClose={onCancel}
					autoScrollBodyContent={true}
				>
				<ActsList acts={acts} 
					onSelect={onSelect} 
					allowAdd={allowAdd}
					onEdit={onEdit}/>
			</Dialog>
	}
}
