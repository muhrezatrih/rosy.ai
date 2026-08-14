'use client';

import React from 'react';
import { Sparkles, MessageCircle, BookOpen, BedDouble, Settings, LogOut } from 'lucide-react';
import { OWNER_CONTACT } from '../data/kostData';

interface HeaderProps {
  onOpenRooms: () => void;
  onOpenRules: () => void;
  onOpenAdmin: () => void;
  onOpenLogin: () => void;
  onClearChat?: () => void;
  isAdminAuthenticated: boolean;
  onLogout: () => void;
  isBackendConnected: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenRooms,
  onOpenRules,
  onOpenAdmin,
  onOpenLogin,
  isAdminAuthenticated,
  onLogout,
  isBackendConnected,
}) => {
  const handleLogoClick = () => {
    if (isAdminAuthenticated) {
      onOpenAdmin();
    } else {
      onOpenLogin();
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/85 dark:bg-zinc-900/85 backdrop-blur-md border-b border-zinc-200/80 dark:border-zinc-800 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand & Startup Identity - Click logo to trigger Login / Admin */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleLogoClick}
            className="relative group cursor-pointer focus:outline-none"
            title={isAdminAuthenticated ? 'Buka Panel Kelola Kos' : 'Klik untuk Login Pemilik Kos'}
          >
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-xs border border-zinc-200 dark:border-zinc-700 bg-white group-hover:scale-105 transition-transform">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/icon.png" alt="Rosy Logo" className="w-full h-full object-cover" />
            </div>
            <span
              className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-zinc-900 ${
                isBackendConnected ? 'bg-emerald-500 ring-2 ring-emerald-400/30 animate-pulse' : 'bg-rose-500'
              }`}
              title={isBackendConnected ? 'Rosy Online & Siap Menjawab' : 'Menghubungkan ke server...'}
            />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight flex items-center gap-1.5">
                <span>Rosy</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  AI Concierge
                </span>
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-full bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                <Sparkles className="w-3 h-3 text-amber-600" />
                Kost Ibu Ros • Tiban Indah
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 hidden sm:block">
              24/7 Smart Kost Assistant • Free Listrik & Air • Tiban Indah, Batam
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Room Catalog Button */}
          <button
            type="button"
            onClick={onOpenRooms}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition border border-zinc-200 dark:border-zinc-700 cursor-pointer"
            title="Lihat Daftar Tipe & Tarif Kamar"
          >
            <BedDouble className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span className="hidden md:inline">Tipe Kamar</span>
          </button>

          {/* House Rules Button */}
          <button
            type="button"
            onClick={onOpenRules}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition border border-zinc-200 dark:border-zinc-700 cursor-pointer"
            title="Tata Tertib & Aturan Kos"
          >
            <BookOpen className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            <span className="hidden md:inline">Tata Tertib</span>
          </button>

          {/* Admin Mode vs Tenant Mode controls */}
          {isAdminAuthenticated ? (
            <div className="flex items-center gap-2 animate-in fade-in">
              <button
                type="button"
                onClick={onOpenAdmin}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg bg-amber-500 hover:bg-amber-600 text-white shadow-xs transition cursor-pointer"
                title="Buka Panel Kelola Kamar & Data Penghuni"
              >
                <Settings className="w-4 h-4" />
                <span>Kelola Kos</span>
              </button>

              {/* High Visibility Logout Button */}
              <button
                type="button"
                onClick={onLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-300 border border-rose-200/80 dark:border-rose-800/80 transition cursor-pointer shadow-2xs"
                title="Keluar dari Akun Pemilik Kos (Logout)"
                aria-label="Logout Admin"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            /* Direct WhatsApp Contact button (Visible to tenants only) */
            <a
              href={OWNER_CONTACT.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm shadow-emerald-600/20 transition cursor-pointer"
              title="Chat WhatsApp Ibu Ros Langsung"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden lg:inline">WA Ibu Ros</span>
            </a>
          )}
        </div>
      </div>
    </header>
  );
};
