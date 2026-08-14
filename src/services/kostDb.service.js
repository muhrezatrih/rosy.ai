const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../data/kost_db.json');

const INITIAL_DB_DATA = {
  summary: {
    name: 'Kost Ibu Ros',
    address: 'Jl. Tiban Indah No. 18, Sekupang, Kota Batam',
    totalRooms: 12, // 5 kecil + 6 besar + 1 paviliun
  },
  categories: [
    {
      id: 'kamar-kecil',
      name: 'Kamar Kecil (Kosongan)',
      type: 'Kamar Kecil',
      priceMonthly: 600000,
      priceFormatted: 'Rp 600.000',
      totalUnits: 5,
      availableUnits: 2, // Example default: 2 sisa, 3 terisi
      condition: 'Kosongan (Unfurnished)',
      size: 'Ukuran Kompak',
      description: 'Kamar kosongan ukuran standar & kompak, pas dan leluasa untuk ditata sendiri.',
      facilities: [
        'Kondisi: Kamar Kosongan (Unfurnished)',
        'Bebas Membawa & Menata Perabot Sendiri',
        'Ukuran Kamar Standar & Kompak',
        'Ventilasi Jendela Bagus & Terang',
        'Akses Kamar Mandi Bersama',
        'Listrik & Air SUDAH TERMASUK (Gratis)',
        'Tanpa Wi-Fi (Gunakan kuota/modem pribadi)',
      ],
    },
    {
      id: 'kamar-besar',
      name: 'Kamar Besar (Kosongan)',
      type: 'Kamar Besar',
      priceMonthly: 700000,
      priceFormatted: 'Rp 700.000',
      totalUnits: 6,
      availableUnits: 1, // Example default: 1 sisa, 5 terisi
      condition: 'Kosongan (Unfurnished)',
      size: 'Ukuran Lebih Luas',
      description: 'Kamar kosongan ukuran lebih luas & lega, ruang gerak leluasa untuk perabot bawaan.',
      facilities: [
        'Kondisi: Kamar Kosongan (Unfurnished)',
        'Ukuran Kamar Lebih Luas & Ekstra Lega',
        'Ruang Gerak Leluasa untuk Perabot Pribadi',
        'Ventilasi Jendela Bagus & Terang',
        'Akses Kamar Mandi Bersama',
        'Listrik & Air SUDAH TERMASUK (Gratis)',
        'Tanpa Wi-Fi (Gunakan kuota/modem pribadi)',
      ],
    },
    {
      id: 'paviliun',
      name: 'Paviliun Mandiri (Kosongan)',
      type: 'Paviliun',
      priceMonthly: 1500000,
      priceFormatted: 'Rp 1.500.000',
      totalUnits: 1,
      availableUnits: 1, // Example default: 1 sisa (siap huni)
      condition: 'Kosongan (Unfurnished)',
      size: 'Unit Eksklusif',
      description: 'Unit paviliun mandiri kosongan sangat luas dan privat selayaknya rumah mini.',
      facilities: [
        'Kondisi: Unit Kosongan (Unfurnished)',
        'Ruang Tamu / Santai Pribadi Sangat Luas',
        'Kamar Tidur Luas & Mandiri',
        'Kamar Mandi Dalam Pribadi',
        'Area Dapur / Teras Sendiri',
        'Listrik & Air SUDAH TERMASUK (Gratis)',
        'Tanpa Wi-Fi (Gunakan kuota/modem pribadi)',
      ],
    },
  ],
  rooms: [
    // 5 Kamar Kecil
    { number: '101', categoryId: 'kamar-kecil', name: 'Kamar 101', status: 'Terisi', tenantName: 'Rian' },
    { number: '102', categoryId: 'kamar-kecil', name: 'Kamar 102', status: 'Kosong', tenantName: null },
    { number: '103', categoryId: 'kamar-kecil', name: 'Kamar 103', status: 'Terisi', tenantName: 'Bima' },
    { number: '104', categoryId: 'kamar-kecil', name: 'Kamar 104', status: 'Kosong', tenantName: null },
    { number: '105', categoryId: 'kamar-kecil', name: 'Kamar 105', status: 'Terisi', tenantName: 'Dimas' },
    // 6 Kamar Besar
    { number: '201', categoryId: 'kamar-besar', name: 'Kamar 201', status: 'Terisi', tenantName: 'Fajar' },
    { number: '202', categoryId: 'kamar-besar', name: 'Kamar 202', status: 'Terisi', tenantName: 'Aldi' },
    { number: '203', categoryId: 'kamar-besar', name: 'Kamar 203', status: 'Terisi', tenantName: 'Reza' },
    { number: '204', categoryId: 'kamar-besar', name: 'Kamar 204', status: 'Kosong', tenantName: null },
    { number: '205', categoryId: 'kamar-besar', name: 'Kamar 205', status: 'Terisi', tenantName: 'Yusuf' },
    { number: '206', categoryId: 'kamar-besar', name: 'Kamar 206', status: 'Terisi', tenantName: 'Kevin' },
    // 1 Paviliun
    { number: 'PV-01', categoryId: 'paviliun', name: 'Paviliun 01', status: 'Kosong', tenantName: null },
  ],
  tenants: [
    { id: 't-1', name: 'Rian', roomNumber: '101', categoryId: 'kamar-kecil', checkInDate: '2026-08-01', nextDueDate: '2026-09-01', phone: '08123456789' },
    { id: 't-2', name: 'Bima', roomNumber: '103', categoryId: 'kamar-kecil', checkInDate: '2026-08-10', nextDueDate: '2026-09-10', phone: '08129876543' },
    { id: 't-3', name: 'Dimas', roomNumber: '105', categoryId: 'kamar-kecil', checkInDate: '2026-08-14', nextDueDate: '2026-09-14', phone: '08137788990' },
    { id: 't-4', name: 'Fajar', roomNumber: '201', categoryId: 'kamar-besar', checkInDate: '2026-07-20', nextDueDate: '2026-08-20', phone: '08521122334' },
    { id: 't-5', name: 'Aldi', roomNumber: '202', categoryId: 'kamar-besar', checkInDate: '2026-08-05', nextDueDate: '2026-09-05', phone: '08534455667' },
    { id: 't-6', name: 'Reza', roomNumber: '203', categoryId: 'kamar-besar', checkInDate: '2026-08-12', nextDueDate: '2026-09-12', phone: '08781199228' },
    { id: 't-7', name: 'Yusuf', roomNumber: '205', categoryId: 'kamar-besar', checkInDate: '2026-07-15', nextDueDate: '2026-08-15', phone: '08198877665' },
    { id: 't-8', name: 'Kevin', roomNumber: '206', categoryId: 'kamar-besar', checkInDate: '2026-08-03', nextDueDate: '2026-09-03', phone: '08215566778' },
  ],
};

