import React from 'react';

import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Snackbar from 'material-ui/Snackbar';

import moment from 'moment';

import GigList from './gig-list.jsx';

const BLANK_GIG =  { name: '', description: '', type: '', start: new Date(), end: new Date()};

class GigForm extends React.Component {
	constructor(props) {
    	super(props);
		this.state = {gig: BLANK_GIG, gigs: [], snackOpen: false, message: ''};
	}

	handleChange = (e) => {
		const { name, value } = e.target;
		// console.log("Changed: " + name + " -> " + JSON.stringify(value));
		var v = this.state.gig;
		Object.assign(v, {[name] : value});
		this.validate(v);
		this.setState({gig: v});
		// console.log("State: " + JSON.stringify(this.state));
	};
	validate = (gig) => {
		// const v = new mongoose.Document(Gig, GigSchema);//
		// console.log("Validificating: " + JSON.stringify(v));
	};
	componentDidMount() {
    	const app = this.props.feathers || this.props.route.feathers;	
    	const service = app.service('gigs');

		service.find({
			query: {
				$sort: { createdAt: -1 },
				$limit: this.props.limit || 7
			}
		}).then(page => this.setState({
			gigs: page.data,
			gig: page.data[0] || BLANK_GIG
		}))
		.catch(err => {
			console.log("Errified: " + JSON.stringify(err));
		});
		// Listen to newly created messages
		service.on('created', gig => this.setState({
			gigs: this.state.gigs.concat(gig)
		}));
	};

	saveGig = (e) => {
		const v = this.state.gig;
		console.log('Saving gig: ', v);
		
		const app = this.props.feathers || this.props.route.feathers;	// FIXME we should not be passing app as prop
    	const service = app.service('gigs');

		if(this.state.gig._id) {
			service.patch(this.state.gig._id, v)
			.then(() => {
				this.setState({snackOpen: true, message: "Updated gig"}); 
				console.log("Saviated gig: ", v)
			})
			.catch(err => console.error("Errar: ", err));
		} else {
			//create
			console.log("Createning..")
			service.create(v)
			.then(() => {
				this.setState({snackOpen: true, message: "Created gig"}); 
				console.log("Created gig: ", v)
			})
			.catch(err => console.error("Erroir: ", err));
		}
		e.preventDefault();
	};

	handleGigSelection = (v) => {
		// console.log("Handling Gig selection: " + JSON.stringify(v));
		this.setState({gig: v});
	}

	render() {
		return (
			<div>
				<Paper>
					<GigList 
						onGigSelected = {this.handleGigSelection}
						gigs={this.state.gigs} />
				</Paper>
				<form onSubmit={this.saveGig}>
					<TextField 
						name='name'
						hintText='Name'
						floatingLabelText="Name"
						value={this.state.gig.name} 
						onChange={this.handleChange} 
					/>
					<TextField 
						name='type'
						hintText='Gig type'
						floatingLabelText="Type"
						value={this.state.gig.type} 
						onChange={this.handleChange} 
					/>
					<TextField 
						type='date'
						name='start'
						hintText='Gig start'
						floatingLabelText="Start"
						value={moment(this.state.gig.start).format('YYYY-MM-DD')} 
						onChange={this.handleChange} 
					/>
					<TextField 
						type='time'
						name='startTime'
						hintText='Start time'
						floatingLabelText="Start time"
					/>
					<TextField 
						type='date'
						name='end'
						hintText='Gig end'
						floatingLabelText="End"
						value={moment(this.state.gig.end).format('YYYY-MM-DD')} 
						onChange={this.handleChange} 
					/>
					<TextField 
						name='description'
						hintText='Description'
						floatingLabelText="Gig description"
						value={this.state.gig.description} 
						onChange={this.handleChange} 
					/>
					<RaisedButton label='Save' onClick={this.saveGig} primary/>
				</form>
				<Snackbar
					open={this.state.snackOpen}
					message={this.state.message}
					autoHideDuration={4000}
					onRequestClose={this.handleRequestClose}
		        />
			</div>
		);
	}
};

export default GigForm;