const request = require('supertest');
const app = require('../src/app');
const kostDb = require('../src/services/kostDb.service');

describe('Room Inventory & Tenant Management API', () => {
  beforeEach(() => {
    kostDb.resetToDefault();
  });

  describe('GET /rooms', () => {
    it('should return live inventory data with categories and rooms', async () => {
      const response = await request(app).get('/rooms');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.categories).toHaveLength(3);
      expect(response.body.data.rooms).toHaveLength(12);

      const kecil = response.body.data.categories.find((c) => c.id === 'kamar-kecil');
      expect(kecil.availableUnits).toBe(2);
      expect(kecil.totalUnits).toBe(5);

      const besar = response.body.data.categories.find((c) => c.id === 'kamar-besar');
      expect(besar.availableUnits).toBe(1);
      expect(besar.totalUnits).toBe(6);
    });
  });

  describe('POST /rooms/update-availability', () => {
    it('should update available count for a category', async () => {
      const response = await request(app)
        .post('/rooms/update-availability')
        .send({ categoryId: 'kamar-kecil', availableUnits: 4 });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      const kecil = response.body.data.categories.find((c) => c.id === 'kamar-kecil');
      expect(kecil.availableUnits).toBe(4);
    });

    it('should return 400 if categoryId is missing', async () => {
      const response = await request(app)
        .post('/rooms/update-availability')
        .send({ availableUnits: 2 });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /rooms/toggle', () => {
    it('should toggle a room from Kosong to Terisi', async () => {
      const response = await request(app)
        .post('/rooms/toggle')
        .send({ roomNumber: '102', status: 'Terisi', tenantName: 'Joko' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      const room102 = response.body.data.rooms.find((r) => r.number === '102');
      expect(room102.status).toBe('Terisi');
      expect(room102.tenantName).toBe('Joko');
    });
  });

  describe('POST /tenants and DELETE /tenants/:id', () => {
    it('should add a new tenant and update room status to Terisi', async () => {
      const response = await request(app)
        .post('/tenants')
        .send({
          name: 'Santoso',
          roomNumber: '104',
          checkInDate: '2026-08-14',
          phone: '081234567890',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.tenant.nextDueDate).toBe('2026-09-14');

      const room104 = response.body.data.rooms.find((r) => r.number === '104');
      expect(room104.status).toBe('Terisi');
      expect(room104.tenantName).toBe('Santoso');
    });

    it('should remove tenant and free up room to Kosong', async () => {
      const addRes = await request(app)
        .post('/tenants')
        .send({
          name: 'Budi',
          roomNumber: '104',
          checkInDate: '2026-08-14',
        });

      const tenantId = addRes.body.tenant.id;

      const deleteRes = await request(app).delete(`/tenants/${tenantId}`);
      expect(deleteRes.status).toBe(200);
      expect(deleteRes.body.success).toBe(true);

      const room104 = deleteRes.body.data.rooms.find((r) => r.number === '104');
      expect(room104.status).toBe('Kosong');
      expect(room104.tenantName).toBeNull();
    });
  });
});
