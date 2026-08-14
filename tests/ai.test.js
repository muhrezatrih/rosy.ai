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
      geminiService.generateText.mockResolvedValue('Tersedia Kamar Kecil 600rb (5 unit), Kamar Besar 700rb (6 unit), dan Paviliun 1.5jt. Listrik dan air sudah termasuk.');

      const response = await request(app)
        .post('/generate-text')
        .send({ prompt: 'Berapa harga kamar kecil dan kamar besar?' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.result).toContain('Kamar Kecil 600rb');
      expect(response.body.escalation).toBeDefined();
      expect(response.body.escalation.ownerNumber).toBe('+6281266641431');
      expect(geminiService.generateText).toHaveBeenCalledWith('Berapa harga kamar kecil dan kamar besar?');
    });

    it('should flag escalation as required when tenant asks for delayed payment / special decisions', async () => {
      geminiService.generateText.mockResolvedValue(
        'Untuk penundaan pembayaran sewa setelah 15 hari, saya tidak memiliki wewenang ya Kak. Silakan hubungi langsung Ibu Ros di WhatsApp +6281266641431.'
      );

      const response = await request(app)
        .post('/generate-text')
        .send({ prompt: 'Bolehkah saya bayar sewa telat 15 hari setelah tinggal?' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.escalation.required).toBe(true);
      expect(response.body.escalation.ownerNumber).toBe('+6281266641431');
      expect(response.body.escalation.whatsappUrl).toContain('6281266641431');
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
      geminiService.generateFromImage.mockResolvedValue('Bukti transfer pembayaran sewa kamar 101 telah diverifikasi.');

      const fakeImageBuffer = Buffer.from('fake-image-bytes');

      const response = await request(app)
        .post('/generate-from-image')
        .attach('image', fakeImageBuffer, { filename: 'transfer.png', contentType: 'image/png' })
        .field('prompt', 'Verifikasi bukti transfer sewa kos ini');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.result).toBe('Bukti transfer pembayaran sewa kamar 101 telah diverifikasi.');
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
      geminiService.generateFromDocument.mockResolvedValue('Ringkasan surat perjanjian sewa kos...');

      const fakeDocBuffer = Buffer.from('fake-pdf-content');

      const response = await request(app)
        .post('/generate-from-document')
        .attach('document', fakeDocBuffer, { filename: 'perjanjian_sewa.pdf', contentType: 'application/pdf' })
        .field('prompt', 'Ringkas isi dokumen perjanjian sewa kos ini');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.result).toBe('Ringkasan surat perjanjian sewa kos...');
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
