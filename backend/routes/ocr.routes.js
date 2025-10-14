const express = require('express');
const router = express.Router();
const multer = require('multer');
const Tesseract = require('tesseract.js');
const path = require('path');
const fs = require('fs');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/cheques';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files (jpeg, jpg, png) are allowed!'));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Extract data from cheque image
router.post('/extract-cheque', upload.single('chequeImage'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    const imagePath = req.file.path;
    
    // Perform OCR
    const { data: { text, confidence } } = await Tesseract.recognize(
      imagePath,
      'eng',
      {
        logger: info => console.log(info)
      }
    );

    // Extract cheque details using regex patterns
    const extractedData = {
      fullText: text,
      confidence: confidence,
      chequeNumber: extractChequeNumber(text),
      amount: extractAmount(text),
      date: extractDate(text),
      bankName: extractBankName(text),
      imagePath: req.file.filename
    };

    res.json(extractedData);
  } catch (error) {
    console.error('OCR Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Helper function to extract cheque number
function extractChequeNumber(text) {
  // Cheque numbers are typically 6-10 digits
  const patterns = [
    /\b\d{6,10}\b/g,
    /cheque\s*no[.:\s]*(\d{6,10})/gi,
    /ch[eq]*\s*no[.:\s]*(\d{6,10})/gi
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return match[0].replace(/\D/g, '');
    }
  }
  return '';
}

// Helper function to extract amount
function extractAmount(text) {
  // Look for currency patterns
  const patterns = [
    /(?:rs\.?|₹|inr)\s*(\d+(?:,\d{3})*(?:\.\d{2})?)/gi,
    /(\d+(?:,\d{3})*(?:\.\d{2})?)\s*(?:rs\.?|₹|inr)/gi,
    /amount[:\s]*(?:rs\.?|₹)?\s*(\d+(?:,\d{3})*(?:\.\d{2})?)/gi
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return match[0].replace(/[^\d.,]/g, '').replace(/,/g, '');
    }
  }
  return '';
}

// Helper function to extract date
function extractDate(text) {
  // Date patterns: DD/MM/YYYY, DD-MM-YYYY, etc.
  const patterns = [
    /\b(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2,4})\b/g,
    /date[:\s]*(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2,4})/gi
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return match[0].replace(/date[:\s]*/gi, '');
    }
  }
  return '';
}

// Helper function to extract bank name
function extractBankName(text) {
  const indianBanks = [
    'HDFC', 'ICICI', 'SBI', 'AXIS', 'KOTAK', 'YES', 'IDBI', 'PNB', 
    'BOB', 'BOI', 'CANARA', 'UNION', 'INDIAN', 'CENTRAL', 'UCO'
  ];
  
  const textUpper = text.toUpperCase();
  for (const bank of indianBanks) {
    if (textUpper.includes(bank)) {
      return bank + ' BANK';
    }
  }
  return '';
}

module.exports = router;