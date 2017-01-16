'use strict';

// src\services\message\hooks\timestamp.js
//
// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/hooks/readme.html

const defaults = {};

module.exports = function(options) {
	options = Object.assign({}, defaults, options);

	return function(hook) {
		const usr = hook.params.user;
		const txt = hook.data.text;
		hook.data = {
			text: txt,
			createdBy: usr._id,
			createdAt: Date.now()
		}
	};
};
