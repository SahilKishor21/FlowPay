"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Download, Edit } from "lucide-react"
import { usePaymentStore } from "@/store/payment-store"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export function ChequeList() {
  const { cheques, updateChequeStatus } = usePaymentStore()
  const [selectedCheque, setSelectedCheque] = useState<any>(null)
  const [viewOpen, setViewOpen] = useState(false)
  const [statusUpdateOpen, setStatusUpdateOpen] = useState(false)
  const [newStatus, setNewStatus] = useState("")
  const [bounceReason, setBounceReason] = useState("")
  const [updating, setUpdating] = useState(false)
  const { toast } = useToast()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending": return "bg-yellow-500"
      case "Cleared": return "bg-green-500"
      case "Bounced": return "bg-red-500"
      case "Post-Dated": return "bg-blue-500"
      default: return "bg-gray-500"
    }
  }

  const handleView = (cheque: any) => {
    setSelectedCheque(cheque)
    setViewOpen(true)
  }

  const handleStatusUpdate = (cheque: any) => {
    setSelectedCheque(cheque)
    setNewStatus(cheque.status)
    setBounceReason("")
    setStatusUpdateOpen(true)
  }

 const submitStatusUpdate = async () => {
  if (!selectedCheque || !newStatus) return
  
  setUpdating(true)
  try {
    await updateChequeStatus(
      selectedCheque._id,  // Changed from .id to ._id
      newStatus, 
      newStatus === "Bounced" ? bounceReason : undefined
    )
    
    toast({
      title: "✅ Status Updated",
      description: `Cheque ${selectedCheque.chequeNumber} status updated to ${newStatus}`,
    })
    
    setStatusUpdateOpen(false)
    setSelectedCheque(null) // Clear selection
    setBounceReason("")
  } catch (error) {
    console.error('Status update error:', error)
    toast({
      title: "❌ Update Failed",
      description: "Failed to update cheque status",
      variant: "destructive",
    })
  } finally {
    setUpdating(false)
  }
}

  const generatePrintableHTML = (cheque: any) => {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Cheque Receipt - ${cheque.chequeNumber}</title>
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
    .print-button {
      text-align: center;
      margin: 30px 0;
    }
    .btn-print {
      padding: 12px 40px;
      font-size: 16px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
    <div class="receipt-title">CHEQUE PAYMENT RECEIPT</div>
    <div class="receipt-date">Generated on: ${new Date().toLocaleString('en-IN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}</div>
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
      <span class="value">${new Date(cheque.dueDate).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long', 
        day: 'numeric'
      })}</span>
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

  const handleDownloadHTML = (cheque: any) => {
    const htmlContent = generatePrintableHTML(cheque)
    const blob = new Blob([htmlContent], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Cheque_Receipt_${cheque.chequeNumber}_${cheque.clientName.replace(/\s+/g, '_')}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handlePrintPDF = (cheque: any) => {
    const printWindow = window.open('', '_blank', 'width=800,height=600')
    if (printWindow) {
      printWindow.document.write(generatePrintableHTML(cheque))
      printWindow.document.close()
      setTimeout(() => {
        printWindow.focus()
      }, 250)
    }
  }

  return (
    <>
      <div className="space-y-3">
        {cheques.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No cheques found. Add your first cheque payment!</p>
          </div>
        ) : (
          cheques.map((cheque) => (
            <div
              key={cheque._id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gradient-to-r from-white/80 to-blue-50/80 dark:from-slate-800/80 dark:to-blue-900/20 rounded-xl border border-white/40 dark:border-slate-700/40 hover:shadow-lg transition-all"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold">{cheque.clientName}</h4>
                  <Badge className={`${getStatusColor(cheque.status)} text-white`}>
                    {cheque.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Cheque No: {cheque.chequeNumber} | Bank: {cheque.bankName}
                </p>
                <p className="text-sm text-muted-foreground">
                  Due: {new Date(cheque.dueDate).toLocaleDateString('en-IN')} | ₹{cheque.amount.toLocaleString('en-IN')}
                </p>
              </div>
              
              <div className="flex gap-2 mt-3 sm:mt-0">
                <Button size="sm" variant="outline" onClick={() => handleStatusUpdate(cheque)}>
                  <Edit className="h-4 w-4 mr-1" />
                  Status
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleView(cheque)}>
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button size="sm" variant="outline" onClick={() => handlePrintPDF(cheque)}>
                  <Download className="h-4 w-4 mr-1" />
                  PDF
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Status Update Dialog */}
      <Dialog open={statusUpdateOpen} onOpenChange={setStatusUpdateOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Cheque Status</DialogTitle>
          </DialogHeader>
          {selectedCheque && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Cheque Number</p>
                <p className="font-semibold">{selectedCheque.chequeNumber}</p>
              </div>
              
              <div className="space-y-2">
                <Label>New Status</Label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Post-Dated">Post-Dated</SelectItem>
                    <SelectItem value="Cleared">Cleared</SelectItem>
                    <SelectItem value="Bounced">Bounced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {newStatus === "Bounced" && (
                <div className="space-y-2">
                  <Label htmlFor="bounceReason">Bounce Reason</Label>
                  <Input
                    id="bounceReason"
                    placeholder="e.g., Insufficient funds, Signature mismatch"
                    value={bounceReason}
                    onChange={(e) => setBounceReason(e.target.value)}
                  />
                </div>
              )}

              <Button 
                onClick={submitStatusUpdate} 
                className="w-full"
                disabled={updating || (newStatus === "Bounced" && !bounceReason)}
              >
                {updating ? "Updating..." : "Update Status"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Cheque Details
            </DialogTitle>
          </DialogHeader>
          {selectedCheque && (
            <div className="space-y-6">
              <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-xl">
                <p className="text-sm text-muted-foreground mb-2">Amount</p>
                <p className="text-4xl font-bold text-green-600 dark:text-green-400">
                  ₹{selectedCheque.amount.toLocaleString('en-IN')}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Client Name</p>
                  <p className="font-semibold text-lg">{selectedCheque.clientName}</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Cheque Number</p>
                  <p className="font-semibold text-lg">{selectedCheque.chequeNumber}</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Bank Name</p>
                  <p className="font-semibold text-lg">{selectedCheque.bankName}</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Due Date</p>
                  <p className="font-semibold text-lg">
                    {new Date(selectedCheque.dueDate).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Status</p>
                  <Badge className={`${getStatusColor(selectedCheque.status)} text-white text-sm px-3 py-1`}>
                    {selectedCheque.status}
                  </Badge>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Transaction ID</p>
                  <p className="font-mono text-sm">{selectedCheque.id}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                <Button 
                  onClick={() => handleDownloadHTML(selectedCheque)} 
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download HTML Receipt
                </Button>
                <Button 
                  onClick={() => handlePrintPDF(selectedCheque)} 
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