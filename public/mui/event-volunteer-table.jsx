import React from 'react'
import moment from 'moment'

import app from '../main.jsx'
import styles from './styles'

const startTimeSort = (a, b) => +(a.start > b.start) || +(a.start === b.start) - 1

const days = gigs => {
	const formatted = gigs.map(g => moment(g.start).format('YYYY-MM-DD'))
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

const hours = Array.from(Array(24).keys())

const JobCell = ({job, date, hour, ...others}) => {
	const t = moment(date).add(hour, 'hours')
	const mStart = moment(job.start)
	// console.log("T: ", t.format("YYYY-MM-DD HH:mm"))
	const start = mStart.isSame(t, 'hour')
	const mEnd  = job.end && moment(job.end)
	// console.log("end: ", mEnd.format("YYYY-MM-DD HH:mm"))
	const end = mEnd && mEnd.isSame(t, 'hour')
	const show = t.isSameOrAfter(mStart, 'hour') && t.isBefore(mEnd, 'hour')
	const shifts = job.shifts && job.shifts.length
	return <td  className={(show ? 'j-shift ' : '') + (start ? 'j-start' : end ? 'j-end' : '')}>
		{start && <span>{mStart.format('hh:mm a')}-{mEnd && mEnd.format('hh:mm a')}</span>}
		{show && <div className='j-shift'> </div>}
	</td>
}

function shouldShow(date, hour, job) {
	const t = moment(date).add(hour, 'hours')
	const mStart = moment(job.start)
	// console.log("T: ", t.format("YYYY-MM-DD HH:mm"))
	// const starts = mStart.isSame(t, 'hour')
	const mEnd  = job.end && moment(job.end)
	// console.log("end: ", mEnd.format("YYYY-MM-DD HH:mm"))
	// const ends = mEnd && mEnd.isSame(t, 'hour')
	
	return t.isSameOrAfter(mStart, 'hour') && t.isBefore(mEnd, 'hour')
}

function prepareTable(date, jobs) {
	let header = []
	const table = hours.map(hour => {
		let row = []
		jobs.forEach(job => {
			let shifts = []
			if(job.shifts && job.shifts.length) {
				job.shifts.forEach(shift => {
					if(shouldShow(date, hour, shift)) {
						shifts = shifts.concat(shift)
					}
				})
			} else if(shouldShow(date, hour, job)) {
				shifts = shifts.concat(job)
			}
			if(shifts.length) {
				row = row.concat({job, shifts})
			}
		}) 
		return row
	})

	return table
}

const JobHeader = ({job, ...others}) => {
	const shifts = job.shifts && job.shifts.length
	return <th colSpan={shifts}>{job.name}</th> 
}

export default class VolunteerTable extends React.Component {
	state = {
		gigs: [],
		jobs: [],
	}
	componentDidMount() {
		const {eventId} = this.props.params
		app.service('gigs').find({
			query: {
				parent: eventId,
				type: 'Volunteer'
			}
		})
		.then(jobs => {
			jobs.data.forEach(job => {
				app.service('gigs').find({
					query: {
						parent: job._id
					}
				})
				.then(shifts => {
					Object.assign(job, {shifts: shifts.data})
					this.setState({
						jobs: this.state.jobs.concat(job),
						gigs: this.state.gigs.concat(shifts.data)
					})
				})
			})
		})
		// .then(masters => {
		// 	console.log("JOBS", masters)
		// 	app.service('gigs').find({
		// 		query: {
		// 			parent: {$in: masters.data.map(g => g._id)},
		// 			// $sort: {start: 1}
		// 		}
		// 	})
		// 	.then(shifts => {
		// 		console.log("SHIFTS", shifts)
		// 		const gigs = shifts.data
		// 		const jobnames = masters.data.map(g => g.name).filter((e, i, a) => a.indexOf(e)===i)

		// 		const formatted = shifts.data.map(g => moment(g.start).format('YYYY-MM-DD'))
		// 		// console.log("Formated", formated)
		// 		const unique = formatted.filter((e, i, a) => a.indexOf(e)===i)
		// 		// console.log("Unique", unique)
		// 		const sorted = unique.sort()
		// 		const dates = sorted.map(s => moment(s, 'YYYY-MM-DD'))

		// 		this.setState({gigs, dates, jobs, jobnames})
		// 	})
		// })
	}

	render() {
		const { gigs, jobs } = this.state
		console.log('Schedule')
		days(jobs).forEach(date => console.log("Prepared", prepareTable(date, jobs)))
		return <div>
			Here comes the table.
			{jobs.length && days(jobs).map(date =>	
				<table key={date} className='gig-schedule'>
					<thead >
						<tr>
							<th colSpan={3} style={styles.scheduleDate}>{date.format('MMM D, dddd')}</th>
						</tr>
						<tr>
							<th></th>
							{daysJobs(date, jobs).map(job =>
								<JobHeader key={job._id} job={job} />
							)}
						</tr>
					</thead>
					<tbody>
						{hours.map((e, i) => 
							<tr key={i} >
								<td>{i}:00</td>
								{daysJobs(date, jobs).map(job =>
									job.shifts && job.shifts.length
									? job.shifts.map(shift => <JobCell key={shift._id} job={shift} date={date} hour={i}/>)
									: <JobCell key={job._id} job={job} date={date} hour={i}/>
								)}
							</tr>
						)}
					</tbody>
				</table>
			)}
			{/*jobs.sort(startTimeSort).map(job => 
				<li key={job._id}>
					{job.name}: {moment(job.start).format('hh:mm a')} - {job.end && moment(job.end).format('hh:mm a')}
					<ul>
						{job.shifts && job.shifts.map(shift =>
							<li key={shift._id}>{moment(shift.start).format('hh:mm a')}</li>
						)}
					</ul>
				</li>
			)*/}
		</div>
	}
}