const { config } = require('../config/env');

/**
 * 404 Not Found Middleware
 */
function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    error: {
      message: `Route not found: ${req.method} ${req.originalUrl}`,
      code: 'NOT_FOUND',
    },
  });
}

/**
 * Global Error Handler Middleware
 */
function errorHandler(err, req, res, _next) {
  const statusCode = err.statusCode || err.status || 500;

  // Log error details on server
  if (config.nodeEnv !== 'test') {
    console.error(`[Error] ${req.method} ${req.originalUrl}:`, err);
  }

  res.status(statusCode).json({
    success: false,
    error: {
      message: err.message || 'Internal Server Error',
      code: err.code || 'INTERNAL_SERVER_ERROR',
      ...(config.nodeEnv === 'development' && { stack: err.stack }),
    },
  });
}

module.exports = {
  notFoundHandler,
  errorHandler,
};
