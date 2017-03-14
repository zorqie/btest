import React from 'react'
import DropzoneComponent from 'react-dropzone-component'

import app from '../main.jsx'

const componentConfig = {
    iconFiletypes: ['.jpg', '.png', '.gif'],
    showFiletypeIcon: true,
    postUrl: '/uploads'
}
const djsConfig = { 
	paramName: "uri",
	acceptedFiles: 'image/*',
	autoProcessQueue: true,
	uploadMultiple: false,
}

const uploadprogress =  (file, progress) => {
	console.log("Progress of file", file);
	console.log("Progress", progress)
	if(progress===100) {
		console.log("XHR", file.xhr)
	}
} 

const eventHandlers = { 
	addedfile: file => console.log("Added", file),
	uploadprogress
}

export default class ImageUpload extends React.Component {
	state={
		files: []
	}
	componentDidMount() {
		app.service('uploads').on('created', file => {
			console.log('Received file created event!', file)
		})
	}
	
	render() {
		const {files} = this.state
		return <DropzoneComponent config={componentConfig}
                       eventHandlers={eventHandlers}
                       djsConfig={djsConfig} />
	}
}