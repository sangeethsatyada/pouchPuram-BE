const validateInvoice = (req, res, next) => {
  const { invoiceNumber, date, dueDate, clientName, projectTitle, items } = req.body;

  if (!invoiceNumber || !date || !dueDate || !clientName || !projectTitle || !items || !Array.isArray(items)) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  for (const item of items) {
    if (!item.size || !item.variants || !item.description || item.quantity < 0 || item.rate < 0) {
      return res.status(400).json({ message: 'Invalid item data' });
    }
  }

  next();
};

module.exports = { validateInvoice };
