import React from 'react'

import Divider from 'material-ui/Divider'

import ActsList from '../acts-list.jsx'

const PerformanceCard = ({gig, acts}) => 
	<div>
		<h2>{gig.name}</h2>
		<p>{gig.description}</p>
		<Divider style={{marginTop: '1em'}}/>
		{acts}
	</div>

export default PerformanceCard