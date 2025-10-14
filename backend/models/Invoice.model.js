const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  invoiceNumber: {
    type: String,
    required: true,
    unique: true
  },
  amount: {
    type: Number,
    required: true
  },
  issueDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  dueDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Unpaid', 'Partially Paid', 'Paid', 'Overdue'],
    default: 'Unpaid'
  },
  paidAmount: {
    type: Number,
    default: 0
  },
  remainingAmount: {
    type: Number,
    required: true
  },
  description: {
    type: String
  },
  items: [{
    description: String,
    quantity: Number,
    unitPrice: Number,
    total: Number
  }],
  reconciledPayments: [{
    paymentId: {
      type: mongoose.Schema.Types.ObjectId
    },
    paymentType: {
      type: String,
      enum: ['Cheque', 'Cash']
    },
    amount: Number,
    date: Date
  }]
}, {
  timestamps: true
});

InvoiceSchema.methods.updatePaymentStatus = function() {
  this.remainingAmount = this.amount - this.paidAmount;
  
  if (this.paidAmount === 0) {
    this.status = 'Unpaid';
  } else if (this.paidAmount < this.amount) {
    this.status = 'Partially Paid';
  } else {
    this.status = 'Paid';
  }
  
  if (this.status !== 'Paid' && new Date() > new Date(this.dueDate)) {
    this.status = 'Overdue';
  }
};

module.exports = mongoose.model('Invoice', InvoiceSchema);