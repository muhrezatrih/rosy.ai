const app = require('./src/app');
const { config, validateEnv } = require('./src/config/env');

// Validate environment on boot
validateEnv();

const server = app.listen(config.port, () => {
  console.log(`🚀 Rosy AI Server running in ${config.nodeEnv} mode on http://localhost:${config.port}`);
});

// Graceful Shutdown
function handleShutdown(signal) {
  console.log(`\nReceived ${signal}. Shutting down gracefully...`);
  server.close(() => {
    console.log('HTTP server closed. Exiting process.');
    process.exit(0);
  });

  // Force shutdown after 10s if connections remain
  setTimeout(() => {
    console.error('Could not close connections in time, forcing exit.');
    process.exit(1);
  }, 10000);
}

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception thrown:', error);
  process.exit(1);
});
