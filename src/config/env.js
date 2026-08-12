require('dotenv').config();

const { DEFAULT_GEMINI_MODEL, DEFAULT_MAX_FILE_SIZE_MB } = require('./constants');

function validateEnv() {
  if (!process.env.GEMINI_API_KEY) {
    if (process.env.NODE_ENV === 'test') {
      console.warn('Warning: GEMINI_API_KEY is not set. Running in test environment mode.');
    } else {
      throw new Error(
        'FATAL: GEMINI_API_KEY environment variable is missing. Please set it in your .env file or environment.'
      );
    }
  }
}

const config = {
  port: parseInt(process.env.PORT, 10) || 5001,
  nodeEnv: process.env.NODE_ENV || 'development',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  geminiModel: process.env.GEMINI_MODEL || DEFAULT_GEMINI_MODEL,
  allowedOrigins: process.env.ALLOWED_ORIGINS || '*',
  maxFileSizeMB: parseInt(process.env.MAX_FILE_SIZE_MB, 10) || DEFAULT_MAX_FILE_SIZE_MB,
  rateLimitWindowMin: parseInt(process.env.RATE_LIMIT_WINDOW_MIN, 10) || 15,
  rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,
};

module.exports = {
  config,
  validateEnv,
};
