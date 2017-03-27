import React from 'react'
import moment from 'moment'

export const blankGig = () => {
	// TODO this is likely nonsense, we shouldn't be using this
	return { 
		name: '', 
		description: '', 
		venue: '',
		act: '',
		type: '', 
		start: new Date(), 
		end: new Date()
	}
}

export const Kspan = ({onKeyboardFocus, ...others}) => <span {...others}/>; 

export const gigDuration = gig => {
	if (!gig || !gig.end) return '' // not null so input can still be controlled
	const dur = moment.duration(moment(gig.end).diff(moment(gig.start)))
	console.log("Dyur", dur)
	// TODO rounding. Sometimes 1:00 to 2:00 is 59 minutes, sometimes 60 ???
	const d = dur.days()
	const days = d > 0 ? d > 1 ? d + ' days ' : '1 day ' : ''
	const h = dur.hours()
	const hours = h > 0 ? h > 1 ? h + ' hours ' : '1 hour ' : ''
	const m = dur.minutes()
	const minutes = m > 0 ? m > 1 ? m + ' minutes' : '1 minute' : ''
	const duration = days + hours + minutes
	return duration
}

export const focus = input => input && input.focus()

export const hacks = { blankGig, gigDuration, focus, Kspan }

export default hacks