const mongoose = require('mongoose');

const adjustmentSchema = new mongoose.Schema({
  date: String,
  kind: String,
  target: String,
  bankId: String,
  amount: Number
});

const transferSchema = new mongoose.Schema({
  date: String,
  from: String,
  to: String,
  bankIdFrom: String,
  bankIdTo: String,
  amount: Number
});

const bankAccountSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  balance: { type: Number, required: true },
  accountType: { type: String, required: true },
  accountNumber: { type: String, required: true }
});

const bankSchema = new mongoose.Schema({
  cashBalance: { type: Number, required: true },
  bankAccounts: [bankAccountSchema],
  adjustments: [adjustmentSchema],
  transfers: [transferSchema]
});

module.exports = mongoose.model('Bank', bankSchema);
