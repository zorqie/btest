import React from 'react';
import { browserHistory } from 'react-router';

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

const blankGig = () => { return { name: '', description: '', type: '', start: new Date(), end: new Date()}};

const moreIcon = (
	<IconButton touch={true} >
		<MoreVertIcon color={grey400} />
	</IconButton>
);


const GigItem = ({gig, onSelect, onEdit, onDelete}) => {
	const rightIconMenu = (
		<IconMenu iconButtonElement={moreIcon}>
			<MenuItem onTouchTap={onEdit}>Edit</MenuItem>
			<MenuItem onTouchTap={onDelete}>Delete</MenuItem>
		</IconMenu>
	);

	// const deleteIcon2 = <IconButton iconClassName="material-icons" tooltip="Delete" onTouchTap={this.delete}>delete</IconButton>;
	const startDate = moment(gig.start).format('ddd M/D/YY');
	const endDate = moment(gig.end).format('ddd M/D/YY');
	const text = <span>
		{startDate} at {moment(gig.start).format('h:mm a')}
		<i> to </i> 
		{endDate==startDate ? '' : endDate + ' at '}{moment(gig.end).format('h:mm a')}
	</span>;
	return (
		<ListItem 
			onTouchTap={onSelect}
			primaryText={gig.name} 
			secondaryText={text}
			rightIconButton={rightIconMenu}
		/>
	);
}


export default class GigList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {gigs:[]};
		// this.handleSelection.bind(this);
	}
	componentDidMount() {
		app.service('gigs').find({
			query: {
				$sort: { start: 1 },
				$limit: this.props.limit || 77
			}
		})
		.then(page => this.setState({
			gigs: page.data
		}))
		.catch(errorHandler);

		// Listen to newly created/removed gigs
		app.service('gigs').on('created', this.createdListener);
		app.service('gigs').on('removed', this.removedListener);
	};
	componentWillUnmount() {
		if(app) {
			app.service('gigs').removeListener('created', this.createdListener);
			app.service('gigs').removeListener('removed', this.removedListener);	
		}
	}

	createdListener = gig => this.setState({
		gigs: this.state.gigs.concat(gig)
	});
	removedListener = gig => {
		this.setState({gigs: this.state.gigs.filter(g => g._id !== gig._id)})
	};

	select = gig => browserHistory.push('/events/'+gig._id);

    edit = gig => this.props.onGigSelected(gig || blankGig());
	delete = gig => app.service('gigs').remove(this.props.gig._id);

	render() {
		console.log("___GIG-LIST");
		return (
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
				<FloatingActionButton secondary onTouchTap={this.select.bind(this, null)}>
					<ContentAdd />
				</FloatingActionButton>
			</List>
		);
	}
}

