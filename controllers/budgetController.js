const Budget = require('../models/Budget');

async function getBudget(req, res) {
  try {
    const budget = await Budget.findOne();
    res.json(budget || { limits: {} });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}

async function setBudgetLimit(req, res) {
  const { category, limit } = req.body;
  if (!category || isNaN(limit)) return res.status(400).json({ error: 'Invalid category or limit' });
  try {
    let budget = await Budget.findOne();
    if (!budget) {
      budget = new Budget({ limits: {} });
    }
    budget.limits.set(category, Number(limit));
    await budget.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to set budget' });
  }
}

module.exports = { getBudget, setBudgetLimit };
