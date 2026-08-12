const rateLimit = require('express-rate-limit');
const { config } = require('../config/env');

const limiter = rateLimit({
  windowMs: config.rateLimitWindowMin * 60 * 1000,
  max: config.rateLimitMaxRequests,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      message: 'Too many requests from this IP, please try again later.',
      code: 'RATE_LIMIT_EXCEEDED',
    },
  },
});

module.exports = limiter;
