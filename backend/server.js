const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cron = require('node-cron');
const nodemailer = require('nodemailer');

dotenv.config();

const app = express();

app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const paymentRoutes = require('./routes/payment.routes');
const chequeRoutes = require('./routes/cheque.routes');
const cashRoutes = require('./routes/cash.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const clientRoutes = require('./routes/client.routes');
const ocrRoutes = require('./routes/ocr.routes');
const notificationRoutes = require('./routes/notification.routes');
const invoiceRoutes = require('./routes/invoice.routes');

// Health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'Payment Management API is running',
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// Mount routes
app.use('/api/payments', paymentRoutes);
app.use('/api/cheques', chequeRoutes);
app.use('/api/cash', cashRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/ocr', ocrRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/invoices', invoiceRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: err.message || 'Internal server error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'test@example.com',
    pass: process.env.EMAIL_PASS || 'test'
  }
});

// PDC reminders - 9 AM daily
cron.schedule('0 9 * * *', async () => {
  console.log('Running daily PDC reminder check');
  try {
    const Cheque = require('./models/Cheque.model');
    
    const today = new Date();
    const sevenDaysFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    const upcomingCheques = await Cheque.find({
      status: { $in: ['Pending', 'Post-Dated'] },
      dueDate: {
        $gte: today,
        $lte: sevenDaysFromNow
      }
    }).populate('clientId');
    
    for (const cheque of upcomingCheques) {
      if (cheque.clientId && cheque.clientId.email) {
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: cheque.clientId.email,
          subject: `Payment Reminder: Cheque Due in 7 Days`,
          html: `
            <h2>Payment Reminder</h2>
            <p>Dear ${cheque.clientId.name},</p>
            <p>Your cheque payment is due in 7 days.</p>
            <ul>
              <li><strong>Cheque Number:</strong> ${cheque.chequeNumber}</li>
              <li><strong>Amount:</strong> ₹${cheque.amount.toLocaleString('en-IN')}</li>
              <li><strong>Due Date:</strong> ${cheque.dueDate.toLocaleDateString('en-IN')}</li>
            </ul>
          `
        };
        
        await transporter.sendMail(mailOptions);
        console.log(`Reminder sent to ${cheque.clientId.email}`);
      }
    }
  } catch (error) {
    console.error('Error sending reminders:', error);
  }
});

// Risk score recalculation - Midnight daily
cron.schedule('0 0 * * *', async () => {
  console.log('Recalculating client risk scores');
  try {
    const Client = require('./models/Client.model');
    const clients = await Client.find();
    
    for (const client of clients) {
      await client.calculateRiskScore();
      await client.save();
    }
    
    console.log('Risk scores updated');
  } catch (error) {
    console.error('Error updating risk scores:', error);
  }
});

const PORT = process.env.PORT || 5000;

const startServer = () => {
  app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════╗
║  🚀 Server running on port ${PORT}         ║
║  📡 API: http://localhost:${PORT}/api      ║
║  🏥 Health: http://localhost:${PORT}/api/health ║
╚════════════════════════════════════════════╝
    `);
  });
};

if (process.env.MONGODB_URI) {
  mongoose
    .connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    })
    .then(() => {
      console.log('✅ Connected to MongoDB');
      startServer();
    })
    .catch((err) => {
      console.error('❌ MongoDB connection error:', err.message);
      console.log('⚠️  Starting server WITHOUT database...');
      startServer(); 
    });
} else {
  console.log('⚠️  No MongoDB URI provided. Starting without database...');
  startServer();
}

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});

module.exports = app;