const Sales = require('../models/Sales');

async function getSales(req, res) {
  try {
    const series = await Sales.find().sort({ date: 1 });
    res.json({ series });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}

async function addSale(req, res) {
  const { date, amount } = req.body;
  if (!date || !amount) return res.status(400).json({ error: 'Date and amount required' });
  try {
    const newSale = new Sales({ date, amount: Number(amount) });
    await newSale.save();
    res.status(201).json(newSale);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add sale' });
  }
}

module.exports = { getSales, addSale };
