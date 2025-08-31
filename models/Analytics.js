const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  categorySales: [{
    category: String,
    amount: Number
  }],
  regionProfit: [{
    region: String,
    profit: Number
  }],
  makers: [{
    name: String,
    spend: Number,
    orders: Number
  }]
});

module.exports = mongoose.model('Analytics', analyticsSchema);
