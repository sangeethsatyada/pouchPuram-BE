const express = require("express")
const nodemailer = require("nodemailer")
const router = express.Router()

// Configure nodemailer transporter
const transporter = nodemailer.createTransporter({
  service: "gmail", // or your email service
  auth: {
    user: process.env.EMAIL_USER, // your email
    pass: process.env.EMAIL_PASS, // your app password
  },
})

// Send receipt email for advance payments
const sendAdvanceReceipt = async (req, res) => {
  try {
    const { invoiceId, clientEmail, clientName, advanceAmount, invoiceNumber } = req.body

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: clientEmail,
      subject: `Payment Receipt - Invoice ${invoiceNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <div style="background: linear-gradient(135deg, #ea580c, #f97316); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">Payment Receipt</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Thank you for your advance payment</p>
          </div>

          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #333; margin-bottom: 20px;">Dear ${clientName},</h2>

            <p style="color: #666; line-height: 1.6; font-size: 16px;">
              We have successfully received your advance payment. Here are the details:
            </p>

            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ea580c;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; font-weight: bold; color: #333;">Invoice Number:</td>
                  <td style="padding: 10px 0; color: #666;">${invoiceNumber}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-weight: bold; color: #333;">Advance Amount:</td>
                  <td style="padding: 10px 0; color: #ea580c; font-weight: bold; font-size: 18px;">₹${advanceAmount.toLocaleString()}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-weight: bold; color: #333;">Payment Date:</td>
                  <td style="padding: 10px 0; color: #666;">${new Date().toLocaleDateString()}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-weight: bold; color: #333;">Status:</td>
                  <td style="padding: 10px 0; color: #10b981; font-weight: bold;">✅ Confirmed</td>
                </tr>
              </table>
            </div>

            <div style="background: #e6f7ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #1890ff; margin: 0 0 10px 0;">📋 Next Steps:</h3>
              <ul style="color: #666; line-height: 1.8; margin: 0; padding-left: 20px;">
                <li>Your order is now confirmed and will be processed</li>
                <li>Remaining balance will be collected upon delivery</li>
                <li>You will receive updates on your order progress</li>
                <li>Keep this receipt for your records</li>
              </ul>
            </div>

            <p style="color: #666; line-height: 1.6; margin-top: 30px;">
              If you have any questions or concerns, please don't hesitate to contact us.
            </p>

            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
              <p style="color: #999; font-size: 14px; margin: 0;">
                Thank you for choosing our services!<br>
                <strong style="color: #ea580c;">Your Business Team</strong>
              </p>
            </div>
          </div>
        </div>
      `,
    }

    await transporter.sendMail(mailOptions)
    res.json({ success: true, message: "Receipt sent successfully" })
  } catch (error) {
    console.error("Email sending error:", error)
    res.status(500).json({ success: false, message: "Failed to send receipt" })
  }
}

module.exports = { sendAdvanceReceipt }

// Add this route to your main invoice routes:
// router.post('/sendReceipt', sendAdvanceReceipt);
