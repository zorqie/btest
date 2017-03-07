import React from 'react'

import Divider from 'material-ui/Divider'

import ActsList from '../acts-list.jsx'

const styles = {
	acts: {
		fontSize: '18dp',
		fontWeight: 300,
	},
	gigType: {
		fontSize: '12dp',
		fontWeight: '300',
		float: 'right'
	}
}

const WorkshopCard = ({gig, acts, fans, onMasterEdit, onMasterDelete, onMasterSelect}) => <div>
	<span style={styles.gigType}>{gig.type}</span>
	<h2>{gig.name}</h2>
	<p>{gig.description}</p>
	{gig.acts && gig.acts.length ?
		<div>
			<Divider style={{marginTop:'1em'}} />
			Taught by: 
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
			{fans.map(fan => <li key={fan._id}>{fan.user.name}</li>)}
		</ul>
	</div>
</div>

export default WorkshopCard