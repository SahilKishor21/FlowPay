const express = require('express');
const router = express.Router();
const Cash = require('../models/Cash.model');

router.get('/', async (req, res) => {
  try {
    const { verified, startDate, endDate } = req.query;
    let query = {};

    if (verified !== undefined) query.verified = verified === 'true';
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const transactions = await Cash.find(query).sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const cashData = {
      ...req.body,
      amount: parseFloat(req.body.amount),
    };

    const transaction = new Cash(cashData);
    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const transaction = await Cash.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const transaction = await Cash.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json(transaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.patch('/:id/verify', async (req, res) => {
  try {
    const { verifiedBy } = req.body;
    const transaction = await Cash.findByIdAndUpdate(
      req.params.id,
      { 
        verified: true, 
        verifiedBy, 
        updatedAt: Date.now() 
      },
      { new: true }
    );

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json(transaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.patch('/:id/bank-deposit', async (req, res) => {
  try {
    const { bankName, bankDepositDate } = req.body;
    const transaction = await Cash.findByIdAndUpdate(
      req.params.id,
      { 
        depositedToBank: true, 
        bankName, 
        bankDepositDate: new Date(bankDepositDate),
        updatedAt: Date.now() 
      },
      { new: true }
    );

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json(transaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const transaction = await Cash.findByIdAndDelete(req.params.id);
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;