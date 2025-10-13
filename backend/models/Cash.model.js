const mongoose = require('mongoose');

const cashSchema = new mongoose.Schema({
  clientName: {
    type: String,
    required: true,
  },
  receiptNumber: {
    type: String,
    required: true,
    unique: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  verifiedBy: {
    type: String,
  },
  clientContact: {
    type: String,
  },
  invoiceNumber: {
    type: String,
  },
  paymentMode: {
    type: String,
    enum: ['Cash', 'Demand Draft', 'Pay Order'],
    default: 'Cash',
  },
  denominationBreakdown: [{
    denomination: Number,
    count: Number,
  }],
  remarks: {
    type: String,
  },
  depositedToBank: {
    type: Boolean,
    default: false,
  },
  bankDepositDate: {
    type: Date,
  },
  bankName: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

cashSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Cash', cashSchema);