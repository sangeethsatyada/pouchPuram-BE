const Report = require('../models/Report');
const Transaction = require('../models/Transaction');

async function getReports(req, res) {
  try {
    const reports = await Report.find();
    res.json({ reports });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}

async function generateReport(req, res) {
  const { date = new Date().toISOString().slice(0, 10), note } = req.body || {};
  try {
    const todayTx = await Transaction.find({ date });
    const income = todayTx.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expense = todayTx.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const net = income - expense;
    const newReport = new Report({ date, income, expense, net });
    await newReport.save();
    res.status(201).json(newReport);
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate report' });
  }
}

module.exports = { getReports, generateReport };
