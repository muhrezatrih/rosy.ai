'use client';

import React from 'react';
import { MessageCircle, ShieldAlert, ExternalLink } from 'lucide-react';
import { EscalationInfo } from '../types/chat';
import { OWNER_CONTACT } from '../data/kostData';

interface EscalationCardProps {
  escalation: EscalationInfo;
}

export const EscalationCard: React.FC<EscalationCardProps> = ({ escalation }) => {
  const waUrl = escalation.whatsappUrl || OWNER_CONTACT.whatsappUrl;
  const actionLabel = escalation.actionLabel || 'Chat WhatsApp Ibu Ros';

  return (
    <div className="mt-3 p-3.5 sm:p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/20 border border-amber-300 dark:border-amber-700/50 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-amber-500 text-white shrink-0 mt-0.5 shadow-sm">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              Perlu Persetujuan Langsung Ibu Ros (Pemilik Kos)
            </h4>
          </div>
          <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
            Sebagai asisten AI, saya tidak memiliki wewenang untuk menyetujui penundaan pembayaran sewa, negosiasi harga, atau izin khusus. Seluruh komunikasi dan konfirmasi <strong>wajib melalui chat WhatsApp</strong>:
          </p>

          <div className="mt-2.5 flex items-center">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/20 transition cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>{actionLabel} ({OWNER_CONTACT.phone})</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
