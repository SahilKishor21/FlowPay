const mongoose = require('mongoose');

const CashSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client'
  },
  clientName: {
    type: String,
    required: true
  },
  receiptNumber: {
    type: String,
    required: true,
    unique: true
  },
  amount: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  denominationBreakdown: [{
    value: {
      type: Number,
      required: true
    },
    count: {
      type: Number,
      required: true,
      default: 0
    },
    total: {
      type: Number,
      required: true,
      default: 0
    }
  }],
  verified: {
    type: Boolean,
    default: false
  },
  verifiedBy: {
    type: String
  },
  depositedToBank: {
    type: Boolean,
    default: false
  },
  bankName: {
    type: String
  },
  bankDepositDate: {
    type: Date
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Cash', CashSchema);