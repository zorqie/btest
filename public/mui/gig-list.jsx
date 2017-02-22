import React from 'react';

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

const iconButtonElement = (
  <IconButton
    touch={true}
    tooltip="more"
    tooltipPosition="bottom-left"
  >
    <MoreVertIcon color={grey400} />
  </IconButton>
);


class GigItem extends React.Component {
	edit = (e) => this.props.onSelect(this.props.gig);
	delete = (e) => {
		e.preventDefault();
		app.service('gigs').remove(this.props.gig._id);
		console.log('Deleting... ', this.props.gig)
	};
	render() {
		const { gig } = this.props;
		const rightIconMenu = (
		  <IconMenu iconButtonElement={iconButtonElement}>
		    <MenuItem onTouchTap={this.edit}>Edit</MenuItem>
		    <MenuItem onTouchTap={this.delete}>Delete</MenuItem>
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
				onTouchTap={this.edit}
				primaryText={gig.name} 
				secondaryText={text}
				rightIconButton={rightIconMenu}
			/>
		);
	}
}

export default class GigList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {gigs:[]};
		// this.handleSelection.bind(this);
	}
	createdListener = gig => this.setState({
		gigs: this.state.gigs.concat(gig)
	});
	removedListener = gig => {
		this.setState({gigs: this.state.gigs.filter(g => g._id !== gig._id)})
	};
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
	handleSelection(v){
		this.props.onGigSelected(v || blankGig())
	}
    
	render() {
		console.log("___GIG-LIST");
		return (
			<List >
				{this.state.gigs.map((v) => (
					<GigItem onSelect={this.handleSelection.bind(this, v)} gig={v} key={v._id}/>)
				)}
				<FloatingActionButton secondary onTouchTap={this.handleSelection.bind(this, null)}>
					<ContentAdd />
				</FloatingActionButton>
			</List>
		);
	}
}

