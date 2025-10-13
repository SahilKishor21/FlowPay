export const generateChequePDF = (cheque: any) => {
  const content = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Cheque Receipt - ${cheque.chequeNumber}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Arial', sans-serif;
      padding: 40px;
      max-width: 800px;
      margin: 0 auto;
      background: white;
      color: #000;
    }
    .header {
      text-align: center;
      border-bottom: 3px double #000;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .company-name {
      font-size: 28px;
      font-weight: bold;
      color: #2C3E50;
      margin-bottom: 5px;
    }
    .company-tagline {
      font-size: 12px;
      color: #7F8C8D;
      margin-bottom: 15px;
    }
    .receipt-title {
      font-size: 22px;
      font-weight: bold;
      margin: 15px 0 10px 0;
      color: #34495E;
    }
    .receipt-date {
      font-size: 12px;
      color: #95A5A6;
    }
    .amount-box {
      font-size: 32px;
      font-weight: bold;
      color: #27AE60;
      text-align: center;
      margin: 30px 0;
      padding: 20px;
      background: linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%);
      border-radius: 10px;
      border: 2px solid #27AE60;
    }
    .section {
      margin: 25px 0;
      border: 1px solid #E0E0E0;
      padding: 20px;
      border-radius: 8px;
      background: #FAFAFA;
    }
    .section-title {
      font-weight: bold;
      font-size: 16px;
      margin-bottom: 15px;
      color: #2C3E50;
      border-bottom: 2px solid #3498DB;
      padding-bottom: 8px;
    }
    .row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px dotted #BDC3C7;
    }
    .row:last-child { border-bottom: none; }
    .label {
      font-weight: 600;
      color: #34495E;
      width: 40%;
    }
    .value {
      color: #2C3E50;
      width: 60%;
      text-align: right;
      font-weight: 500;
    }
    .status-badge {
      display: inline-block;
      padding: 6px 16px;
      border-radius: 20px;
      font-weight: bold;
      font-size: 12px;
      color: white;
    }
    .status-pending { background: #F39C12; }
    .status-cleared { background: #27AE60; }
    .status-bounced { background: #E74C3C; }
    .status-postdated { background: #3498DB; }
    .footer {
      margin-top: 50px;
      text-align: center;
      border-top: 2px solid #E0E0E0;
      padding-top: 25px;
      font-size: 11px;
      color: #7F8C8D;
    }
    .footer-company {
      font-weight: bold;
      font-size: 14px;
      color: #2C3E50;
      margin-bottom: 8px;
    }
    .signature-section {
      margin-top: 50px;
      display: flex;
      justify-content: space-between;
    }
    .signature-box {
      text-align: center;
      width: 45%;
    }
    .signature-line {
      border-top: 2px solid #000;
      margin-top: 50px;
      padding-top: 10px;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="company-name">INSYD LABS</div>
    <div class="company-tagline">Payment Management System</div>
    <div class="receipt-title">CHEQUE PAYMENT RECEIPT</div>
    <div class="receipt-date">Generated on: ${new Date().toLocaleString('en-IN')}</div>
  </div>

  <div class="amount-box">
    ₹ ${cheque.amount.toLocaleString('en-IN')}
  </div>

  <div class="section">
    <div class="section-title">CHEQUE INFORMATION</div>
    <div class="row">
      <span class="label">Cheque Number:</span>
      <span class="value">${cheque.chequeNumber}</span>
    </div>
    <div class="row">
      <span class="label">Bank Name:</span>
      <span class="value">${cheque.bankName}</span>
    </div>
    <div class="row">
      <span class="label">Due Date:</span>
      <span class="value">${new Date(cheque.dueDate).toLocaleDateString('en-IN')}</span>
    </div>
    <div class="row">
      <span class="label">Status:</span>
      <span class="value">
        <span class="status-badge status-${cheque.status.toLowerCase().replace('-', '')}">${cheque.status.toUpperCase()}</span>
      </span>
    </div>
  </div>

  <div class="section">
    <div class="section-title">CLIENT DETAILS</div>
    <div class="row">
      <span class="label">Client Name:</span>
      <span class="value">${cheque.clientName}</span>
    </div>
  </div>

  <div class="section">
    <div class="section-title">TRANSACTION DETAILS</div>
    <div class="row">
      <span class="label">Transaction ID:</span>
      <span class="value">${cheque.id}</span>
    </div>
    <div class="row">
      <span class="label">Payment Method:</span>
      <span class="value">Cheque</span>
    </div>
    <div class="row">
      <span class="label">Receipt Generated:</span>
      <span class="value">${new Date().toLocaleString('en-IN')}</span>
    </div>
  </div>

  <div class="signature-section">
    <div class="signature-box">
      <div class="signature-line">Authorized Signatory</div>
    </div>
    <div class="signature-box">
      <div class="signature-line">Client Signature</div>
    </div>
  </div>

  <div class="footer">
    <div class="footer-company">Insyd Labs - Payment Management System</div>
    <p>This is a computer-generated receipt and does not require a stamp.</p>
    <p>For any queries, please contact: support@insydlabs.com</p>
    <p>HD-119, WeWork Pavilion, 62/63 The Pavilion, Church Street, Bangalore - 560001</p>
  </div>
</body>
</html>
  `

  const blob = new Blob([content], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `Cheque_${cheque.chequeNumber}_${cheque.clientName.replace(/\s+/g, '_')}.html`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export const generateCashPDF = (transaction: any) => {
  const content = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Cash Receipt - ${transaction.receiptNumber}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Arial', sans-serif;
      padding: 40px;
      max-width: 800px;
      margin: 0 auto;
      background: white;
      color: #000;
    }
    .header {
      text-align: center;
      border-bottom: 3px double #000;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .company-name {
      font-size: 28px;
      font-weight: bold;
      color: #2C3E50;
      margin-bottom: 5px;
    }
    .company-tagline {
      font-size: 12px;
      color: #7F8C8D;
      margin-bottom: 15px;
    }
    .receipt-title {
      font-size: 22px;
      font-weight: bold;
      margin: 15px 0 10px 0;
      color: #34495E;
    }
    .receipt-date {
      font-size: 12px;
      color: #95A5A6;
    }
    .amount-box {
      font-size: 32px;
      font-weight: bold;
      color: #27AE60;
      text-align: center;
      margin: 30px 0;
      padding: 20px;
      background: linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%);
      border-radius: 10px;
      border: 2px solid #27AE60;
    }
    .section {
      margin: 25px 0;
      border: 1px solid #E0E0E0;
      padding: 20px;
      border-radius: 8px;
      background: #FAFAFA;
    }
    .section-title {
      font-weight: bold;
      font-size: 16px;
      margin-bottom: 15px;
      color: #2C3E50;
      border-bottom: 2px solid #27AE60;
      padding-bottom: 8px;
    }
    .row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px dotted #BDC3C7;
    }
    .row:last-child { border-bottom: none; }
    .label {
      font-weight: 600;
      color: #34495E;
      width: 40%;
    }
    .value {
      color: #2C3E50;
      width: 60%;
      text-align: right;
      font-weight: 500;
    }
    .verified-badge {
      display: inline-block;
      padding: 6px 16px;
      border-radius: 20px;
      font-weight: bold;
      font-size: 12px;
      color: white;
      background: #27AE60;
    }
    .footer {
      margin-top: 50px;
      text-align: center;
      border-top: 2px solid #E0E0E0;
      padding-top: 25px;
      font-size: 11px;
      color: #7F8C8D;
    }
    .footer-company {
      font-weight: bold;
      font-size: 14px;
      color: #2C3E50;
      margin-bottom: 8px;
    }
    .signature-section {
      margin-top: 50px;
      display: flex;
      justify-content: space-between;
    }
    .signature-box {
      text-align: center;
      width: 45%;
    }
    .signature-line {
      border-top: 2px solid #000;
      margin-top: 50px;
      padding-top: 10px;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="company-name">INSYD LABS</div>
    <div class="company-tagline">Payment Management System</div>
    <div class="receipt-title">CASH PAYMENT RECEIPT</div>
    <div class="receipt-date">Generated on: ${new Date().toLocaleString('en-IN')}</div>
  </div>

  <div class="amount-box">
    ₹ ${transaction.amount.toLocaleString('en-IN')}
  </div>

  <div class="section">
    <div class="section-title">RECEIPT INFORMATION</div>
    <div class="row">
      <span class="label">Receipt Number:</span>
      <span class="value">${transaction.receiptNumber}</span>
    </div>
    <div class="row">
      <span class="label">Payment Date:</span>
      <span class="value">${new Date(transaction.date).toLocaleDateString('en-IN')}</span>
    </div>
    <div class="row">
      <span class="label">Verified:</span>
      <span class="value">
        <span class="verified-badge">${transaction.verified ? 'VERIFIED' : 'PENDING'}</span>
      </span>
    </div>
  </div>

  <div class="section">
    <div class="section-title">CLIENT DETAILS</div>
    <div class="row">
      <span class="label">Client Name:</span>
      <span class="value">${transaction.clientName}</span>
    </div>
  </div>

  <div class="section">
    <div class="section-title">TRANSACTION DETAILS</div>
    <div class="row">
      <span class="label">Transaction ID:</span>
      <span class="value">${transaction.id}</span>
    </div>
    <div class="row">
      <span class="label">Payment Method:</span>
      <span class="value">Cash</span>
    </div>
    <div class="row">
      <span class="label">Receipt Generated:</span>
      <span class="value">${new Date().toLocaleString('en-IN')}</span>
    </div>
  </div>

  <div class="signature-section">
    <div class="signature-box">
      <div class="signature-line">Authorized Signatory</div>
    </div>
    <div class="signature-box">
      <div class="signature-line">Client Signature</div>
    </div>
  </div>

  <div class="footer">
    <div class="footer-company">Insyd Labs - Payment Management System</div>
    <p>This is a computer-generated receipt and does not require a stamp.</p>
    <p>For any queries, please contact: support@insydlabs.com</p>
    <p>HD-119, WeWork Pavilion, 62/63 The Pavilion, Church Street, Bangalore - 560001</p>
  </div>
</body>
</html>
  `

  const blob = new Blob([content], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `Cash_Receipt_${transaction.receiptNumber}_${transaction.clientName.replace(/\s+/g, '_')}.html`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}