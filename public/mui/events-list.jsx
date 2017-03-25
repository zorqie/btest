import React from 'react'
import { browserHistory } from 'react-router'

import ContentAdd from 'material-ui/svg-icons/content/add'

import {grey400, darkBlack, lightBlack} from 'material-ui/styles/colors'
import Avatar from 'material-ui/Avatar'
import Divider from 'material-ui/Divider'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import IconButton from 'material-ui/IconButton'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import SocialPublicIcon from 'material-ui/svg-icons/social/public'
import ActionLockIcon from 'material-ui/svg-icons/action/lock'
import ActionLockOpenIcon from 'material-ui/svg-icons/action/lock-open'
import {List, ListItem} from 'material-ui/List'
import Subheader from 'material-ui/Subheader'

import app from '../main.jsx';
import errorHandler from './err';
import GigTimespan from './gig-timespan.jsx'

const blankGig = () => { return { name: '', description: '', type: '', start: new Date(), end: new Date()}};

const moreIcon = <IconButton touch={true} >
					<MoreVertIcon color={grey400} />
				 </IconButton>

const publish = gig => {
	app.authenticate().then(() => 
		app.service('gigs').patch(gig._id, {public: !gig.public}))
}

const GigItem = ({gig, onSelect, onEdit, onDelete}) => {
	const rightIconMenu = 
		<IconMenu iconButtonElement={moreIcon}>
			<MenuItem onTouchTap={onEdit}>Edit</MenuItem>
			{!gig.public && <MenuItem onTouchTap={onDelete}>Delete</MenuItem>}
			<Divider />
			<MenuItem onTouchTap={publish.bind(null, gig)}>{gig.public?'Make private': 'Publish'}</MenuItem>
		</IconMenu>
	return (
		<ListItem 
			leftIcon={gig.public ? <ActionLockOpenIcon /> : <ActionLockIcon />}
			onTouchTap={onSelect}
			primaryText={gig.name} 
			secondaryText={<GigTimespan gig={gig} />}
			rightIconButton={rightIconMenu}
		/>
	);
}


export default class EventsList extends React.Component {
	state = { gigs: [] }
	
	componentDidMount() {
		app.authenticate()
		.then(this.fetchData)	
		.catch(errorHandler)

		// Listen to newly created/removed gigs
		app.service('gigs').on('created', this.createdListener)
		app.service('gigs').on('patched', this.fetchData)
		app.service('gigs').on('removed', this.removedListener)
	}
	componentWillUnmount() {
		if(app) {
			app.service('gigs').removeListener('created', this.createdListener)
			app.service('gigs').removeListener('patched', this.fetchData)
			app.service('gigs').removeListener('removed', this.removedListener)	
		}
	}

	fetchData = () => {
		app.service('gigs').find({
			query: {
				parent: {$exists: false},
				$sort: { start: 1 },
				$limit: this.props.limit || 77
			}
		})
		.then(page => this.setState({
			gigs: page.data
		}))
	}

	createdListener = gig => this.setState({
		gigs: this.state.gigs.concat(gig)
	})
	removedListener = gig => {
		this.setState({gigs: this.state.gigs.filter(g => g._id !== gig._id)})
		const gigService = app.service('gigs')
		app.emit('notify', gig.name + " deleted.", () => gigService.create(gig) )
	}

	select = gig => browserHistory.push('/events/'+gig._id)

    edit = gig => this.props.onEdit(gig || blankGig())

	delete = gig => {
		app.service('gigs').find({query:{parent: gig._id}})
		.then(result => {
			console.log("result", result)
			if(result.total > 0) {
				app.emit('notify', "Can't delete, children present.")
				console.log("Can't delete. Event details", result)
			} else {				
				app.service('gigs').remove(gig._id)
			}
		})
	}

	render() {
		return <div>
			<List >
				{this.state.gigs.map(
					g => <GigItem 
						onSelect={this.select.bind(this, g)} 
						onEdit={this.edit.bind(this, g)}
						onDelete={this.delete.bind(this, g)}
						gig={g} 
						key={g._id}
					/>
				)}
				<FloatingActionButton secondary onTouchTap={this.edit.bind(this, null)}>
					<ContentAdd />
				</FloatingActionButton>
			</List>

		</div>
	}
}

