const express = require('express');
const app = express();

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running!' });
});

app.listen(5000, () => {
  console.log('✅ Test server running on http://localhost:5000');
  console.log('Visit: http://localhost:5000/api/health');
});