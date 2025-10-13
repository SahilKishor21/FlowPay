const express = require('express');
const router = express.Router();
const Cheque = require('../models/Cheque.model');
const Cash = require('../models/Cash.model');

router.get('/dashboard', async (req, res) => {
  try {
    const pendingCheques = await Cheque.find({ status: { $in: ['Pending', 'Post-Dated'] } });
    const clearedCheques = await Cheque.find({ status: 'Cleared' });
    const bouncedCheques = await Cheque.find({ status: 'Bounced' });
    const cashTransactions = await Cash.find({ verified: true });

    const totalOutstanding = pendingCheques.reduce((sum, cheque) => sum + cheque.amount, 0);
    const totalCleared = clearedCheques.reduce((sum, cheque) => sum + cheque.amount, 0);
    const totalCash = cashTransactions.reduce((sum, tx) => sum + tx.amount, 0);

    const bounceRate = ((bouncedCheques.length / (clearedCheques.length + bouncedCheques.length)) * 100).toFixed(2);

    res.json({
      stats: {
        totalOutstanding,
        pendingCheques: pendingCheques.length,
        clearedThisMonth: totalCleared + totalCash,
        bounceRate: parseFloat(bounceRate) || 0,
      },
      recentCheques: pendingCheques.slice(0, 5),
      recentCash: cashTransactions.slice(0, 5),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/upcoming', async (req, res) => {
  try {
    const today = new Date();
    const nextMonth = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

    const upcomingPayments = await Cheque.find({
      dueDate: { $gte: today, $lte: nextMonth },
      status: { $in: ['Pending', 'Post-Dated'] },
    }).sort({ dueDate: 1 }).limit(10);

    res.json(upcomingPayments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;