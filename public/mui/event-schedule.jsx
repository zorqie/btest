import React from 'react'
import moment from 'moment'
import { Link } from 'react-router'

import LinearProgress from 'material-ui/LinearProgress'

import app from '../main.jsx'
import styles from './styles'

const startTimeSort = (a, b) => +(a.start > b.start) || +(a.start === b.start) - 1

const format = t => moment(t).format('YYYY-MM-DD')

const days = gigs => {
	let formatted = []
	gigs.forEach(g => formatted = formatted.concat(g.shifts.length ? g.shifts.map(s=> format(s.start)) : format(g.start)))
	// console.log("Formated", formatted)
	const unique = formatted.filter((e, i, a) => a.indexOf(e)===i)
	// console.log("Unique", unique)
	const sorted = unique.sort()
	const dates = sorted.map(s => moment(s, 'YYYY-MM-DD'))

	return dates
}

const daysJobs = (date, jobs) => {
	return jobs.filter(j => date.isSame(j.start, 'day'))
}

const empty = n => Array.from(Array(n).keys())
const hours24 = empty(24)

// const JobCell = ({job, date, hour, ...others}) => {
// 	const t = moment(date).add(hour, 'hours')
// 	const mStart = moment(job.start)
// 	// console.log("T: ", t.format("YYYY-MM-DD HH:mm"))
// 	const start = mStart.isSame(t, 'hour')
// 	const mEnd  = job.end && moment(job.end)
// 	// console.log("end: ", mEnd.format("YYYY-MM-DD HH:mm"))
// 	const end = mEnd && mEnd.isSame(t, 'hour')
// 	const show = t.isSameOrAfter(mStart, 'hour') && t.isBefore(mEnd, 'hour')
// 	const shifts = job.shifts && job.shifts.length
// 	return <td  className={(show ? 'j-shift ' : '') + (start ? 'j-start' : end ? 'j-end' : '')}>
// 		{start && <span>{mStart.format('hh:mm a')}-{mEnd && mEnd.format('hh:mm a')}</span>}
// 		{show && <div className='j-shift'> </div>}
// 	</td>
// }

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

function prepareTables(jobs) {
	if(jobs && !jobs.length) return []
	let tables = days(jobs).map(date => {
		let header = []
		let body = hours24.map(hour => {
			let row = []
			jobs.forEach((job, j) => {
				let shifts = []
				if(job.shifts && job.shifts.length) {
					job.shifts.forEach((shift, i) => {
						if(shouldShow(date, hour, shift)) {
							shifts = shifts.concat({shift, j, i})
						}
					})
				} else if(shouldShow(date, hour, job)) {
					shifts = shifts.concat({shift: job, j, i: 1})
				}
				if(shifts.length) {
					row = row.concat({job, shifts})
					header = header.filter(h => h.job._id!==job._id).concat({job, j})
				} 
			}) 
			return row
		})
		const table = {header, body}
		console.log("TABLE", table)
		return {date, header, body}
	})	
	return tables
}

function byDate(jobs) {
	let tables = []
	let dates = new Map()
	jobs.forEach(job => {
		if(job.shifts.length) {
			job.shifts.forEach((shift, i) => {
				const date = format(shift.start)
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
			const date = format(job.start)
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

	tables = Array.from(dates.entries(), e => {
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
	// console.log("TABLES>>>>", tables)
	return tables
}

function squeeze(hour, n) {
	const a = new Array(n)
	hour.forEach((h, i) => a[i%n] = h)
	return a
}

const JobHeader = ({job, ...others}) => {
	const shifts = job.shifts && job.shifts.length
	return <th colSpan={shifts}>{job.name}</th> 
}

const tspan = ({_id, start, end}) => 
	<span>
		<Link to={'/shifts/'+_id}>
		{moment(start).format('HH:mm')}-{moment(end).format('HH:mm')}
		</Link>
	</span>


export default class VolunteerTable extends React.Component {
	state = {
		total: 100,
		loaded: 0,
		jobs: [],
	}
	componentWillMount() {
		const {eventId, type} = this.props.params
		app.service('gigs').find({
			query: {
				parent: eventId,
				type: type || 'Volunteer',
				$sort: {start: 1}
			}
		})
		.then(jobs => {
			this.setState({total: jobs.total})
			jobs.data.forEach(job => {
				app.service('gigs').find({
					query: {
						parent: job._id,
						$sort: {start: 1}
					}
				})
				.then(shifts => {
					Object.assign(job, {shifts: shifts.data})
					this.setState(prev => {
						return { 
							loaded: prev.loaded + 1, 
							jobs: prev.jobs.concat(job) 
						}
					})
				})
			})
		})
	}

	render() {
		const { jobs, total, loaded } = this.state
		const loading = loaded != total
		// console.log('Schedule', this.state )
		
		return <div>
			{ loading && 
				<LinearProgress 
					mode='determinate'
					max={total}
					value={loaded}
				/> 
				|| 
				byDate(jobs).map(({date, jobs}) => 
				<table key={date} className='gig-schedule'>
					<thead>
						<tr>
							<th colSpan={jobs.length+1} style={styles.scheduleDate}>{date.format('MMM D, dddd')}</th>
						</tr>
						<tr>
							<th></th>
							{jobs.map(({job, span}) => 
								<th key={job._id} colSpan={span}>
									<Link to={'/gigs/'+job._id}>{job.name}</Link>
								</th>
							)}
						</tr>
					</thead>
					<tbody>
						{hours24.map(hour => 
							<tr key={hour}>
								<td>{hour}:00</td>
								{jobs.map(({hours, job, span}) => {
									return hours[hour] && 
										empty(span).map(i => {
											const slot = hours[hour][i]
											const starts = slot && slot.show && slot.show.starts
											const c = 'j-shift ' + (slot && slot.show && (slot.show.starts ? 'j-start' : slot.show.ends ? 'j-end' : ''))
											return slot 
												&& <td key={hour+i} className={c}>{starts && tspan(slot.shift)}</td> 
												|| <td key={hour+i}> </td>
										})
										|| <td key={job._id+hour} colSpan={span}> </td>
								})}
							</tr>
						)}
					</tbody>
				</table>
			)}				
		</div>
	}
}