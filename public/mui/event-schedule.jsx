import React from 'react'
import moment from 'moment'
import { Link } from 'react-router'

import LinearProgress from 'material-ui/LinearProgress'

import app from '../main.jsx'
import styles from './styles'
import {jobsByDate, sequence, hours24} from './hacks.jsx'

const startTimeSort = (a, b) => +(a.start > b.start) || +(a.start === b.start) - 1

const tspan = (job, {_id, name, start, end}) => 
	<span>
		<Link to={'/shifts/'+_id}>
		{moment(start).format('HH:mm')}-{moment(end).format('HH:mm')}
		</Link>
		{job.name!==name && name}
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
				jobsByDate(jobs).map(({date, jobs}) => 
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
										sequence(span).map(i => {
											const slot = hours[hour][i]
											const starts = slot && slot.show && slot.show.starts
											const c = 'j-shift ' + (slot && slot.show && (slot.show.starts ? 'j-start ' : '') + (slot.show.ends ? 'j-end' : ''))
											return slot 
												&& <td key={hour+i} className={c}>{starts && tspan(job, slot.shift)}</td> 
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