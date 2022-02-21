const mongoose = require('mongoose');

const Visitor = mongoose.model('Visitor', new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phone_number: {
    type: String,
    required: true
  },
  queue_line: {
    type: String,
    required: true
  }
}, { timestamps: true }));

module.exports = { Visitor };
