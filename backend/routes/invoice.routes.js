const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice.model');
const Cheque = require('../models/Cheque.model');
const Cash = require('../models/Cash.model');

router.get('/', async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .populate('clientId')
      .sort({ createdAt: -1 });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate('clientId');
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const invoice = new Invoice(req.body);
    invoice.remainingAmount = invoice.amount;
    await invoice.save();
    res.status(201).json(invoice);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update invoice
router.put('/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    res.json(invoice);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete invoice
router.delete('/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    res.json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Auto-reconcile payments with invoices
router.post('/reconcile', async (req, res) => {
  try {
    const invoices = await Invoice.find({ status: { $ne: 'Paid' } }).populate('clientId');
    const cheques = await Cheque.find({ status: 'Cleared' }).populate('clientId');
    const cash = await Cash.find({ verified: true }).populate('clientId');
    
    const matches = [];
    const unmatchedPayments = [];
    const allPayments = [
      ...cheques.map(c => ({ type: 'Cheque', data: c })),
      ...cash.map(c => ({ type: 'Cash', data: c }))
    ];
    
    for (const payment of allPayments) {
      let matched = false;
      
      for (const invoice of invoices) {
        if (invoice.status === 'Paid') continue;

        const clientMatch = payment.data.clientId && 
          invoice.clientId._id.toString() === payment.data.clientId.toString();
        
        const amountMatch = Math.abs(payment.data.amount - invoice.remainingAmount) / invoice.remainingAmount <= 0.02; // 2% tolerance
        
        const dateMatch = payment.type === 'Cheque' 
          ? Math.abs(new Date(payment.data.dueDate) - new Date(invoice.dueDate)) / (1000 * 60 * 60 * 24) <= 7
          : Math.abs(new Date(payment.data.date) - new Date(invoice.dueDate)) / (1000 * 60 * 60 * 24) <= 7;

        let matchScore = 0;
        if (clientMatch) matchScore += 40;
        if (amountMatch) matchScore += 35;
        if (dateMatch) matchScore += 15;
        if (payment.data.clientName && invoice.clientId.name) {
          const nameMatch = payment.data.clientName.toLowerCase().includes(invoice.clientId.name.toLowerCase()) ||
            invoice.clientId.name.toLowerCase().includes(payment.data.clientName.toLowerCase());
          if (nameMatch) matchScore += 10;
        }
        
        if (matchScore >= 50) { 
          invoice.reconciledPayments.push({
            paymentId: payment.data._id,
            paymentType: payment.type,
            amount: payment.data.amount,
            date: payment.type === 'Cheque' ? payment.data.dueDate : payment.data.date
          });
          
          invoice.paidAmount += payment.data.amount;
          invoice.updatePaymentStatus();
          await invoice.save();
          
          matches.push({
            invoice: invoice.invoiceNumber,
            payment: payment.type === 'Cheque' ? payment.data.chequeNumber : payment.data.receiptNumber,
            amount: payment.data.amount,
            matchScore: matchScore
          });
          
          matched = true;
          break;
        }
      }
      
      if (!matched) {
        unmatchedPayments.push({
          type: payment.type,
          id: payment.type === 'Cheque' ? payment.data.chequeNumber : payment.data.receiptNumber,
          amount: payment.data.amount,
          client: payment.data.clientName
        });
      }
    }
    
    res.json({
      message: 'Reconciliation complete',
      matched: matches.length,
      unmatched: unmatchedPayments.length,
      matches: matches,
      unmatchedPayments: unmatchedPayments
    });
  } catch (error) {
    console.error('Reconciliation error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;