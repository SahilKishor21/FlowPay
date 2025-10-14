const mongoose = require('mongoose');

const ChequeSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: false  // CHANGED TO FALSE for backward compatibility
  },
  clientName: {
    type: String,
    required: true
  },
  chequeNumber: {
    type: String,
    required: true,
    unique: true
  },
  bankName: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  issueDate: {
    type: Date,
    default: Date.now
  },
  dueDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Cleared', 'Bounced', 'Post-Dated'],
    default: 'Pending'
  },
  chequeImage: {
    type: String
  },
  ocrData: {
    extractedChequeNumber: String,
    extractedAmount: String,
    extractedDate: String,
    extractedBank: String,
    confidence: Number
  },
  bounceReason: {
    type: String
  },
  bounceDate: {
    type: Date
  },
  clearanceDate: {
    type: Date
  },
  reminderSent: {
    type: Boolean,
    default: false
  },
  reminderDate: {
    type: Date
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

ChequeSchema.post('save', async function() {
  if (this.clientId) {
    try {
      const Client = mongoose.model('Client');
      const client = await Client.findById(this.clientId);
      if (client) {
        await client.updateOutstanding();
        await client.calculateRiskScore();
        await client.save();
      }
    } catch (error) {
      console.error('Error updating client after cheque save:', error);
    }
  }
});

ChequeSchema.post('findOneAndUpdate', async function(doc) {
  if (doc && doc.clientId) {
    try {
      const Client = mongoose.model('Client');
      const client = await Client.findById(doc.clientId);
      if (client) {
        await client.updateOutstanding();
        await client.calculateRiskScore();
        await client.save();
      }
    } catch (error) {
      console.error('Error updating client after cheque update:', error);
    }
  }
});

module.exports = mongoose.model('Cheque', ChequeSchema);