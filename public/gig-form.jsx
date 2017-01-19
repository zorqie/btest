import { Button } from 'react-toolbox/lib/button';
import Input from 'react-toolbox/lib/input';

class VenueForm extends React.Component {
	state = { name: '' };	

	updateText(ev) {
		this.setState({ text: ev.target.value });
	},

	sendMessage(ev) {
		// Get the messages service
		const messageService = app.service('messages');
		// Create a new message with the text from the input field
		messageService.create({
			text: this.state.text
		})
		.then(() => this.setState({ text: '' }));

		ev.preventDefault();
	},

	render() {
		return (
			<form className="ui form" onSubmit={this.sendMessage}>
				<div className="ui fluid action input">
					<TextField
						floatingLabelText="Message:"
						fullWidth={true}
						value={this.state.text} 
						onChange={this.updateText}
					/>
					<RaisedButton label='Send' onTouchTap={this.sendMessage}/>
				</div>
			</form>
		);
	}
};