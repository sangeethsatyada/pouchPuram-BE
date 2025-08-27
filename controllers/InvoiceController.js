const express = require("express")
const nodemailer = require("nodemailer")
const Invoice = require("../models/InvoiceSchema")

const dotenv = require("dotenv")
dotenv.config()

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_PASSWORD,
  },
})



// Get all invoices
const getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find().populate("clientId", "name email phone address")
    res.json({ data: invoices })
  } catch (error) {
    res.status(500).json({ message: "Error fetching invoices", error: error.message })
  }
}

// Get single invoice
const getInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate("clientId", "name email phone address")
    if (!invoice) return res.status(404).json({ message: "Invoice not found" })
    res.json({ data: invoice })
  } catch (error) {
    res.status(500).json({ message: "Error fetching invoice", error: error.message })
  }
}

// Create invoice
const addInvoice = async (req, res) => {
  try {
    const invoiceData = req.body

    // Calculate financial totals
    invoiceData.subtotal = invoiceData.items.reduce((sum, item) => sum + item.quantity * item.rate, 0)
    invoiceData.discountAmount = (invoiceData.subtotal * (invoiceData.discountRate || 0)) / 100
    invoiceData.taxAmount = ((invoiceData.subtotal - invoiceData.discountAmount) * (invoiceData.taxRate || 18)) / 100
    invoiceData.total = invoiceData.subtotal - invoiceData.discountAmount + invoiceData.taxAmount

    const invoice = new Invoice(invoiceData)
    await invoice.save()

    res.status(201).json({ id: invoice._id, message: "Invoice created successfully" })
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: "Error creating invoice", error: error.message })
  }
}

