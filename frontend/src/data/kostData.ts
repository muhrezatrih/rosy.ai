import { RoomItem } from '../types/chat';

export const OWNER_CONTACT = {
  name: 'Ibu Ros (Pemilik Kos)',
  phone: '+6281266641431',
  digits: '6281266641431',
  whatsappUrl: 'https://wa.me/6281266641431',
  address: 'Jl. Tiban Indah No. 18, Sekupang, Kota Batam, Kepulauan Riau',
  operatingHours: '07:00 - 21:00 WIB',
};

export const ROOM_CATALOG: RoomItem[] = [
  {
    id: 'kamar-kecil',
    title: 'Kamar Kecil (Kosongan)',
    price: 'Rp 600.000',
    period: '/ bulan',
    size: 'Ukuran Kompak (5 Unit)',
    status: 'Tersedia',
    tag: 'Kosongan • Hemat',
    accentColor: 'emerald',
    description: 'Kamar kosongan ukuran standar & kompak, pas dan leluasa untuk Anda tata dengan perabot sendiri.',
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
    title: 'Kamar Besar (Kosongan)',
    price: 'Rp 700.000',
    period: '/ bulan',
    size: 'Ukuran Lebih Luas (6 Unit)',
    status: 'Tersedia',
    tag: 'Kosongan • Lega',
    accentColor: 'amber',
    description: 'Kamar kosongan ukuran lebih luas & lega, ruang gerak ekstra leluasa untuk menaruh kasur dan lemari bawaan.',
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
    title: 'Paviliun Mandiri (Kosongan)',
    price: 'Rp 1.500.000',
    period: '/ bulan',
    size: '1 Unit Eksklusif',
    status: 'Tersedia',
    tag: 'Kosongan • Privat',
    accentColor: 'rose',
    description: 'Unit paviliun mandiri kosongan yang sangat luas, privat, dan leluasa selayaknya rumah mini.',
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
];

export const QUICK_CATEGORIES = [
  {
    category: '🏠 Kamar Kosongan (600rb - 1.5jt)',
    prompts: [
      'Apakah kamar di Kost Ibu Ros sudah ada isinya atau kosongan?',
      'Apa perbedaan antara Kamar Kecil 600rb dan Kamar Besar 700rb?',
      'Berapa tarif unit Paviliun mandiri dan bagaimana kondisinya?',
    ],
  },
  {
    category: '🍳 Fasilitas Bersama & Utilitas',
    prompts: [
      'Apa saja fasilitas bersama yang tersedia di Kost Ibu Ros?',
      'Apakah biaya sewa sudah termasuk listrik dan air?',
      'Apakah di kosan ini tersedia fasilitas Wi-Fi?',
    ],
  },
  {
    category: '💳 Jatuh Tempo & Pembayaran',
    prompts: [
      'Bagaimana sistem jatuh tempo pembayaran sewa jika saya masuk tanggal 14 Agustus?',
      'Ke mana rekening resmi pembayaran sewa kos?',
      'Bolehkah saya bayar sewa telat 15 hari setelah mulai tinggal?',
    ],
  },
  {
    category: '📍 Lokasi & Parkir Motor',
    prompts: [
      'Di mana alamat lengkap Kost Ibu Ros di Tiban Indah Batam?',
      'Berapa menit jarak ke Pelabuhan Ferry Sekupang atau kawasan Nagoya?',
      'Apakah ada parkiran motor yang aman dan terpantau CCTV?',
    ],
  },
  {
    category: '⏰ Jam Malam & Tata Tertib',
    prompts: [
      'Apakah ada jam malam untuk gerbang kos dan apakah penyewa dapat kunci akses?',
      'Bagaimana aturan menerima tamu di kosan?',
      'Bolehkah membawa hewan peliharaan di kamar kos?',
    ],
  },
];

export const HOUSE_RULES = [
  {
    title: 'Kondisi Kamar Kosongan (Unfurnished)',
    desc: 'Seluruh kamar disewakan kosongan tanpa perabot. Penghuni membawa kasur, lemari, dan perlengkapan tidur sendiri.',
  },
  {
    title: 'Jatuh Tempo Sesuai Tanggal Masuk',
    desc: 'Pembayaran sewa jatuh tempo setiap bulan sesuai tanggal awal masuk (misal masuk 14 Agustus, maka jatuh tempo berikutnya 14 September).',
  },
  {
    title: 'Listrik & Air Sudah Termasuk',
    desc: 'Biaya sewa bulanan sudah mencakup pemakaian listrik dan air standar (tidak ada biaya token tambahan).',
  },
  {
    title: 'Fasilitas Bersama',
    desc: 'Tersedia dapur bersama, kamar mandi bersama (untuk kamar reguler), parkiran motor, dan pengawasan keamanan CCTV 24 jam.',
  },
  {
    title: 'Koneksi Internet / Wi-Fi',
    desc: 'Kos tidak menyediakan fasilitas Wi-Fi bersama. Penghuni disarankan menggunakan kuota internet atau modem MiFi pribadi.',
  },
  {
    title: 'Akses Gerbang 24 Jam & Jam Tenang',
    desc: 'Setiap penyewa diberikan kunci/akses gerbang 24 jam. Jam tenang dimulai pukul 22:00 WIB demi kenyamanan istirahat bersama.',
  },
];
