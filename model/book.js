'use strict';

const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
  title: {type: String, required: true},
  author: {type: String, required: true},
  description: {type: String, required: true, minlength: 10},
  publisher: {type: String},
});

module.exports = mongoose.model('book', bookSchema);