const sendReceipt = async (req, res) => {
  try {
    const { invoiceId, clientEmail, clientName, advanceAmount, invoiceNumber, projectTitle, paymentMode } = req.body

    if (!clientEmail) {
      return res.status(400).json({ message: "Client email is required" })
    }

    // Create professional HTML email template
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #374151 0%, #111827 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .receipt-box { background: white; padding: 25px; border-radius: 8px; border-left: 4px solid #10b981; margin: 20px 0; }
          .amount { font-size: 28px; font-weight: bold; color: #10b981; text-align: center; margin: 20px 0; }
          .details { background: white; padding: 20px; border-radius: 8px; margin: 15px 0; }
          .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
          .detail-row:last-child { border-bottom: none; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
          .success-badge { background: #10b981; color: white; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🧾 Payment Receipt</h1>
            <div class="success-badge">✓ Advance Payment Received</div>
          </div>

          <div class="content">
            <div class="receipt-box">
              <h2 style="margin-top: 0; color: #374151;">Dear ${clientName},</h2>
              <p>Thank you for your advance payment! We have successfully received your payment for the following invoice:</p>

              <div class="amount">₹${Number(advanceAmount).toLocaleString()}</div>

              <div class="details">
                <div class="detail-row">
                  <span><strong>Invoice Number:</strong></span>
                  <span>${invoiceNumber}</span>
                </div>
                <div class="detail-row">
                  <span><strong>Project:</strong></span>
                  <span>${projectTitle}</span>
                </div>
                <div class="detail-row">
                  <span><strong>Payment Mode:</strong></span>
                  <span>${paymentMode}</span>
                </div>
                <div class="detail-row">
                  <span><strong>Payment Type:</strong></span>
                  <span>Advance Payment</span>
                </div>
                <div class="detail-row">
                  <span><strong>Date:</strong></span>
                  <span>${new Date().toLocaleDateString()}</span>
                </div>
              </div>

              <p><strong>Next Steps:</strong></p>
              <ul>
                <li>We will begin work on your project immediately</li>
                <li>The remaining balance will be due upon project completion</li>
                <li>You will receive regular updates on project progress</li>
                <li>Final invoice will be sent upon delivery</li>
              </ul>
            </div>

            <div class="footer">
              <p>This is an automated receipt. Please keep this for your records.</p>
              <p>If you have any questions, please don't hesitate to contact us.</p>
              <p><strong>Thank you for choosing our services!</strong></p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: clientEmail,
      subject: `Payment Receipt - Invoice ${invoiceNumber} | Advance Payment Confirmed`,
      html: htmlContent,
      text: `Dear ${clientName},

Thank you for your advance payment of ₹${Number(advanceAmount).toLocaleString()} for Invoice ${invoiceNumber}.

Project: ${projectTitle}
Payment Mode: ${paymentMode}
Payment Type: Advance Payment (50%)
Date: ${new Date().toLocaleDateString()}

We will begin work on your project immediately. The remaining balance will be due upon project completion.

Thank you for choosing our services!

Best regards,
Your Business Team`,
    }

    await transporter.sendMail(mailOptions)
    res.json({ message: "Receipt sent successfully" })
  } catch (error) {
    console.error("Email sending error:", error)
    res.status(500).json({ message: "Error sending receipt", error: error.message })
  }
}


const sendInvitation = async (req, res) => {
  console.log("Not rhis")
  try {
    const { clientName, clientEmail } = req.body;

    if (!clientEmail) {
      return res.status(400).json({ message: "Client email is required" });
    }

    // Create professional HTML email template
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #374151 0%, #111827 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .receipt-box { background: white; padding: 25px; border-radius: 8px; border-left: 4px solid #10b981; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
          .success-badge { background: #10b981; color: white; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Thank You for Your Enquiry</h1>
            <div class="success-badge">✓ Enquiry Received</div>
          </div>

          <div class="content">
            <div class="receipt-box">
              <h2 style="margin-top: 0; color: #374151;">Dear ${clientName},</h2>
              <p>Greetings from Pouchpuram!</p>
              <p>Thank you for contacting Pouchpuram. We have received your enquiry and thank you for giving us the opportunity to serve you.</p>
              <p>A member of our business team will be in touch with you shortly to discuss your needs and provide further assistance.</p>
              <p>Thank you for considering Pouchpuram. We look forward to serving you and appreciate the trust you've placed in us.</p>
            </div>

            <div class="footer">
              <p>Sincerely,</p>
              <p><strong>Pouchpuram Team</strong></p>
              <p>pouch.puram@gmail.com</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: clientEmail,
      subject: `Enquiry Received - Thank You for Contacting Pouchpuram`,
      html: htmlContent,
      text: `Dear ${clientName},

Greetings from Pouchpuram!

Thank you for contacting Pouchpuram. We have received your enquiry and thank you for giving us the opportunity to serve you.

A member of our business team will be in touch with you shortly to discuss your needs and provide further assistance.

Thank you for considering Pouchpuram. We look forward to serving you and appreciate the trust you've placed in us.

Sincerely,
Pouchpuram Team
pouch.puram@gmail.com`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "Enquiry confirmation sent successfully" });
  } catch (error) {
    console.error("Email sending error:", error);
    res.status(500).json({ message: "Error sending confirmation", error: error.message });
  }
};

// Update invoice
const updateInvoice = async (req, res) => {
  try {
    const invoiceData = req.body

    // Recalculate financial totals
    invoiceData.subtotal = invoiceData.items.reduce((sum, item) => sum + item.quantity * item.rate, 0)
    invoiceData.discountAmount = (invoiceData.subtotal * (invoiceData.discountRate || 0)) / 100
    invoiceData.taxAmount = ((invoiceData.subtotal - invoiceData.discountAmount) * (invoiceData.taxRate || 18)) / 100
    invoiceData.total = invoiceData.subtotal - invoiceData.discountAmount + invoiceData.taxAmount

    const invoice = await Invoice.findByIdAndUpdate(req.params.id, invoiceData, { new: true })
    if (!invoice) return res.status(404).json({ message: "Invoice not found" })

    res.json({ message: "Invoice updated successfully" })
  } catch (error) {
    res.status(400).json({ message: "Error updating invoice", error: error.message })
  }
}

// Delete invoice
const deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id)
    if (!invoice) return res.status(404).json({ message: "Invoice not found" })

    res.json({ message: "Invoice deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: "Error deleting invoice", error: error.message })
  }
}

module.exports = {
  addInvoice,
  getInvoice,
  getAllInvoices,
  updateInvoice,
  deleteInvoice,
  sendReceipt, // Export new email function
  sendInvitation,
}
