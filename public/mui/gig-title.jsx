import React from 'react'

export default function GigTitle({gig}) {
	return <span>
		<span className='gig-acts'>{gig.acts && gig.acts.map(a => a.name).join(', ')}</span>
		{gig.venue && <span> at the <span className='gig-venue'>{gig.venue.name}</span></span>}
	</span>
}