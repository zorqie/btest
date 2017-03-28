import React from 'react'

import Divider from 'material-ui/Divider'

import styles from '../styles'

export default function WorkshopCard({gig, acts, fans}) { 
	return <div>
		<span style={styles.gigType}>{gig.type}</span>
		<h2>{gig.name}</h2>
		<p>{gig.description}</p>
		<Divider style={{marginTop:'1em'}} />
		{acts}
		<Divider style={{marginTop:'1em'}} />
		<div>
			Attending: {fans.length}
			<ul>
				{fans.map(fan => 
					<li key={fan._id}>{fan.user.name || (fan.user.facebook && fan.user.facebook.name)}</li>
				)}
			</ul>
		</div>
	</div>
}