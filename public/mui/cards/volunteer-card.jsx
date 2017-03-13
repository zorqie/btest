import React from 'react'
import { browserHistory } from 'react-router'

import Divider from 'material-ui/Divider'
import FlatButton from 'material-ui/FlatButton'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import {ListItem} from 'material-ui/List'

import app from '../../main.jsx'
import { addIcon } from '../icons.jsx'
import ActsList from '../acts-list.jsx'
import GigTimespan from '../gig-timespan.jsx'
import ShiftDialog from './shift-dialog.jsx'
import { Kspan } from '../hacks.jsx'

const styles = {
	gigType: {
		fontSize: '12dp',
		fontWeight: '300',
		float: 'right'
	}
}

export default class VolunteerCard extends React.Component {
	state = {
		shifts: [],
		dialog: {
			open: false, 
			shift: {}, 
			errors: {},
		},
	}
	componentWillMount() {
		app.authenticate().then(this.fetchData)
	}

	componentDidMount() {
		//setup listeners
		app.service('gigs').on('created', this.createdListener)
		app.service('gigs').on('removed', this.removedListener)
		app.service('gigs').on('patched', this.patchedListener)
	}
	componentWillUnmount() {
		//remove listeners
		if(app) {
			app.service('gigs').removeListener('created', this.createdListener)
			app.service('gigs').removeListener('removed', this.removedListener)
			app.service('gigs').removeListener('patched', this.patchedListener)
		}
	}
	fetchData = () => {
		app.service('gigs').find({
			query: { 
				parent: this.props.gig._id, 
				$sort: {start: 1}
			}
		})
		.then(result => this.setState({shifts: result.data}))
	}

// Listeners
	createdListener = shift => {
		console.log("Created", shift)
		console.log("THIS IS", this.props.gig)
		if(shift.parent === this.props.gig._id) {
			this.setState({...this.state, shifts: this.state.shifts.concat(shift)})
		}
	}
	removedListener = shift => {
		if(shift.parent === this.props.gig._id) {
			this.setState({...this.state, shifts: this.state.shifts.filter(s => s._id !== shift._id)})
		}
	}
	patchedListener = shift => {
		if(shift.parent === this.props.gig._id) {
			this.fetchData()
		}
	}

	viewShift = shift => browserHistory.push('/shifts/'+shift._id)

	editShift = shift => {
		console.log("Editshifting", shift)
		const { dialog } = this.state
		const { gig } = this.props
		const dialogShift = shift || Object.assign({}, gig, {parent: gig._id})
		if(!shift) {
			// only if clone of gig, delete its id
			delete dialogShift._id
		}
		Object.assign(dialog, {open: true, errors: {}, shift: dialogShift})
		this.setState({...this.state, dialog})
	} 

	deleteShift = shift => {
		app.service('gigs').remove(shift._id)
	}

	dialogCancel = () => {
		this.setState({...this.state, dialog: {open: false, shift:{}, errors:{}}})
	}
	dialogSubmit = e => {
		const { dialog } = this.state
		const { shift } = dialog
		Object.assign(dialog, {open: false, errors: {}})
		this.setState({...this.state, dialog})
		if(shift._id) {
			//patch
			app.service('gigs').patch(shift._id, shift)
			// .then(shift =>)
		} else {
			//create
			app.service('gigs').create(shift)
		}
	}
	render() {
		const { gig } = this.props 
		const { shifts, dialog } = this.state
		return <div>
			<span style={styles.gigType}>Volunteer opportunity</span> 
			<h2>{gig.name}</h2>
			<h3>{gig.description}</h3>
			<ul>
				{shifts.map(shift => 
					<ListItem 
						key={shift._id} 
						primaryText={<GigTimespan gig={shift} />}
						onTouchTap={this.viewShift.bind(this, shift)}
						rightIconButton={
							<Kspan>
								<FlatButton label="Edit" onTouchTap={this.editShift.bind(this, shift)} />
								<FlatButton label="Delete" onTouchTap={this.deleteShift.bind(this, shift)} />
							</Kspan>
						}

					/>
				)}
			</ul>
			<FloatingActionButton onTouchTap={this.editShift.bind(this, null)}>{addIcon}</FloatingActionButton>
			<ShiftDialog {...dialog} onCancel={this.dialogCancel} onSubmit={this.dialogSubmit} />
		</div>
	}
}
