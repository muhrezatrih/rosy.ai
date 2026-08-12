const packageJson = require('../../package.json');

function checkHealth(req, res) {
  return res.status(200).json({
    status: 'ok',
    service: packageJson.name,
    version: packageJson.version,
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
  });
}

module.exports = {
  checkHealth,
};