// Ensure database file exists
function ensureDb() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(INITIAL_DB_DATA, null, 2), 'utf-8');
  }
}

function readDb() {
  ensureDb();
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return JSON.parse(JSON.stringify(INITIAL_DB_DATA));
  }
}

function writeDb(data) {
  ensureDb();
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

// Calculate next due date automatically based on check-in date
function calculateNextDueDate(checkInDateStr) {
  if (!checkInDateStr) return '';
  const date = new Date(checkInDateStr);
  if (isNaN(date.getTime())) return '';
  // Add 1 month
  date.setMonth(date.getMonth() + 1);
  return date.toISOString().split('T')[0];
}

// Recalculate available units for all categories based on rooms array
function syncCategoryAvailability(db) {
  db.categories.forEach((cat) => {
    const matchingRooms = db.rooms.filter((r) => r.categoryId === cat.id);
    if (matchingRooms.length > 0) {
      cat.totalUnits = matchingRooms.length;
      cat.availableUnits = matchingRooms.filter((r) => r.status === 'Kosong').length;
    }
  });
}

class KostDbService {
  getInventory() {
    const db = readDb();
    syncCategoryAvailability(db);
    return db;
  }

  updateCategoryAvailability(categoryId, availableUnits) {
    const db = readDb();
    const cat = db.categories.find((c) => c.id === categoryId);
    if (!cat) throw new Error(`Kategori kamar dengan ID '${categoryId}' tidak ditemukan.`);

    const count = Math.max(0, Math.min(cat.totalUnits, parseInt(availableUnits, 10)));
    cat.availableUnits = count;

    // Adjust individual rooms to match
    const roomsOfCat = db.rooms.filter((r) => r.categoryId === categoryId);
    let remainingAvailable = count;
    roomsOfCat.forEach((room) => {
      if (remainingAvailable > 0) {
        room.status = 'Kosong';
        room.tenantName = null;
        remainingAvailable--;
      } else {
        room.status = 'Terisi';
        if (!room.tenantName) room.tenantName = 'Penghuni';
      }
    });

    writeDb(db);
    return db;
  }

  toggleRoomStatus(roomNumber, status, tenantName = null) {
    const db = readDb();
    const room = db.rooms.find((r) => r.number === roomNumber);
    if (!room) throw new Error(`Kamar ${roomNumber} tidak ditemukan.`);

    room.status = status || (room.status === 'Kosong' ? 'Terisi' : 'Kosong');
    if (room.status === 'Kosong') {
      room.tenantName = null;
      // Remove from tenants if any
      db.tenants = db.tenants.filter((t) => t.roomNumber !== roomNumber);
    } else {
      room.tenantName = tenantName || room.tenantName || 'Penghuni Baru';
    }

    syncCategoryAvailability(db);
    writeDb(db);
    return db;
  }

  addTenant({ name, roomNumber, checkInDate, phone }) {
    const db = readDb();
    const room = db.rooms.find((r) => r.number === roomNumber);
    if (!room) throw new Error(`Kamar ${roomNumber} tidak ditemukan.`);

    const nextDueDate = calculateNextDueDate(checkInDate);
    const newTenant = {
      id: `t-${Date.now()}`,
      name,
      roomNumber,
      categoryId: room.categoryId,
      checkInDate,
      nextDueDate,
      phone: phone || '',
    };

    // Update room status
    room.status = 'Terisi';
    room.tenantName = name;

    // Remove existing tenant on this room if any, then push new
    db.tenants = db.tenants.filter((t) => t.roomNumber !== roomNumber);
    db.tenants.push(newTenant);

    syncCategoryAvailability(db);
    writeDb(db);
    return { db, tenant: newTenant };
  }

  removeTenant(identifier) {
    const db = readDb();
    let tenant = db.tenants.find((t) => t.id === identifier);
    if (!tenant) {
      tenant = db.tenants.find((t) => t.roomNumber === identifier);
    }

    if (tenant) {
      const roomNum = tenant.roomNumber;
      db.tenants = db.tenants.filter((t) => t.id !== tenant.id && t.roomNumber !== roomNum);
      const room = db.rooms.find((r) => r.number === roomNum);
      if (room) {
        room.status = 'Kosong';
        room.tenantName = null;
      }
    } else {
      // Check if identifier is directly a roomNumber
      const room = db.rooms.find((r) => r.number === identifier);
      if (room) {
        room.status = 'Kosong';
        room.tenantName = null;
        db.tenants = db.tenants.filter((t) => t.roomNumber !== identifier);
      } else {
        throw new Error(`Penyewa / Kamar '${identifier}' tidak ditemukan.`);
      }
    }

    syncCategoryAvailability(db);
    writeDb(db);
    return db;
  }

  resetToDefault() {
    writeDb(INITIAL_DB_DATA);
    return INITIAL_DB_DATA;
  }
}

module.exports = new KostDbService();
