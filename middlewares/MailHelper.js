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
  console.log("inside mai")
  try {
    const {
      invoiceId,
      clientEmail,
      clientName,
      advanceAmount,
      invoiceNumber,
      projectName,
      paymentMode,
      paymentType,
      subtotal,
      taxAmount,
      totalAmount,
      outstandingBalance,
      paymentDate
    } = req.body

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: clientEmail,
      subject: `Payment Receipt - Invoice ${invoiceNumber}`,
      html: `
              <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 700px; margin: 0 auto; padding: 0; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

          <!-- Header -->
          <div style="background: linear-gradient(135deg, #1e40af, #3b82f6); color: white; padding: 40px 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 32px; font-weight: 600;">Thank you for your advance payment!</h1>
            <p style="margin: 15px 0 0 0; font-size: 18px; opacity: 0.95;">We have successfully received your payment for the following invoice:</p>
          </div>

          <!-- Main Content -->
          <div style="padding: 40px 30px; background: #ffffff;">

            <!-- Payment Details Section -->
            <div style="background: #f8fafc; padding: 25px; border-radius: 10px; margin-bottom: 30px; border-left: 5px solid #3b82f6;">
              <h2 style="color: #1e293b; margin: 0 0 20px 0; font-size: 24px; display: flex; align-items: center;">
                <span style="margin-right: 10px;">💳</span> Payment Details
              </h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 12px 0; font-weight: 600; color: #374151; width: 40%;">Amount Received:</td>
                  <td style="padding: 12px 0; color: #059669; font-weight: 700; font-size: 20px;">₹${advanceAmount.toLocaleString()}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; font-weight: 600; color: #374151;">Invoice Number:</td>
                  <td style="padding: 12px 0; color: #1f2937; font-weight: 500;">${invoiceNumber}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; font-weight: 600; color: #374151;">Project:</td>
                  <td style="padding: 12px 0; color: #1f2937; font-weight: 500;">${projectName || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; font-weight: 600; color: #374151;">Payment Mode:</td>
                  <td style="padding: 12px 0; color: #1f2937; font-weight: 500;">${paymentMode || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; font-weight: 600; color: #374151;">Payment Type:</td>
                  <td style="padding: 12px 0; color: #1f2937; font-weight: 500;">${paymentType || 'Advance Payment'}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; font-weight: 600; color: #374151;">Date Received:</td>
                  <td style="padding: 12px 0; color: #1f2937; font-weight: 500;">${paymentDate || new Date().toLocaleDateString('en-IN')}</td>
                </tr>
              </table>
            </div>

            <!-- Invoice Summary Section -->
            <div style="background: #f8fafc; padding: 25px; border-radius: 10px; margin-bottom: 30px; border-left: 5px solid #10b981;">
              <h2 style="color: #1e293b; margin: 0 0 20px 0; font-size: 24px; display: flex; align-items: center;">
                <span style="margin-right: 10px;">💰</span> Invoice Summary
              </h2>
              <table style="width: 100%; border-collapse: collapse; border: 1px solid #e5e7eb;">
                <thead>
                  <tr style="background: #f3f4f6;">
                    <th style="padding: 15px; text-align: left; border-bottom: 2px solid #d1d5db; color: #374151; font-weight: 600;">Description</th>
                    <th style="padding: 15px; text-align: right; border-bottom: 2px solid #d1d5db; color: #374151; font-weight: 600;">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style="padding: 15px; border-bottom: 1px solid #e5e7eb; color: #374151;">Subtotal (Before Tax)</td>
                    <td style="padding: 15px; border-bottom: 1px solid #e5e7eb; text-align: right; color: #1f2937; font-weight: 500;">₹${subtotal ? subtotal.toLocaleString() : '0'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 15px; border-bottom: 1px solid #e5e7eb; color: #374151;">Tax (18%)</td>
                    <td style="padding: 15px; border-bottom: 1px solid #e5e7eb; text-align: right; color: #1f2937; font-weight: 500;">₹${taxAmount ? taxAmount.toLocaleString() : '0'}</td>
                  </tr>
                  <tr style="background: #f0f9ff;">
                    <td style="padding: 15px; border-bottom: 1px solid #e5e7eb; color: #1e40af; font-weight: 600;">Total Invoice Amount</td>
                    <td style="padding: 15px; border-bottom: 1px solid #e5e7eb; text-align: right; color: #1e40af; font-weight: 600; font-size: 18px;">₹${totalAmount ? totalAmount.toLocaleString() : '0'}</td>
                  </tr>
                  <tr style="background: #f0fdf4;">
                    <td style="padding: 15px; border-bottom: 1px solid #e5e7eb; color: #059669; font-weight: 600;">Advance Paid</td>
                    <td style="padding: 15px; border-bottom: 1px solid #e5e7eb; text-align: right; color: #059669; font-weight: 600;">₹${advanceAmount.toLocaleString()}</td>
                  </tr>
                  <tr style="background: #fef2f2;">
                    <td style="padding: 15px; color: #dc2626; font-weight: 600;">Outstanding Balance</td>
                    <td style="padding: 15px; text-align: right; color: #dc2626; font-weight: 600; font-size: 18px;">₹${outstandingBalance ? outstandingBalance.toLocaleString() : '0'}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Next Steps Section -->
            <div style="background: #f0f9ff; padding: 25px; border-radius: 10px; margin-bottom: 30px; border-left: 5px solid #0ea5e9;">
              <h2 style="color: #1e293b; margin: 0 0 20px 0; font-size: 24px; display: flex; align-items: center;">
                <span style="margin-right: 10px;">📌</span> Next Steps
              </h2>
              <div style="display: flex; align-items: center; margin-bottom: 15px;">
                <span style="color: #059669; font-size: 20px; margin-right: 15px;">✅</span>
                <span style="color: #374151; font-weight: 500;">We will begin work on your project immediately</span>
              </div>
              <div style="display: flex; align-items: center; margin-bottom: 15px;">
                <span style="color: #3b82f6; font-size: 20px; margin-right: 15px;">💳</span>
                <span style="color: #374151; font-weight: 500;">The remaining balance will be due upon project completion</span>
              </div>
              <div style="display: flex; align-items: center; margin-bottom: 15px;">
                <span style="color: #f59e0b; font-size: 20px; margin-right: 15px;">📢</span>
                <span style="color: #374151; font-weight: 500;">You will receive regular updates on project progress</span>
              </div>
              <div style="display: flex; align-items: center;">
                <span style="color: #8b5cf6; font-size: 20px; margin-right: 15px;">📄</span>
                <span style="color: #374151; font-weight: 500;">Final invoice will be sent upon delivery</span>
              </div>
            </div>

            <!-- Contact Information -->
            <div style="background: #f9fafb; border-radius: 10px;">
              <p style="color: #6b7280; line-height: 1.6; font-size: 16px; margin: 0; text-align: left;">
                If you have any questions, please don't hesitate to contact us.
              </p>
            </div>

            <!-- Footer -->
            <div style="text-align: left;">
              <p style="color: #6b7280; font-size: 16px; margin: 0 0 10px 0;">
                Thank you for choosing our services!
              </p>
              <p style="color: #1e293b; font-size: 18px; font-weight: 600; margin: 0 0 20px 0;">
                Best regards,<br>
                <span style="color: #3b82f6;">Pouchpuram Team</span>
              </p>

              <!-- Logo Placeholder -->
              <div style="text-align: center; margin-top: 30px;">
                <img src="https://via.placeholder.com/200x80/3b82f6/ffffff?text=Pouchpuram+Logo"
                     alt="Pouchpuram Logo"
                     style="max-width: 200px; height: auto; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              </div>
            </div>

          </div>
        </div>

      `,
    }

    await transporter.sendMail(mailOptions)
    res.json({ success: true, message: "Payment receipt sent successfully" })
  } catch (error) {
    console.error("Email sending error:", error)
    res.status(500).json({ success: false, message: "Failed to send payment receipt" })
  }
}

module.exports = { sendAdvanceReceipt }

// Add this route to your main invoice routes:
// router.post('/sendReceipt', sendAdvanceReceipt);
