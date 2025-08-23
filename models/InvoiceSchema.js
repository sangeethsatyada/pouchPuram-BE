const { default: mongoose } = require("mongoose");

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    default: () => `INV-${Date.now().toString().slice(-6)}`,
    unique: true
  },
  date: {
    type: String,
    default: () => new Date().toISOString().split('T')[0]
  },
  dueDate: {
    type: String,
    default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  },
  clientName: { type: String, required: true },
  clientEmail: { type: String, required: true },
  clientPhone: { type: String },
  clientAddress: { type: String },
  projectTitle: { type: String, required: true },
  notes: { type: String },
  taxRate: { type: Number, default: 18 },
  discountRate: { type: Number, default: 0 },
  items: [{
    id: String,
    description: String,
    quantity: Number,
    rate: Number,
    amount: Number
  }],
  status: {
    type: String,
    enum: ['Draft', 'Pending', 'Paid', 'Overdue'],
    default: 'Draft'
  }
}, { timestamps: true });

const Invoice = mongoose.model('Invoice', invoiceSchema);

module.exports = Invoice;
