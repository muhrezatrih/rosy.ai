const express = require('express');
const router = express.Router();
const roomsController = require('../controllers/rooms.controller');

// GET all rooms & inventory
router.get('/rooms', (req, res, next) => roomsController.getInventory(req, res, next));

// POST update category availability (e.g. kamar kecil available count)
router.post('/rooms/update-availability', (req, res, next) => roomsController.updateCategoryAvailability(req, res, next));

// POST toggle individual room status
router.post('/rooms/toggle', (req, res, next) => roomsController.toggleRoomStatus(req, res, next));

// POST add new tenant
router.post('/tenants', (req, res, next) => roomsController.addTenant(req, res, next));

// DELETE remove tenant / checkout
router.delete('/tenants/:tenantId', (req, res, next) => roomsController.removeTenant(req, res, next));

// POST reset db
router.post('/rooms/reset', (req, res, next) => roomsController.resetDatabase(req, res, next));

module.exports = router;
