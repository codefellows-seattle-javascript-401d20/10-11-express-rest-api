'use strict';

const mongoose = require('mongoose');
const uuid = require('uuid/v1');

const beerSchema = mongoose.Schema({
  id: {type: String, required: false, default: uuid},
  brand: {type: String, required: true,  unique: true},
  type: {type: String, required: true, minlength: 1},
  timestamp: {type: Date, default: () => new Date()},
  abv: {type: Number, required: false, minlength: 1},
});

// add vallidation and hooks to schema

module.exports = mongoose.model('beer', beerSchema);

// add static methods to the model (constructor)
