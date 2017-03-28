import React from 'react'

import ActsList from '../acts-list.jsx'

export default function GigActsList({gig, header, onSelect, onEdit, onDelete}) {
	return gig.acts && gig.acts.length &&
			<div>
				<div>{header || 'Featuring: '}</div> 
				<ActsList 
					acts={gig.acts} 
					compact={true} 
					onSelect={onSelect}
					onEdit={onEdit}
					onDelete={onDelete}
				/>
			</div>
			|| null
		
	
}