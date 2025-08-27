// Enhanced Invoice Schema with Payment Information
const mongoose = require("mongoose")

const itemSchema = new mongoose.Schema({
  size: { type: String, required: true },
  variants: { type: Number, required: true, min: 1 },
  description: { type: String, required: true },
  quantity: { type: Number, required: true, min: 0 },
  rate: { type: Number, required: true, min: 0 },
  amount: { type: Number, required: true, min: 0 },
})

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, required: true, unique: true },
    date: { type: Date, required: true },
    dueDate: { type: Date, required: true },
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: "Client" },
    clientName: { type: String, required: true },
    clientEmail: { type: String },
    clientPhone: { type: String },
    clientAddress: { type: String },
    projectTitle: { type: String, required: true },
    notes: { type: String },
    taxRate: { type: Number, default: 18 },
    discountRate: { type: Number, default: 0 },
    paymentMode: {
      type: String,
      enum: ["cash", "bank_transfer", "upi", "card", "cheque", "online"],
      required: true,
    },
    paymentType: {
      type: String,
      enum: ["full", "advance"],
      required: true,
    },
    advanceAmount: { type: Number, default: 0 },
    items: [itemSchema],
    status: { type: String, enum: ["Draft", "Pending", "Paid", "Overdue"], default: "Draft" },
    subtotal: { type: Number, required: true },
    discountAmount: { type: Number, default: 0 },
    taxAmount: { type: Number, required: true },
    total: { type: Number, required: true },
  },
  { timestamps: true },
)

module.exports = mongoose.model("Invoice", invoiceSchema)
