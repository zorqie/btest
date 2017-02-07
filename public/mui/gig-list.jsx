import React from 'react';

import ContentAdd from 'material-ui/svg-icons/content/add';
import ActionDelete from 'material-ui/svg-icons/action/delete';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import IconButton from 'material-ui/IconButton';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';

import moment from 'moment'

const BLANK_GIG = { name: '', description: '', type: '', start: new Date(), end: new Date()};

class GigItem extends React.Component {
	render() {
		const clack = function(e) {
			console.log('Editing perhaps. ', this.props.gig);
		}
		const cleck = () => this.props.onSelect(this.props.gig);
		
		const editIcon = <IconButton iconClassName="material-icons" tooltip="Edit" onClick={clack.bind(this)}>edit</IconButton>;
		const deleteIcon2 = <IconButton iconClassName="material-icons" tooltip="Delete" onClick={clack.bind(this)}>delete</IconButton>;
		const deleteIcon = <IconButton><ActionDelete /></IconButton>;
		const text = <span>
			<b>{moment(this.props.gig.start).format('MM/DD/YY')}</b> to <b>{moment(this.props.gig.end).format('MM/DD/YY')}</b>
		</span>;
		return (
			<ListItem 
				onClick={cleck.bind(this)}
				primaryText={this.props.gig.name} 
				secondaryText={text}
				rightIcon={deleteIcon2}
			/>
		);
	}
}

export default class GigList extends React.Component {
	constructor(props) {
		super(props);
		// this.handleSelection.bind(this);
	}
	handleSelection(v){
		console.log("Handling... ", v);
		this.props.onGigSelected(v)
	}
    
	render() {
		
		return (
			<List >
				<Subheader>Gigs</Subheader>
				{this.props.gigs.map((v) => (
					<GigItem onSelect={this.handleSelection.bind(this, v)} gig={v} key={v._id}/>)
				)}
				<FloatingActionButton secondary onClick={this.handleSelection.bind(this, BLANK_GIG)}>
					<ContentAdd />
				</FloatingActionButton>
			</List>
		);
	}
}

