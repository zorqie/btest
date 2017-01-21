'use strict';

// venue-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const venueSchema = new Schema({
  name: { type: String, required: true },
  capacity: { 
  	type: Number, 
  	required: true, 
  	min: [0, "Don't be negative"] 
  },
  parent: { type: String, required: false }, // should be required
  createdAt: { type: Date, 'default': Date.now },
  updatedAt: { type: Date, 'default': Date.now }
});

venueSchema.methods.findChildren = function(cb) {
  return this.model('venue').find({ parent: this._id }, cb);
};

const venueModel = mongoose.model('venue', venueSchema);

module.exports = venueModel;