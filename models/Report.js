const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  date: { type: String, required: true },
  income: { type: Number, required: true },
  expense: { type: Number, required: true },
  net: { type: Number, required: true }
});

module.exports = mongoose.model('Report', reportSchema);
