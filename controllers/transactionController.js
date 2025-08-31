const Transaction = require('../models/Transaction');

exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 });
    const months = {};
    transactions.forEach((tx) => {
      const date = new Date(tx.date);
      const label = date.toLocaleString('default', { year: 'numeric', month: 'short' });
      if (!months[label]) {
        months[label] = { income: 0, expense: 0 };
      }
      months[label][tx.type] += tx.amount;
    });
    const history = Object.entries(months)
      .sort(([a], [b]) => new Date(a + ' 1') - new Date(b + ' 1'))
      .map(([label, values]) => ({ label, ...values }));
    res.json({ items: transactions, history });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.addTransaction = async (req, res) => {
  const { type, amount, category, date, description } = req.body;
  if (!type || isNaN(amount) || !category || !date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  if (type !== 'income' && type !== 'expense') {
    return res.status(400).json({ error: 'Invalid transaction type' });
  }
  try {
    const newTx = new Transaction({
      id: `tx-${Date.now()}`,
      type,
      amount: Number(amount),
      category,
      date,
      description: description || '',
    });
    await newTx.save();
    res.status(201).json(newTx);
  } catch (err) {

    res.status(500).json({ error: 'Failed to add transaction' });
  }
};
