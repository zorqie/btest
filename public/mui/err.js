import { browserHistory } from 'react-router';

export default function(err) {
	console.error("Errorized: " + JSON.stringify(err));
	if(err.code === 401) {
		browserHistory.push('/login');
	}
}