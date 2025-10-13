const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
  },
  contact: {
    phone: String,
    email: String,
    address: String,
  },
  gstNumber: {
    type: String,
  },
  panNumber: {
    type: String,
  },
  creditLimit: {
    type: Number,
    default: 0,
  },
  outstandingAmount: {
    type: Number,
    default: 0,
  },
  paymentHistory: [{
    amount: Number,
    date: Date,
    status: String,
  }],
  riskScore: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Low',
  },
  bounceCount: {
    type: Number,
    default: 0,
  },
  totalTransactions: {
    type: Number,
    default: 0,
  },
  kycVerified: {
    type: Boolean,
    default: false,
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

clientSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Client', clientSchema);