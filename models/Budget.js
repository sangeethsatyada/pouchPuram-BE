const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  limits: { type: Map, of: Number, default: {} }
});

module.exports = mongoose.model('Budget', budgetSchema);
