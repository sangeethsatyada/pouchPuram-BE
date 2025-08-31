const mongoose = require('mongoose');

const salesSchema = new mongoose.Schema({
  date: { type: String, required: true },
  amount: { type: Number, required: true }
});

module.exports = mongoose.model('Sales', salesSchema);
