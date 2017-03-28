import React from 'react'

import ActsList from '../acts-list.jsx'

export default function GigActsList({gig, header, ...others}) {
	return <div>
				{gig.acts && gig.acts.length && <div>{header || 'Featuring: '}</div> || null} 
				<ActsList 
					acts={gig.acts} 
					{...others}
				/>
			</div>
	
}