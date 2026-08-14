'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';
import { OWNER_CONTACT } from '../data/kostData';

export const FloatingWhatsApp: React.FC = () => {
  return (
    <aside
      aria-label="Kontak Cepat WhatsApp Ibu Ros"
      className="hidden sm:flex fixed bottom-6 right-6 z-40 items-center group pointer-events-auto"
    >
      <a
        href={OWNER_CONTACT.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2.5 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg shadow-emerald-600/30 transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
        title="Chat WhatsApp Langsung dengan Ibu Ros"
        aria-label="Chat WhatsApp Langsung dengan Ibu Ros"
      >
        <MessageCircle className="w-5 h-5 fill-white" />
        <span className="text-xs sm:text-sm font-bold tracking-wide">
          WA Ibu Ros
        </span>
      </a>
    </aside>
  );
};
