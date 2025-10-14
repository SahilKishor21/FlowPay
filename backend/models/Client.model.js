const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  companyName: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true
  },
  gstNumber: {
    type: String,
    trim: true,
    uppercase: true
  },
  panNumber: {
    type: String,
    trim: true,
    uppercase: true
  },
  creditLimit: {
    type: Number,
    default: 100000
  },
  outstandingAmount: {
    type: Number,
    default: 0
  },
  riskScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  riskLevel: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Low'
  },
  bounceCount: {
    type: Number,
    default: 0
  },
  totalPayments: {
    type: Number,
    default: 0
  },
  avgPaymentDelay: {
    type: Number,
    default: 0
  },
  kycVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

ClientSchema.methods.calculateRiskScore = async function() {
  const Cheque = mongoose.model('Cheque');
  
  const cheques = await Cheque.find({ clientId: this._id });
  
  const totalCheques = cheques.length;
  const bouncedCheques = cheques.filter(c => c.status === 'Bounced').length;
  const bounceRate = totalCheques > 0 ? (bouncedCheques / totalCheques) * 100 : 0;
  
  let totalDelay = 0;
  let delayCount = 0;
  cheques.forEach(cheque => {
    if (cheque.clearanceDate && cheque.dueDate) {
      const delay = Math.max(0, (new Date(cheque.clearanceDate) - new Date(cheque.dueDate)) / (1000 * 60 * 60 * 24));
      totalDelay += delay;
      delayCount++;
    }
  });
  const avgDelay = delayCount > 0 ? totalDelay / delayCount : 0;
  
  const outstandingRatio = this.creditLimit > 0 ? (this.outstandingAmount / this.creditLimit) * 100 : 0;
  
  const transactionScore = totalCheques > 0 ? Math.min(100, (totalCheques / 10) * 100) : 0;
  
  const riskScore = (
    (bounceRate * 0.40) +
    (Math.min(avgDelay * 2, 100) * 0.30) +
    (Math.min(outstandingRatio, 100) * 0.20) +
    ((100 - transactionScore) * 0.10)
  );
  
  this.riskScore = Math.round(riskScore);
  this.avgPaymentDelay = Math.round(avgDelay);
  this.bounceCount = bouncedCheques;
  this.totalPayments = totalCheques;
  
  if (riskScore >= 61) {
    this.riskLevel = 'High';
  } else if (riskScore >= 31) {
    this.riskLevel = 'Medium';
  } else {
    this.riskLevel = 'Low';
  }
  
  return this.riskScore;
};

ClientSchema.methods.updateOutstanding = async function() {
  const Cheque = mongoose.model('Cheque');
  const pendingCheques = await Cheque.find({
    clientId: this._id,
    status: { $in: ['Pending', 'Post-Dated'] }
  });
  
  this.outstandingAmount = pendingCheques.reduce((sum, cheque) => sum + cheque.amount, 0);
  return this.outstandingAmount;
};

module.exports = mongoose.model('Client', ClientSchema);