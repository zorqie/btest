import React from 'react'

import ActsList from '../acts-list.jsx'

export default function GigActsList({gig, header, ...others}) {
	return gig.acts && gig.acts.length &&
			<div>
				<div>{header || 'Featuring: '}</div> 
				<ActsList 
					acts={gig.acts} 
					{...others}
				/>
			</div>
			|| null
		
	
}