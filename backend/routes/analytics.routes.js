const express = require('express');
const router = express.Router();
const Cheque = require('../models/Cheque.model');
const Cash = require('../models/Cash.model');

router.get('/monthly-summary', async (req, res) => {
  try {
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

    const chequesThisMonth = await Cheque.find({
      createdAt: { $gte: startOfMonth, $lte: endOfMonth },
    });

    const cashThisMonth = await Cash.find({
      date: { $gte: startOfMonth, $lte: endOfMonth },
    });

    const totalChequeAmount = chequesThisMonth.reduce((sum, c) => sum + c.amount, 0);
    const totalCashAmount = cashThisMonth.reduce((sum, c) => sum + c.amount, 0);

    const clearedCheques = chequesThisMonth.filter(c => c.status === 'Cleared');
    const bouncedCheques = chequesThisMonth.filter(c => c.status === 'Bounced');

    res.json({
      month: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
      summary: {
        totalCheques: chequesThisMonth.length,
        totalCash: cashThisMonth.length,
        totalChequeAmount,
        totalCashAmount,
        clearedCheques: clearedCheques.length,
        bouncedCheques: bouncedCheques.length,
        bounceRate: ((bouncedCheques.length / chequesThisMonth.length) * 100).toFixed(2),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/payment-trends', async (req, res) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const cheques = await Cheque.find({
      createdAt: { $gte: sixMonthsAgo },
    });

    const cashTxns = await Cash.find({
      date: { $gte: sixMonthsAgo },
    });

    const monthlyData = {};
    
    cheques.forEach(cheque => {
      const month = cheque.createdAt.toLocaleString('default', { month: 'short', year: 'numeric' });
      if (!monthlyData[month]) {
        monthlyData[month] = { cheques: 0, cash: 0, chequeAmount: 0, cashAmount: 0 };
      }
      monthlyData[month].cheques++;
      monthlyData[month].chequeAmount += cheque.amount;
    });

    cashTxns.forEach(tx => {
      const month = tx.date.toLocaleString('default', { month: 'short', year: 'numeric' });
      if (!monthlyData[month]) {
        monthlyData[month] = { cheques: 0, cash: 0, chequeAmount: 0, cashAmount: 0 };
      }
      monthlyData[month].cash++;
      monthlyData[month].cashAmount += tx.amount;
    });

    res.json(monthlyData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;