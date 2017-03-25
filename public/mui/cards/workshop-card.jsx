import React from 'react'

import Divider from 'material-ui/Divider'

import ActsList from '../acts-list.jsx'
import styles from '../styles'

const WorkshopCard = ({gig, acts, fans, onMasterEdit, onMasterDelete, onMasterSelect}) => <div>
	<span style={styles.gigType}>{gig.type}</span>
	<h2>{gig.name}</h2>
	<p>{gig.description}</p>
	{gig.acts && gig.acts.length ?
		<div>
			<Divider style={{marginTop:'1em'}} />
			Led by: 
			<ActsList 
					acts={gig.acts} 
					compact={true} 
					onSelect={onMasterSelect}
					onEdit={onMasterEdit}
					onDelete={onMasterDelete}
				/>
		</div>
		: ''
	}
	<Divider style={{marginTop:'1em'}} />
	<div>
		Attending: {fans.length}
		<ul>
			{fans.map(fan => <li key={fan._id}>{fan.user.name || (fan.user.facebook && fan.user.facebook.name)}</li>)}
		</ul>
	</div>
</div>

export default WorkshopCard