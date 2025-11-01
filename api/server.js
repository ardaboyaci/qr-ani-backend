require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check route
app.get('/', (req, res) => {
  res.json({ 
    message: 'QR Anı API Server',
    status: 'running',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// API Routes 
app.use('/api/events', require('./routes/events'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.status || 500).json({ 
    error: 'Internal Server Error',
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║     QR ANI API SERVER STARTED          ║
║                                        ║
║  Server: http://localhost:${PORT}      ║
║  Status: 🟢 RUNNING                    ║
║  Environment: ${process.env.NODE_ENV || 'development'}              ║
╚════════════════════════════════════════╝
  `);
});

module.exports = app; 