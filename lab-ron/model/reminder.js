'use strict';

const mongoose = require('mongoose');

const reminderSchema = mongoose.Schema({
  task: { type: String, required: true },
  done: { type: Boolean, required: true, default: false },
  priority: { type: String, required: false },
  timestamp: { type: Date, default: () => new Date() },
});

module.exports = mongoose.model('reminder', reminderSchema);