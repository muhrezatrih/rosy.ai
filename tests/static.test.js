const request = require('supertest');
const app = require('../src/app');

describe('Static Frontend Asset Serving', () => {
  it('should serve index.html at root route GET /', async () => {
    const response = await request(app).get('/');

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/text\/html/);
    expect(response.text).toContain('Kost Ibu Ros');
    expect(response.text).toContain('chat-box');
  });

  it('should serve style.css via GET /style.css', async () => {
    const response = await request(app).get('/style.css');

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/text\/css/);
    expect(response.text).toContain('--accent-primary');
  });

  it('should serve script.js via GET /script.js', async () => {
    const response = await request(app).get('/script.js');

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/javascript/);
    expect(response.text).toContain('checkBackendHealth');
  });
});
