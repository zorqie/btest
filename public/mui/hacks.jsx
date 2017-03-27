import React from 'react'
import moment from 'moment'

// TODO this is likely nonsense
export const blankGig = () => {
	const now = new Date()
	return { 
		name: '', 
		description: '', 
		venue: '',
		act: '',
		type: '', 
		start: now.setMinutes(0,0,0), 
		end: new Date(now).setHours(now.getHours()+1,0,0,0)
	}
}

// hacky way to trick Material UI to allow a span of buttons instead of a single button
export const Kspan = ({onKeyboardFocus, ...others}) => <span {...others}/>; 

export const gigDuration = gig => {
	if (!gig || !gig.end) return '' // not null so input can still be controlled
	const dur = moment.duration(moment(gig.end).diff(moment(gig.start)))
	// console.log("Dyur", dur)
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

export const formatYMD = t => moment(t).format('YYYY-MM-DD')

export const sequence = n => Array.from(Array(n).keys())

export const hours24 = sequence(24)

function shouldShow(date, hour, job) {
	const t = moment(date).add(hour, 'hours')
	const mStart = moment(job.start)
	// console.log("T: ", t.format("YYYY-MM-DD HH:mm"))
	const starts = mStart.isSame(t, 'hour')
	const mEnd  = job.end && moment(job.end)
	// console.log("end: ", mEnd.format("YYYY-MM-DD HH:mm"))
	const ends = mEnd && mEnd.diff(t, 'hours') == 1 //mEnd.isSame(t, 'hour')
	
	const show = t.isSameOrAfter(mStart, 'hour') && t.isBefore(mEnd, 'hour')
	return show ? {show, starts, ends} : null
}

export function jobsByDate(jobs) {
	let dates = new Map()
	jobs.forEach(job => {
		if(job.shifts.length) {
			job.shifts.forEach((shift, i) => {
				const date = formatYMD(shift.start)
				const t = dates.get(date) || {date, jobs: new Map()}
				const tjob = Object.assign({}, t.jobs.get(job._id) || {job, span: 1, hours: []})
				hours24.forEach(hour => {
					const show = shouldShow(date, hour, shift)
					let shown = 1
					if(show) {
						shown++
						const slot = tjob.hours[hour] || new Array(i)
						slot[i] = {shift, show}
						tjob.hours[hour] = slot
					}
					tjob.span = Math.max(tjob.span, shown)
				})
				t.jobs.set(job._id, tjob)
				dates.set(date, t)	
			})
		} else {
			const date = formatYMD(job.start)
			const t = dates.get(date) || {date, jobs: new Map}
			const tjob = Object.assign({}, t.jobs.get(job._id) || {job, span: 1, hours: []})
			hours24.forEach(hour => {
				const show = shouldShow(date, hour, job)
				if(show) {
					tjob.hours[hour] = Array.of({shift: job, show})
				}
			})
			t.jobs.set(job._id, tjob)
			dates.set(date, t)	
		}
	})

	const tables = Array.from(dates.entries(), e => {
		const {date, jobs} = e[1]
		return {
			date: moment(date), 
			jobs: Array.from(jobs.entries(), j => {
				const {job, span, hours} = j[1]
				const compact = hours.map(h => h.length > span ? squeeze(h, span) : h)
				return {job, span, hours: compact}
			})
		}
	})
	console.log("TABLES>>>>", tables)
	return tables
}

function squeeze(hour, n) {
	const a = new Array(n)
	hour.forEach((h, i) => a[i%n] = h)
	return a
}



export const hacks = { blankGig, gigDuration, focus, Kspan }

export default hacks