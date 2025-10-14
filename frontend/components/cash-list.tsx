"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Download } from "lucide-react"
import { usePaymentStore } from "@/store/payment-store"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export function CashList() {
  const { cashTransactions } = usePaymentStore()
  const [selectedCash, setSelectedCash] = useState<any>(null)
  const [viewOpen, setViewOpen] = useState(false)

  const handleView = (transaction: any) => {
    setSelectedCash(transaction)
    setViewOpen(true)
  }

  const generatePrintableHTML = (transaction: any) => {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Cash Receipt - ${transaction.receiptNumber}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    @page { margin: 20mm; }
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
    .print-button {
      text-align: center;
      margin: 30px 0;
    }
    .btn-print {
      padding: 12px 40px;
      font-size: 16px;
      background: linear-gradient(135deg, #27AE60 0%, #229954 100%);
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-weight: 600;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    }
    .btn-print:hover {
      box-shadow: 0 6px 20px rgba(0,0,0,0.3);
      transform: translateY(-2px);
    }
    @media print {
      body { padding: 0; }
      .print-button { display: none; }
      .btn-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="company-name">INSYD LABS</div>
    <div class="company-tagline">Payment Management System</div>
    <div class="receipt-title">CASH PAYMENT RECEIPT</div>
    <div class="receipt-date">Generated on: ${new Date().toLocaleString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}</div>
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
      <span class="value">${new Date(transaction.date).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })}</span>
    </div>
    <div class="row">
      <span class="label">Verified:</span>
      <span class="value">
        <span class="verified-badge">${transaction.verified ? 'VERIFIED ✓' : 'PENDING'}</span>
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
      <span class="value">${transaction.receiptNumber}</span> <!-- ✅ FIX -->
    </div>
    <div class="row">
      <span class="label">Payment Method:</span>
      <span class="value">Cash</span>
    </div>
    <div class="row">
      <span class="label">Receipt Generated:</span>
      <span class="value">${new Date().toLocaleString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}</span>
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
    <p>HD-119, WeWork Pavilion, 62/63 The Pavilion, Church Street, Bangalore - 560001, Karnataka</p>
  </div>

  <div class="print-button">
    <button class="btn-print" onclick="window.print()">🖨️ Print Receipt</button>
  </div>
</body>
</html>
    `
  }

  const handleDownloadHTML = (transaction: any) => {
    const htmlContent = generatePrintableHTML(transaction)
    const blob = new Blob([htmlContent], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Cash_Receipt_${transaction.receiptNumber}_${transaction.clientName.replace(/\s+/g, '_')}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handlePrintPDF = (transaction: any) => {
    const printWindow = window.open('', '_blank', 'width=800,height=600')
    if (printWindow) {
      printWindow.document.write(generatePrintableHTML(transaction))
      printWindow.document.close()
      setTimeout(() => {
        printWindow.focus()
      }, 250)
    }
  }

  return (
    <>
      <div className="space-y-3">
        {cashTransactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No cash transactions found. Add your first cash payment!</p>
          </div>
        ) : (
          cashTransactions.map((transaction) => (
            <div
              key={transaction.receiptNumber}  // ✅ FIX
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gradient-to-r from-white/80 to-green-50/80 dark:from-slate-800/80 dark:to-green-900/20 rounded-xl border border-white/40 dark:border-slate-700/40 hover:shadow-lg transition-all"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold">{transaction.clientName}</h4>
                  <Badge className="bg-green-500 text-white">
                    {transaction.verified ? "Verified ✓" : "Pending"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Receipt No: {transaction.receiptNumber}
                </p>
                <p className="text-sm text-muted-foreground">
                  Date: {new Date(transaction.date).toLocaleDateString('en-IN')} | ₹{transaction.amount.toLocaleString('en-IN')}
                </p>
              </div>
              
              <div className="flex gap-2 mt-3 sm:mt-0">
                <Button size="sm" variant="outline" onClick={() => handleView(transaction)}>
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button size="sm" variant="outline" onClick={() => handlePrintPDF(transaction)}>
                  <Download className="h-4 w-4 mr-1" />
                  PDF
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Cash Receipt Details
            </DialogTitle>
          </DialogHeader>
          {selectedCash && (
            <div className="space-y-6">
              <div className="text-center p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-xl">
                <p className="text-sm text-muted-foreground mb-2">Amount</p>
                <p className="text-4xl font-bold text-green-600 dark:text-green-400">
                  ₹{selectedCash.amount.toLocaleString('en-IN')}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Client Name</p>
                  <p className="font-semibold text-lg">{selectedCash.clientName}</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Receipt Number</p>
                  <p className="font-semibold text-lg">{selectedCash.receiptNumber}</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Payment Date</p>
                  <p className="font-semibold text-lg">
                    {new Date(selectedCash.date).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Verification Status</p>
                  <Badge className="bg-green-500 text-white text-sm px-3 py-1">
                    {selectedCash.verified ? "Verified ✓" : "Pending"}
                  </Badge>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg md:col-span-2">
                  <p className="text-xs text-muted-foreground mb-1">Transaction ID</p>
                  <p className="font-mono text-sm">{selectedCash.receiptNumber}</p> {/* ✅ FIX */}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                <Button 
                  onClick={() => handleDownloadHTML(selectedCash)} 
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download HTML Receipt
                </Button>
                <Button 
                  onClick={() => handlePrintPDF(selectedCash)} 
                  variant="outline"
                  className="flex-1"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Open Printable Version
                </Button>
              </div>

              <div className="text-center text-xs text-muted-foreground pt-2">
                <p>💡 Tip: Use "Open Printable Version" and then use Ctrl+P to save as PDF</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
