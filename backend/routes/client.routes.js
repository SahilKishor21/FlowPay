const express = require('express');
const router = express.Router();
const Client = require('../models/Client.model');

// Get all clients
router.get('/', async (req, res) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 });
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get client by ID
router.get('/:id', async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }
    res.json(client);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new client
router.post('/', async (req, res) => {
  try {
    const client = new Client(req.body);
    await client.save();
    res.status(201).json(client);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update client
router.put('/:id', async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }
    res.json(client);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete client
router.delete('/:id', async (req, res) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }
    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Recalculate risk score
router.post('/:id/calculate-risk', async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }
    
    await client.calculateRiskScore();
    await client.save();
    
    res.json(client);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;