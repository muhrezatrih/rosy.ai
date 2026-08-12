const request = require('supertest');
const app = require('../src/app');

describe('GET /health', () => {
  it('should return 200 OK with health status metadata', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'ok');
    expect(response.body).toHaveProperty('service', 'invest-buddy');
    expect(response.body).toHaveProperty('version');
    expect(response.body).toHaveProperty('timestamp');
    expect(response.body).toHaveProperty('uptimeSeconds');
  });
});
