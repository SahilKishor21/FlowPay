const express = require('express');
const router = express.Router();
const multer = require('multer');
const Cheque = require('../models/Cheque.model');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/cheques/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

router.get('/', async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;
    let query = {};

    if (status) query.status = status;
    if (startDate && endDate) {
      query.dueDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const cheques = await Cheque.find(query).sort({ dueDate: -1 });
    res.json(cheques);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', upload.single('chequeImage'), async (req, res) => {
  try {
    const chequeData = {
      ...req.body,
      amount: parseFloat(req.body.amount),
    };

    if (req.file) {
      chequeData.chequeImage = req.file.path;
    }

    const cheque = new Cheque(chequeData);
    await cheque.save();
    res.status(201).json(cheque);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const cheque = await Cheque.findById(req.params.id);
    if (!cheque) {
      return res.status(404).json({ error: 'Cheque not found' });
    }
    res.json(cheque);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const cheque = await Cheque.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    if (!cheque) {
      return res.status(404).json({ error: 'Cheque not found' });
    }
    res.json(cheque);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.patch('/:id/status', async (req, res) => {
  try {
    const { status, bounceReason, clearanceDate } = req.body;
    const updateData = { status, updatedAt: Date.now() };

    if (status === 'Bounced' && bounceReason) {
      updateData.bounceReason = bounceReason;
    }
    if (status === 'Cleared' && clearanceDate) {
      updateData.clearanceDate = clearanceDate;
    }

    const cheque = await Cheque.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!cheque) {
      return res.status(404).json({ error: 'Cheque not found' });
    }
    res.json(cheque);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const cheque = await Cheque.findByIdAndDelete(req.params.id);
    if (!cheque) {
      return res.status(404).json({ error: 'Cheque not found' });
    }
    res.json({ message: 'Cheque deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/upcoming/reminders', async (req, res) => {
  try {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    const upcomingCheques = await Cheque.find({
      dueDate: { $gte: today, $lte: nextWeek },
      status: { $in: ['Pending', 'Post-Dated'] },
    }).sort({ dueDate: 1 });

    res.json(upcomingCheques);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;