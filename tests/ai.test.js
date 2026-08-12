const request = require('supertest');
const app = require('../src/app');
const geminiService = require('../src/services/gemini.service');

// Mock geminiService methods
jest.mock('../src/services/gemini.service');

describe('AI API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /generate-text', () => {
    it('should return 400 Bad Request if prompt is missing', async () => {
      const response = await request(app)
        .post('/generate-text')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toMatch(/Prompt parameter is required/);
    });

    it('should return 200 OK and text response when prompt is provided', async () => {
      geminiService.generateText.mockResolvedValue('Analisis investasi portofolio...');

      const response = await request(app)
        .post('/generate-text')
        .send({ prompt: 'Berikan analisis investasi' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.result).toBe('Analisis investasi portofolio...');
      expect(geminiService.generateText).toHaveBeenCalledWith('Berikan analisis investasi');
    });
  });

  describe('POST /generate-from-image', () => {
    it('should return 400 Bad Request if no file is uploaded', async () => {
      const response = await request(app)
        .post('/generate-from-image')
        .field('prompt', 'Test prompt');

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Image file is required');
    });

    it('should process uploaded image file successfully', async () => {
      geminiService.generateFromImage.mockResolvedValue('Hasil analisis grafik saham...');

      const fakeImageBuffer = Buffer.from('fake-image-bytes');

      const response = await request(app)
        .post('/generate-from-image')
        .attach('image', fakeImageBuffer, { filename: 'chart.png', contentType: 'image/png' })
        .field('prompt', 'Analisis grafik saham ini');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.result).toBe('Hasil analisis grafik saham...');
    });
  });

  describe('POST /generate-from-document', () => {
    it('should return 400 Bad Request if no document is uploaded', async () => {
      const response = await request(app)
        .post('/generate-from-document')
        .field('prompt', 'Ringkas dokumen');

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Document file is required');
    });

    it('should process uploaded document file successfully', async () => {
      geminiService.generateFromDocument.mockResolvedValue('Ringkasan laporan keuangan...');

      const fakeDocBuffer = Buffer.from('fake-pdf-content');

      const response = await request(app)
        .post('/generate-from-document')
        .attach('document', fakeDocBuffer, { filename: 'report.pdf', contentType: 'application/pdf' })
        .field('prompt', 'Ringkas laporan keuangan ini');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.result).toBe('Ringkasan laporan keuangan...');
    });
  });

  describe('404 Route Handler', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app).get('/unknown-endpoint');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('NOT_FOUND');
    });
  });
});
