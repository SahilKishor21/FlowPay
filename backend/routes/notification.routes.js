const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Send PDC reminder
router.post('/send-pdc-reminder', async (req, res) => {
  try {
    const { clientEmail, clientName, chequeNumber, amount, dueDate, bankName } = req.body;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: clientEmail,
      subject: 'Payment Reminder: Cheque Due Soon',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">Payment Reminder</h2>
          <p>Dear ${clientName},</p>
          <p>This is a friendly reminder that your cheque payment is due soon.</p>
          
          <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Cheque Details:</h3>
            <table style="width: 100%;">
              <tr>
                <td style="padding: 8px 0;"><strong>Cheque Number:</strong></td>
                <td>${chequeNumber}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Amount:</strong></td>
                <td>₹${amount.toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Due Date:</strong></td>
                <td>${new Date(dueDate).toLocaleDateString('en-IN')}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Bank:</strong></td>
                <td>${bankName}</td>
              </tr>
            </table>
          </div>
          
          <p>Please ensure sufficient funds are available in your account.</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
            <p style="color: #6B7280; font-size: 14px;">
              Best regards,<br>
              <strong>Insyd Labs Payment Team</strong><br>
              HD-119, WeWork Pavilion, Church Street, Bangalore - 560001
            </p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: 'Reminder sent successfully' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Send bounce notification
router.post('/send-bounce-notification', async (req, res) => {
  try {
    const { clientEmail, clientName, chequeNumber, amount, bounceReason } = req.body;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: clientEmail,
      subject: 'URGENT: Cheque Bounced - Action Required',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #DC2626;">Cheque Bounced - Action Required</h2>
          <p>Dear ${clientName},</p>
          <p style="color: #991B1B;">We regret to inform you that your cheque has been returned by the bank.</p>
          
          <div style="background: #FEE2E2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #DC2626;">
            <h3 style="margin-top: 0; color: #991B1B;">Bounced Cheque Details:</h3>
            <table style="width: 100%;">
              <tr>
                <td style="padding: 8px 0;"><strong>Cheque Number:</strong></td>
                <td>${chequeNumber}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Amount:</strong></td>
                <td>₹${amount.toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Bounce Reason:</strong></td>
                <td style="color: #991B1B;"><strong>${bounceReason}</strong></td>
              </tr>
            </table>
          </div>
          
          <div style="background: #FEF3C7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>⚠️ Penalty Charges:</strong> ₹500 + Bank Charges</p>
          </div>
          
          <p><strong>Immediate Action Required:</strong></p>
          <ul>
            <li>Please contact us within 24 hours</li>
            <li>Arrange for alternative payment</li>
            <li>Clear dues including penalty charges</li>
          </ul>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
            <p style="color: #6B7280; font-size: 14px;">
              For immediate assistance, please contact:<br>
              <strong>Insyd Labs Payment Team</strong><br>
              Email: support@insydlabs.com<br>
              Phone: [Your Phone]
            </p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: 'Bounce notification sent successfully' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;