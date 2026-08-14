'use client';

import React, { useState } from 'react';
import { User, Copy, Check, FileText } from 'lucide-react';
import { Message } from '../types/chat';
import { EscalationCard } from './EscalationCard';
import { MarkdownRenderer } from './MarkdownRenderer';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const [copied, setCopied] = useState(false);
  const isBot = message.sender === 'bot';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`flex items-start gap-3 my-4 animate-in fade-in slide-in-from-bottom-1 duration-200 ${
        isBot ? 'justify-start' : 'justify-end'
      }`}
    >
      {/* Bot Avatar */}
      {isBot && (
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl overflow-hidden shadow-xs shrink-0 mt-0.5 border border-amber-200 dark:border-zinc-700 bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icon.png" alt="Rosy Avatar" className="w-full h-full object-cover" />
        </div>
      )}

      {/* Message Bubble Container */}
      <div
        className={`max-w-[88%] sm:max-w-[80%] flex flex-col ${
          isBot ? 'items-start' : 'items-end'
        }`}
      >
        {/* Sender Name & Timestamp */}
        <div className="flex items-center gap-2 mb-1 px-1 text-[11px] text-zinc-400">
          <span className="font-medium">
            {isBot ? 'Rosy (AI Assistant)' : 'Penyewa / Anda'}
          </span>
          <span>•</span>
          <span>{message.timestamp}</span>
        </div>

        {/* Bubble */}
        <div
          className={`p-3.5 sm:p-4 rounded-2xl shadow-xs ${
            isBot
              ? 'bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-tl-xs text-zinc-900 dark:text-zinc-100'
              : 'bg-zinc-900 dark:bg-amber-600 text-white rounded-tr-xs shadow-2xs'
          }`}
        >
          {/* Attached file preview if present */}
          {message.attachment && (
            <div className="mb-2.5 p-2 rounded-lg bg-black/10 dark:bg-white/10 flex items-center gap-2 border border-black/5 dark:border-white/10">
              {message.attachment.isImage && message.attachment.previewUrl ? (
                <div className="w-12 h-12 rounded overflow-hidden shrink-0 border border-white/20">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={message.attachment.previewUrl}
                    alt={message.attachment.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="p-2 rounded bg-black/20 text-white shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
              )}
              <div className="text-xs overflow-hidden">
                <p className="font-semibold truncate">{message.attachment.name}</p>
                <p className="opacity-80 text-[10px]">{message.attachment.size}</p>
              </div>
            </div>
          )}

          {/* Text Content */}
          <div className="space-y-1">
            {isBot ? (
              <MarkdownRenderer content={message.text} />
            ) : (
              <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                {message.text}
              </p>
            )}
          </div>

          {/* Escalation Card if required */}
          {isBot && message.escalation && message.escalation.required && (
            <EscalationCard escalation={message.escalation} />
          )}
        </div>

        {/* Message Actions */}
        {isBot && (
          <div className="mt-1 flex items-center gap-2 px-1">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition cursor-pointer"
              title="Salin Teks"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-500" />
                  <span className="text-emerald-500">Tersalin</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Salin</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* User Avatar */}
      {!isBot && (
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-zinc-800 dark:bg-zinc-700 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
          <User className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
      )}
    </div>
  );
};
