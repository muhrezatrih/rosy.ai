const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimiter = require('./middleware/rateLimiter.middleware');
const { notFoundHandler, errorHandler } = require('./middleware/error.middleware');
const aiRoutes = require('./routes/ai.routes');
const healthRoutes = require('./routes/health.routes');
const roomsRoutes = require('./routes/rooms.routes');
const { config } = require('./config/env');

const app = express();

// Security middleware with Content Security Policy allowing fonts and scripts
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', 'blob:'],
        connectSrc: ["'self'"],
      },
    },
  })
);
app.use(
  cors({
    origin: config.allowedOrigins,
    optionsSuccessStatus: 200,
  })
);

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../public')));

// Body parsing
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use('/', healthRoutes);
app.use('/', rateLimiter, aiRoutes);
app.use('/', roomsRoutes);

// Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
