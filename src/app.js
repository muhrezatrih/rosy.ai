const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimiter = require('./middleware/rateLimiter.middleware');
const { notFoundHandler, errorHandler } = require('./middleware/error.middleware');
const aiRoutes = require('./routes/ai.routes');
const healthRoutes = require('./routes/health.routes');
const { config } = require('./config/env');

const app = express();

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: config.allowedOrigins,
    optionsSuccessStatus: 200,
  })
);

// Rate limiting
app.use(rateLimiter);

// Body parsing
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use('/', healthRoutes);
app.use('/', aiRoutes);

// Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
