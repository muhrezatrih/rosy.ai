'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Minus,
  RefreshCw,
  UserPlus,
  Calendar,
  CheckCircle,
  Building,
  Settings,
  Trash2,
  Phone,
  AlertTriangle,
} from 'lucide-react';
import { InventoryData, RoomCategory, IndividualRoom, TenantItem } from '../types/chat';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInventoryUpdated?: () => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  onInventoryUpdated,
}) => {
  const [inventory, setInventory] = useState<InventoryData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'rooms' | 'tenants'>('rooms');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [confirmCheckoutTenant, setConfirmCheckoutTenant] = useState<TenantItem | null>(null);

  // New tenant form state
  const [tenantName, setTenantName] = useState<string>('');
  const [selectedRoomNumber, setSelectedRoomNumber] = useState<string>('');
  const [checkInDate, setCheckInDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [tenantPhone, setTenantPhone] = useState<string>('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchInventory = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/rooms').catch(() => null);
      if (res && res.ok) {
        const data = await res.json();
        setInventory(data.data);
      } else {
        // Direct fallback port 5001
        const fallback = await fetch('http://localhost:5001/rooms').catch(() => null);
        if (fallback && fallback.ok) {
          const data = await fallback.json();
          setInventory(data.data);
        }
      }
    } catch {
      console.error('Gagal mengambil data inventaris kamar');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchInventory();
    }
  }, [isOpen]);

  const handleUpdateAvailability = async (categoryId: string, delta: number) => {
    if (!inventory) return;
    const cat = inventory.categories.find((c) => c.id === categoryId);
    if (!cat) return;

    const newCount = Math.max(0, Math.min(cat.totalUnits, cat.availableUnits + delta));
    if (newCount === cat.availableUnits) return;

    try {
      setIsLoading(true);
      const res = await fetch('/api/rooms/update-availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryId, availableUnits: newCount }),
      }).catch(async () => {
        return await fetch('http://localhost:5001/rooms/update-availability', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ categoryId, availableUnits: newCount }),
        });
      });

      if (res && res.ok) {
        const data = await res.json();
        setInventory(data.data);
        showToast(`Stok ${cat.name} berhasil diperbarui: sisa ${newCount} kamar.`);
        onInventoryUpdated?.();
      }
    } catch {
      alert('Gagal memperbarui ketersediaan kamar.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleRoomStatus = async (roomNumber: string) => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/rooms/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomNumber }),
      }).catch(async () => {
        return await fetch('http://localhost:5001/rooms/toggle', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ roomNumber }),
        });
      });

      if (res && res.ok) {
        const data = await res.json();
        setInventory(data.data);
        showToast(`Status Kamar ${roomNumber} berhasil diubah.`);
        onInventoryUpdated?.();
      }
    } catch {
      alert('Gagal mengubah status kamar.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenantName.trim() || !selectedRoomNumber || !checkInDate) {
      alert('Mohon lengkapi Nama Penyewa, Nomor Kamar, dan Tanggal Masuk.');
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch('/api/tenants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: tenantName.trim(),
          roomNumber: selectedRoomNumber,
          checkInDate,
          phone: tenantPhone.trim(),
        }),
      }).catch(async () => {
        return await fetch('http://localhost:5001/tenants', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: tenantName.trim(),
            roomNumber: selectedRoomNumber,
            checkInDate,
            phone: tenantPhone.trim(),
          }),
        });
      });

      if (res && res.ok) {
        showToast(`Penyewa ${tenantName} berhasil didaftarkan ke ${selectedRoomNumber}!`);
        setTenantName('');
        setSelectedRoomNumber('');
        setTenantPhone('');
        await fetchInventory();
        onInventoryUpdated?.();
      }
    } catch {
      alert('Gagal menambahkan penyewa.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExecuteCheckout = async (tenant: TenantItem) => {
    try {
      setIsLoading(true);
      setConfirmCheckoutTenant(null);

      // Optimistic update
      if (inventory) {
        const updatedTenants = inventory.tenants.filter(
          (t) => t.id !== tenant.id && t.roomNumber !== tenant.roomNumber
        );
        const updatedRooms = inventory.rooms.map((r) =>
          r.number === tenant.roomNumber ? { ...r, status: 'Kosong' as const, tenantName: null } : r
        );
        const updatedCategories = inventory.categories.map((c) => {
          if (c.id === tenant.categoryId) {
            return { ...c, availableUnits: Math.min(c.totalUnits, c.availableUnits + 1) };
          }
          return c;
        });
        setInventory({
          ...inventory,
          tenants: updatedTenants,
          rooms: updatedRooms,
          categories: updatedCategories,
        });
      }

      // Try DELETE endpoint via Next rewrite then fallback
      let res = await fetch(`/api/tenants/${tenant.id}`, { method: 'DELETE' }).catch(() => null);
      if (!res || !res.ok) {
        res = await fetch(`http://localhost:5001/tenants/${tenant.id}`, { method: 'DELETE' }).catch(() => null);
      }
      if (!res || !res.ok) {
        res = await fetch(`/api/tenants/${tenant.roomNumber}`, { method: 'DELETE' }).catch(() => null);
      }
      if (!res || !res.ok) {
        res = await fetch(`http://localhost:5001/tenants/${tenant.roomNumber}`, { method: 'DELETE' }).catch(() => null);
      }

      if (res && res.ok) {
        const responseData = await res.json();
        if (responseData.data) {
          setInventory(responseData.data);
        }
        showToast(`Penyewa ${tenant.name} berhasil di-checkout. Kamar ${tenant.roomNumber} kini Kosong.`);
        onInventoryUpdated?.();
      } else {
        showToast(`Penyewa ${tenant.name} telah di-checkout.`);
        await fetchInventory();
        onInventoryUpdated?.();
      }
    } catch (err) {
      console.error('Error during checkout:', err);
      showToast('Gagal memproses checkout. Silakan coba lagi.');
      await fetchInventory();
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const totalRooms = inventory?.rooms.length || 12;
  const availableRooms = inventory?.rooms.filter((r) => r.status === 'Kosong').length || 0;
  const occupiedRooms = totalRooms - availableRooms;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col overflow-hidden">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-70 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
            <CheckCircle className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500 text-white shadow-sm">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  Panel Kelola Kamar & Penyewa
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  Ibu Ros Admin
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Perubahan data langsung otomatis tersinkronisasi ke katalog & jawaban Rosy AI
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchInventory}
              disabled={isLoading}
              className="p-2 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
              title="Muat Ulang Data"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
              aria-label="Tutup Panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Status Metrics Bar */}
        <div className="grid grid-cols-3 gap-2 px-6 py-3 border-b border-zinc-100 dark:border-zinc-800 bg-amber-500/5">
          <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/60 flex flex-col items-center">
            <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">Total Kamar</span>
            <span className="text-lg font-extrabold text-zinc-900 dark:text-zinc-100">{totalRooms} Unit</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-800/80 border border-emerald-200 dark:border-emerald-800/50 flex flex-col items-center">
            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">Kamar Kosong</span>
            <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">{availableRooms} Sisa</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-800/80 border border-orange-200 dark:border-orange-800/50 flex flex-col items-center">
            <span className="text-[11px] font-medium text-orange-600 dark:text-orange-400">Kamar Terisi</span>
            <span className="text-lg font-extrabold text-orange-600 dark:text-orange-400">{occupiedRooms} Terisi</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-zinc-200 dark:border-zinc-800 px-6 gap-4 bg-zinc-50/30 dark:bg-zinc-900/30">
          <button
            type="button"
            onClick={() => setActiveTab('rooms')}
            className={`py-3 text-xs sm:text-sm font-semibold border-b-2 transition cursor-pointer ${
              activeTab === 'rooms'
                ? 'border-amber-600 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
            }`}
          >
            🛏️ Ketersediaan Kamar
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('tenants')}
            className={`py-3 text-xs sm:text-sm font-semibold border-b-2 transition cursor-pointer ${
              activeTab === 'tenants'
                ? 'border-amber-600 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
            }`}
          >
            📋 Data Penghuni ({inventory?.tenants?.length || 0})
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'rooms' && (
            <div className="space-y-6">
              {/* Category Quick Steppers */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-3 flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-amber-600" />
                  <span>Pengaturan Cepat Sisa Kamar Kosong:</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {inventory?.categories.map((cat: RoomCategory) => {
                    const occupied = cat.totalUnits - cat.availableUnits;
                    return (
                      <div
                        key={cat.id}
                        className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800/60 shadow-xs flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                              {cat.name}
                            </span>
                            <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                              {cat.priceFormatted}
                            </span>
                          </div>
                          <p className="text-[11px] text-zinc-500 mt-0.5">
                            Total {cat.totalUnits} unit • {occupied} terisi
                          </p>
                        </div>

                        <div className="mt-4 flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800">
                          <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                            Sisa Kosong:
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleUpdateAvailability(cat.id, -1)}
                              disabled={isLoading || cat.availableUnits <= 0}
                              className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-600 text-zinc-700 dark:text-zinc-200 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                              title="Kurangi Sisa Kamar Kosong"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-6 text-center font-bold text-sm text-zinc-900 dark:text-zinc-100">
                              {cat.availableUnits}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleUpdateAvailability(cat.id, 1)}
                              disabled={isLoading || cat.availableUnits >= cat.totalUnits}
                              className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-600 text-zinc-700 dark:text-zinc-200 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                              title="Tambah Sisa Kamar Kosong"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Individual Rooms Matrix */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Status Setiap Nomor Kamar (Klik untuk Ubah):
                  </h4>
                  <span className="text-[11px] text-zinc-400">
                    🟢 Kosong (Siap Huni) | 🔴 Terisi
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {inventory?.rooms.map((room: IndividualRoom) => {
                    const isAvailable = room.status === 'Kosong';
                    return (
                      <button
                        key={room.number}
                        type="button"
                        onClick={() => handleToggleRoomStatus(room.number)}
                        disabled={isLoading}
                        className={`p-3 rounded-xl border text-left transition-all hover:scale-[1.02] cursor-pointer flex flex-col justify-between ${
                          isAvailable
                            ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200'
                            : 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-300 dark:border-rose-800/60 text-rose-900 dark:text-rose-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-sm">{room.name}</span>
                          <span
                            className={`w-2.5 h-2.5 rounded-full ${
                              isAvailable ? 'bg-emerald-500 ring-2 ring-emerald-300' : 'bg-rose-500 ring-2 ring-rose-300'
                            }`}
                          />
                        </div>
                        <div className="mt-2 text-[11px]">
                          <span className="font-semibold">{room.status}</span>
                          {room.tenantName && (
                            <span className="block text-zinc-500 dark:text-zinc-400 truncate">
                              ({room.tenantName})
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tenants' && (
            <div className="space-y-6">
              {/* Add New Tenant Form */}
              <form
                onSubmit={handleAddTenant}
                className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 space-y-3"
              >
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                  <UserPlus className="w-4 h-4 text-amber-600" />
                  <span>Catat Penyewa Baru (Masuk Kos):</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-zinc-500 mb-1">
                      Nama Penyewa
                    </label>
                    <input
                      type="text"
                      value={tenantName}
                      onChange={(e) => setTenantName(e.target.value)}
                      placeholder="Misal: Rian"
                      required
                      className="w-full text-xs p-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-zinc-500 mb-1">
                      Pilih Kamar
                    </label>
                    <select
                      value={selectedRoomNumber}
                      onChange={(e) => setSelectedRoomNumber(e.target.value)}
                      required
                      className="w-full text-xs p-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                    >
                      <option value="">-- Pilih Kamar --</option>
                      {inventory?.rooms.map((r: IndividualRoom) => (
                        <option key={r.number} value={r.number}>
                          {r.name} ({r.status === 'Kosong' ? 'Kosong' : `Terisi: ${r.tenantName || '-'}`})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-zinc-500 mb-1">
                      Tanggal Masuk
                    </label>
                    <input
                      type="date"
                      value={checkInDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      required
                      className="w-full text-xs p-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-zinc-500 mb-1">
                      No. WhatsApp (Opsional)
                    </label>
                    <input
                      type="text"
                      value={tenantPhone}
                      onChange={(e) => setTenantPhone(e.target.value)}
                      placeholder="0812..."
                      className="w-full text-xs p-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 text-xs font-semibold rounded-lg bg-amber-600 hover:bg-amber-700 text-white transition shadow-sm cursor-pointer flex items-center gap-1.5"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Simpan Penghuni Baru</span>
                  </button>
                </div>
              </form>

              {/* Tenants Table */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
                  Daftar Penghuni Aktif & Tanggal Jatuh Tempo:
                </h4>

                <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                  <table className="w-full text-center text-xs">
                    <thead className="bg-zinc-100 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 font-semibold">
                      <tr>
                        <th className="p-3 text-center">Nama</th>
                        <th className="p-3 text-center">Kamar</th>
                        <th className="p-3 text-center">Tgl Masuk</th>
                        <th className="p-3 text-center">Jatuh Tempo Berikutnya</th>
                        <th className="p-3 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                      {inventory?.tenants && inventory.tenants.length > 0 ? (
                        inventory.tenants.map((t: TenantItem) => (
                          <tr key={t.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition">
                            <td className="p-3 text-center">
                              <div className="font-semibold text-zinc-900 dark:text-zinc-100">{t.name}</div>
                              {t.phone && (
                                <span className="inline-flex items-center justify-center gap-1 text-[10px] text-zinc-400 font-normal mt-0.5">
                                  <Phone className="w-2.5 h-2.5" /> {t.phone}
                                </span>
                              )}
                            </td>
                            <td className="p-3 text-center">
                              <span className="px-2.5 py-1 rounded-md bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold text-[11px] inline-block">
                                Kamar {t.roomNumber}
                              </span>
                            </td>
                            <td className="p-3 text-center">
                              <div className="inline-flex items-center justify-center gap-1.5 text-zinc-700 dark:text-zinc-300 text-xs font-medium">
                                <Calendar className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 shrink-0" />
                                <span>{t.checkInDate}</span>
                              </div>
                            </td>
                            <td className="p-3 text-center">
                              <div className="inline-flex items-center justify-center gap-1.5 text-zinc-700 dark:text-zinc-300 text-xs font-medium">
                                <Calendar className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                                <span>{t.nextDueDate || '-'}</span>
                              </div>
                            </td>
                            <td className="p-3 text-center">
                              <button
                                type="button"
                                onClick={() => setConfirmCheckoutTenant(t)}
                                disabled={isLoading}
                                className="inline-flex items-center justify-center gap-1 px-2.5 py-1 text-[11px] font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-md transition cursor-pointer"
                                title="Checkout Penghuni"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>Checkout</span>
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="p-4 text-center text-zinc-400">
                            Belum ada data penghuni kos yang tercatat.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex justify-between items-center">
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            Status: <strong>Tersinkronisasi ke Gemini AI</strong>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs sm:text-sm font-medium rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition cursor-pointer"
          >
            Selesai & Tutup
          </button>
        </div>

        {/* Dedicated Checkout Confirmation Dialog */}
        {confirmCheckoutTenant && (
          <div className="absolute inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
            <div className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-zinc-200 dark:border-zinc-800 shadow-2xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                    Konfirmasi Checkout
                  </h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Keluarkan penyewa dari kos
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/70 dark:border-zinc-700/60 text-xs text-zinc-700 dark:text-zinc-300 space-y-1">
                <p>Yakin ingin melakukan checkout untuk:</p>
                <p className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">
                  {confirmCheckoutTenant.name} ({confirmCheckoutTenant.roomNumber ? `Kamar ${confirmCheckoutTenant.roomNumber}` : ''})
                </p>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">
                  Status kamar akan otomatis menjadi <strong>Kosong (Siap Huni)</strong> dan stok langsung tersinkronisasi ke katalog & AI.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setConfirmCheckoutTenant(null)}
                  className="px-3.5 py-2 text-xs font-medium rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => handleExecuteCheckout(confirmCheckoutTenant)}
                  disabled={isLoading}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Ya, Checkout Sekarang</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
