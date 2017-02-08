import { browserHistory } from 'react-router';

export default function(err) {
	console.error("Errorized: " + JSON.stringify(err));
	if(err.code === 401) {
		console.log("Moving to login");
		browserHistory.push('/login');
	}
}