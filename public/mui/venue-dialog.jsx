import React from 'react';

import AutoComplete from 'material-ui/AutoComplete';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

const BLANK_VENUE =  { name: '', capacity: '', description: '', type: '' };

const focus = input => input && input.focus();

export default class VenueDialogForm extends React.Component {
	constructor(props) {
    	super(props);
		this.state = {
			open: false,
			venue: props.venue || BLANK_VENUE,
			types: props.types
		};
		// console.log("Dialog venue: ", this.state.venue);
	}

	handleChange = (e) => {
		const { name, value } = e.target;
		// console.log("Changed: " + name + " -> " + JSON.stringify(value));
		let {venue} = this.state;
		Object.assign(venue, {[name] : value});
		this.validate(venue);
		this.setState({...this.state, venue});
		
	};
	handleNewRequest = (text, i) => {
		console.log("Selected: ", text);
	}
	handleUpdateInput = (text, data, params) => {
		// console.log("Updated: ", text);
		// console.log("Data: ", data);
		// console.log("Params: ", params);
		this.handleChange({target:{name:'type', value: text}});
	}
	validate = (venue) => {
		// const v = new mongoose.Document(venue, venueSchema);//
		// console.log("Validificating: " + JSON.stringify(v));
	};

	render() {
		const {venue} = this.state;
		const {errors} = this.props;
		// console.log("Dialog state: ", venue);
		return (
				<form onSubmit={this.props.handleSubmit}>
					<TextField 
						name='name'
						floatingLabelText='Name'
						errorText={(errors.name && errors.name.message) || ''}
						value={venue.name || ''} 
						onChange={this.handleChange} 
						ref={focus}
					/>
					<TextField 
						name='description'
						floatingLabelText='Description'
						value={venue.description || ''} 
						onChange={this.handleChange} 
						fullWidth={true}
					/>
					<AutoComplete 
						name='type'
						floatingLabelText='Type'
						errorText={(errors.type && errors.type.message) || ''}
						searchText={venue.type || ''}
						value={venue.type}
						onChange={this.handleChange}
						openOnFocus={true}
						filter={AutoComplete.caseInsensitiveFilter}
						onNewRequest={this.handleNewRequest}
						onUpdateInput={this.handleUpdateInput}
						dataSource={this.props.types}
						maxLength={30}
					/>
					<TextField 
						name='capacity'
						type='number' min='0'
						floatingLabelText="Max capacity"
						errorText={(errors.capacity && errors.capacity.message) || ''}
						value={venue.capacity || ''} 
						onChange={this.handleChange} 
					/>
				</form>
		);
	}
};