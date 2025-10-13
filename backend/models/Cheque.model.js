const mongoose = require('mongoose');

const chequeSchema = new mongoose.Schema({
  clientName: {
    type: String,
    required: true,
  },
  chequeNumber: {
    type: String,
    required: true,
    unique: true,
  },
  bankName: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  issueDate: {
    type: Date,
    default: Date.now,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Cleared', 'Bounced', 'Post-Dated', 'Cancelled'],
    default: 'Pending',
  },
  clientContact: {
    type: String,
  },
  invoiceNumber: {
    type: String,
  },
  remarks: {
    type: String,
  },
  chequeImage: {
    type: String,
  },
  bounceReason: {
    type: String,
  },
  clearanceDate: {
    type: Date,
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

chequeSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Cheque', chequeSchema);