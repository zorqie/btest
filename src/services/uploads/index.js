'use strict';

const blobService = require('feathers-blob');
const dauria = require('dauria');
const fs = require('fs-blob-store');
const multer = require('multer');
const path = require('path');


const multipartMiddleware = multer();

module.exports = function() {
	const app = this;

	// Initialize a FileSystem storage,
	const blobStorage = fs(path.resolve(__dirname, app.get('uploads')));
	const options = {
		Model: blobStorage,
		id: 'id'
	};

	app.use('/uploads', 
		multipartMiddleware.single('uri'),
		function(req, res, next) {
			// console.log("REQUESTED feathers===>>>", req.feathers)
			// console.log("REQUESTED file===>>>", req.file)
			req.feathers.file = req.file;
			next();
		},
		blobService(options)
	);

	// TODO move to ./hooks/
	app.service('/uploads').before({
		create: [
			function(hook) {
				if (!hook.data.uri && hook.params.file){
					const file = hook.params.file;
					const uri = dauria.getBase64DataURI(file.buffer, file.mimetype);
					hook.data = {uri: uri};
				}
			}
		]
	});
}

