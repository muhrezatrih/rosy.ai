'use client';

import React, { useState, useEffect } from 'react';
import { X, Check, Bed, Sparkles, Send } from 'lucide-react';
import { ROOM_CATALOG } from '../data/kostData';
import { RoomCategory } from '../types/chat';

interface RoomCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPrompt: (prompt: string) => void;
  liveCategories?: RoomCategory[];
}

export const RoomCatalogModal: React.FC<RoomCatalogModalProps> = ({
  isOpen,
  onClose,
  onSelectPrompt,
  liveCategories,
}) => {
  const [categories, setCategories] = useState<RoomCategory[] | null>(liveCategories || null);

  useEffect(() => {
    if (liveCategories) {
      setCategories(liveCategories);
      return;
    }
    if (isOpen) {
      fetch('/api/rooms')
        .then((res) => res.json())
        .then((data) => {
          if (data.data?.categories) {
            setCategories(data.data.categories);
          }
        })
        .catch(() => {
          // Fallback direct port 5001
          fetch('http://localhost:5001/rooms')
            .then((res) => res.json())
            .then((data) => {
              if (data.data?.categories) {
                setCategories(data.data.categories);
              }
            })
            .catch(() => null);
        });
    }
  }, [isOpen, liveCategories]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Bed className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                Pilihan Tipe Kamar Kost Ibu Ros (Tiban Indah, Batam)
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Semua kamar disewakan <strong>Kosongan (Unfurnished)</strong> • Free pemakaian listrik & air
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            aria-label="Tutup Katalog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Room Grid */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {ROOM_CATALOG.map((room) => {
              const liveCat = categories?.find((c) => c.id === room.id);
              let statusLabel = room.status;
              let isAvailable = true;

              if (liveCat) {
                if (liveCat.availableUnits === 0) {
                  statusLabel = 'Penuh (Waiting List)';
                  isAvailable = false;
                } else if (liveCat.availableUnits === 1) {
                  statusLabel = 'Sisa 1 Kamar';
                } else {
                  statusLabel = `Sisa ${liveCat.availableUnits} Kamar`;
                }
              }

              return (
                <div
                  key={room.id}
                  className="flex flex-col rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
                >
                  {/* Room Header & Tag */}
                  <div className="p-4 border-b border-zinc-100 dark:border-zinc-800/80 bg-gradient-to-b from-zinc-50 to-transparent dark:from-zinc-800/40">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-semibold tracking-wide uppercase px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                        {room.tag}
                      </span>
                      <span
                        className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                          !isAvailable
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            : statusLabel.includes('Sisa 1')
                            ? 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300 animate-pulse'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        }`}
                      >
                        {statusLabel}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                      {room.title}
                    </h4>
                    <div className="mt-1 flex items-baseline gap-1">
                      <span className="text-xl font-extrabold text-amber-600 dark:text-amber-400">
                        {room.price}
                      </span>
                      <span className="text-xs text-zinc-500 dark:text-zinc-400">
                        {room.period}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                      {liveCat ? `${liveCat.size} (${liveCat.totalUnits} Total Unit)` : room.size}
                    </p>
                  </div>

                  {/* Facilities List */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                        Detail Kamar & Kondisi:
                      </p>
                      <ul className="space-y-1.5">
                        {room.facilities.map((fac, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                            <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{fac}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        onSelectPrompt(`Halo Rosy, saya tertarik untuk menyewa ${room.title} (${room.price}${room.period}) di Kost Ibu Ros Tiban Indah. Saat ini apakah masih ada kamar kosongan yang kosong dan bagaimana prosedur bookingnya?`);
                        onClose();
                      }}
                      className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-lg bg-amber-600 hover:bg-amber-700 text-white transition shadow-sm cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Tanya Kamar Ini</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Shared Amenities Notice */}
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
              <span className="font-bold text-zinc-900 dark:text-zinc-100">Catatan Kondisi Kamar & Fasilitas Bersama:</span> Semua kamar disewakan <em>kosongan tanpa perabot</em> (penghuni membawa kasur & lemari sendiri). Fasilitas bersama yang tersedia meliputi dapur bersama, kamar mandi bersama (untuk kamar reguler), parkiran motor, serta pengawasan keamanan CCTV 24 jam.
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs sm:text-sm font-medium rounded-lg bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
