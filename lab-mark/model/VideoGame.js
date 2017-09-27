'use strict';

const mongoose = require('mongoose');

const VideoGameSchema = mongoose.Schema({
  title: {type: String, required: true,  unique: true},
  genre: {type: String, required: true},
  console: {type: String, required: true},
  timestamp: {type: Date , default: () => new Date()},
});


module.exports = mongoose.model('VideoGame', VideoGameSchema);

// add static methods to the model (constructor)
