'use client';

import React from 'react';
import { X, FileText, Image as ImageIcon } from 'lucide-react';
import { AttachmentData } from '../types/chat';

interface AttachmentPreviewProps {
  attachment: AttachmentData | null;
  onRemove: () => void;
}

export const AttachmentPreview: React.FC<AttachmentPreviewProps> = ({
  attachment,
  onRemove,
}) => {
  if (!attachment) return null;

  return (
    <div className="mb-2 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-2 duration-150">
      <div className="flex items-center gap-2.5 overflow-hidden">
        {attachment.isImage ? (
          <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-amber-300 dark:border-amber-700">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={attachment.previewUrl}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-lg bg-amber-200 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
        )}

        <div className="overflow-hidden">
          <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
            {attachment.name}
          </p>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
            {attachment.size} • {attachment.isImage ? 'Foto / Bukti' : 'Dokumen PDF'}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onRemove}
        className="p-1.5 text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-white dark:hover:bg-zinc-800 rounded-lg transition"
        title="Hapus Lampiran"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
