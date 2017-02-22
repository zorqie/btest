import { browserHistory } from 'react-router';

export default function(err) {
	if(err.code === 401) {
		console.error("ACCESS DENIED. Moving to login");
		browserHistory.push('/login');
	} else if(err.code === 404) {
		console.error("Your looking in the wrong place for the wrong thing", err);
		browserHistory.push('/nonesuch');
	} else {
		console.error("Errified: ", err);
		console.error("Errorized: " + JSON.stringify(err));
	}
}