const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cron = require('node-cron');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const paymentRoutes = require('./routes/payment.routes');
const chequeRoutes = require('./routes/cheque.routes');
const cashRoutes = require('./routes/cash.routes');
const analyticsRoutes = require('./routes/analytics.routes');

app.use('/api/payments', paymentRoutes);
app.use('/api/cheques', chequeRoutes);
app.use('/api/cash', cashRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Payment Management API is running' });
});

cron.schedule('0 9 * * *', () => {
  console.log('Running daily PDC reminder check');
});

const PORT = process.env.PORT || 5000;

if (process.env.MONGODB_URI) {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      console.log('Connected to MongoDB');
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    })
    .catch((err) => {
      console.error('MongoDB connection error:', err);
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT} without database`);
      });
    });
} else {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} without database`);
  });
}