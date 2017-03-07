import React from 'react'
import moment from 'moment'

const GigTimespan = ({gig, showRelative, showDuration, hideDates, ...others}) => {
	const mNow = moment();
	const mStart = moment(gig.start);
	const dateFormat = mNow.year() == mStart.year() ? 'ddd M/D' : 'ddd M/D/YY';
	const startDate = mStart.format(dateFormat);
	const endDate = gig.end && moment(gig.end).format(dateFormat);
	const relative = showRelative ? ' (' + moment().to(mStart) + ')' : '';

	const duration = (showDuration && gig.end) ? 
		<span className='gig-duration'>{moment.duration(moment(gig.end).diff(mStart)).humanize()}</span> :
		''
	// {...others} passes the styling on
	return <span {...others}>
			{!hideDates && <span>{startDate} at</span>} {mStart.format('h:mm a')} 
			{endDate && (<span> {'\u2013'} {endDate===startDate ? '' : endDate + ' at '}{moment(gig.end).format('h:mm a')}</span>)}
			{relative}
			{duration}
		</span>;
}

export default GigTimespan