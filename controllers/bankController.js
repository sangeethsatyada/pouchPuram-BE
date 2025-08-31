// controllers/bankController.js
const Bank = require('../models/Bank');

async function getBank(req, res) {
  try {
    const bank = await Bank.findOne();
    res.json(bank || { cashBalance: 0, bankAccounts: [], adjustments: [], transfers: [] });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}

async function handleBankRequest(req, res) {
  if (req.method === 'POST') {
    const { name, accountType, accountNumber } = req.body;
    if (!name || !accountType || !accountNumber) return res.status(400).json({ error: 'Name, accountType, and accountNumber required' });
    try {
      let bank = await Bank.findOne();
      if (!bank) {
        bank = new Bank({ cashBalance: 0, bankAccounts: [], adjustments: [], transfers: [] });
      }
      const newAccount = {
        id: `acc-${String(bank.bankAccounts.length + 1).padStart(3, '0')}`,
        name,
        balance: 0,
        accountType,
        accountNumber
      };
      bank.bankAccounts.push(newAccount);
      await bank.save();
      return res.status(201).json(newAccount);
    } catch (err) {
      return res.status(500).json({ error: 'Failed to add bank account' });
    }
  }

  const { action, payload } = req.body;
  if (!action || !payload) {
    return res.status(400).json({ error: 'Invalid request' });
  }

  try {
    let bank = await Bank.findOne();
    if (!bank) {
      bank = new Bank({ cashBalance: 0, bankAccounts: [], adjustments: [], transfers: [] });
    }

    if (action === 'adjust') {
      const { target, kind, amount, bankId } = payload;
      const adjAmount = Number(amount);
      if (isNaN(adjAmount) || adjAmount <= 0) return res.status(400).json({ error: 'Invalid amount' });

      let acc;
      if (target === 'cash') {
        acc = { balance: bank.cashBalance };
      } else {
        acc = bank.bankAccounts.find(a => a.id === bankId);
        if (!acc) return res.status(404).json({ error: 'Bank account not found' });
      }

      if (kind === 'subtract' && acc.balance < adjAmount) return res.status(400).json({ error: 'Insufficient funds' });

      if (kind === 'add') {
        acc.balance += adjAmount;
      } else if (kind === 'subtract') {
        acc.balance -= adjAmount;
      } else {
        return res.status(400).json({ error: 'Invalid kind' });
      }

      if (target === 'cash') bank.cashBalance = acc.balance;

      bank.adjustments.push({
        date: new Date().toISOString().slice(0, 10),
        kind,
        target,
        bankId: target === 'bank' ? bankId : null,
        amount: adjAmount
      });

      await bank.save();
      return res.json({ success: true });
    }

    if (action === 'transfer') {
      const { from, to, amount, bankIdFrom, bankIdTo } = payload;
      const trAmount = Number(amount);
      if (isNaN(trAmount) || trAmount <= 0) return res.status(400).json({ error: 'Invalid amount' });

      let fromAcc, toAcc;
      if (from === 'cash') {
        fromAcc = { balance: bank.cashBalance };
      } else {
        fromAcc = bank.bankAccounts.find(a => a.id === bankIdFrom);
        if (!fromAcc) return res.status(404).json({ error: 'From bank account not found' });
      }

      if (to === 'cash') {
        toAcc = { balance: bank.cashBalance };
      } else {
        toAcc = bank.bankAccounts.find(a => a.id === bankIdTo);
        if (!toAcc) return res.status(404).json({ error: 'To bank account not found' });
      }

      if (fromAcc.balance < trAmount) return res.status(400).json({ error: 'Insufficient funds' });

      fromAcc.balance -= trAmount;
      toAcc.balance += trAmount;

      if (from === 'cash') bank.cashBalance = fromAcc.balance;
      if (to === 'cash') bank.cashBalance = toAcc.balance;

      bank.transfers.push({
        date: new Date().toISOString().slice(0, 10),
        from,
        to,
        bankIdFrom: from === 'bank' ? bankIdFrom : null,
        bankIdTo: to === 'bank' ? bankIdTo : null,
        amount: trAmount
      });

      await bank.save();
      return res.json({ success: true });
    }

    return res.status(400).json({ error: 'Unknown action' });
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { getBank, handleBankRequest };
