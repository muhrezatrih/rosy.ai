const kostDb = require('../services/kostDb.service');

class RoomsController {
  getInventory(req, res, next) {
    try {
      const data = kostDb.getInventory();
      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  updateCategoryAvailability(req, res, next) {
    try {
      const { categoryId, availableUnits } = req.body;
      if (!categoryId || availableUnits === undefined) {
        return res.status(400).json({
          success: false,
          error: { message: 'categoryId dan availableUnits wajib diisi.' },
        });
      }

      const updatedDb = kostDb.updateCategoryAvailability(categoryId, parseInt(availableUnits, 10));
      res.status(200).json({
        success: true,
        message: `Ketersediaan kategori ${categoryId} berhasil diperbarui menjadi ${availableUnits} unit.`,
        data: updatedDb,
      });
    } catch (error) {
      next(error);
    }
  }

  toggleRoomStatus(req, res, next) {
    try {
      const { roomNumber, status, tenantName } = req.body;
      if (!roomNumber) {
        return res.status(400).json({
          success: false,
          error: { message: 'roomNumber wajib diisi.' },
        });
      }

      const updatedDb = kostDb.toggleRoomStatus(roomNumber, status, tenantName);
      res.status(200).json({
        success: true,
        message: `Status kamar ${roomNumber} berhasil diperbarui.`,
        data: updatedDb,
      });
    } catch (error) {
      next(error);
    }
  }

  addTenant(req, res, next) {
    try {
      const { name, roomNumber, checkInDate, phone } = req.body;
      if (!name || !roomNumber || !checkInDate) {
        return res.status(400).json({
          success: false,
          error: { message: 'Nama penyewa, nomor kamar, dan tanggal masuk wajib diisi.' },
        });
      }

      const { db, tenant } = kostDb.addTenant({ name, roomNumber, checkInDate, phone });
      res.status(201).json({
        success: true,
        message: `Penyewa ${name} berhasil ditambahkan ke kamar ${roomNumber}.`,
        tenant,
        data: db,
      });
    } catch (error) {
      next(error);
    }
  }

  removeTenant(req, res, next) {
    try {
      const { tenantId } = req.params;
      if (!tenantId) {
        return res.status(400).json({
          success: false,
          error: { message: 'tenantId parameter wajib disertakan.' },
        });
      }

      const updatedDb = kostDb.removeTenant(tenantId);
      res.status(200).json({
        success: true,
        message: `Penyewa berhasil di-checkout dan kamar telah dikosongkan.`,
        data: updatedDb,
      });
    } catch (error) {
      next(error);
    }
  }

  resetDatabase(req, res, next) {
    try {
      const data = kostDb.resetToDefault();
      res.status(200).json({
        success: true,
        message: 'Database berhasil di-reset ke pengaturan awal.',
        data,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new RoomsController();
