'use client';

import React from 'react';
import { X, BookOpen, AlertCircle } from 'lucide-react';
import { HOUSE_RULES, OWNER_CONTACT } from '../data/kostData';

interface HouseRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HouseRulesModal: React.FC<HouseRulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                Tata Tertib & Panduan Penghuni Kos Ibu Ros
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Tiban Indah, Sekupang, Kota Batam • Demi Keamanan, Kenyamanan & Ketenangan Bersama
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            aria-label="Tutup Tata Tertib"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {HOUSE_RULES.map((rule, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-800/40 space-y-1.5"
              >
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold">
                    {idx + 1}
                  </span>
                  <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    {rule.title}
                  </h4>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed pl-7">
                  {rule.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Special Escalation Note */}
          <div className="mt-4 p-4 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900/50 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400 shrink-0 mt-0.5" />
            <div className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
              <span className="font-bold text-zinc-900 dark:text-zinc-100">Izin Khusus & Negosiasi:</span> Segala macam permohonan khusus (penundaan pembayaran, negosiasi masa sewa, izin membawa barang elektronik berdaya tinggi) wajib mendapatkan persetujuan langsung dari Ibu Ros melalui WhatsApp: <a href={OWNER_CONTACT.whatsappUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-emerald-600 dark:text-emerald-400 underline">{OWNER_CONTACT.phone}</a>.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs sm:text-sm font-medium rounded-lg bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition"
          >
            Mengerti & Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
