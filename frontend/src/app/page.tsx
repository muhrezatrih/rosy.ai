'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Paperclip,
  Building,
  Lock,
  ShieldCheck,
  LogOut,
  AlertTriangle,
} from 'lucide-react';
import { Message, AttachmentData, EscalationInfo } from '../types/chat';
import { OWNER_CONTACT } from '../data/kostData';
import { Header } from '../components/Header';
import { ChatMessage } from '../components/ChatMessage';
import { QuickPrompts } from '../components/QuickPrompts';
import { AttachmentPreview } from '../components/AttachmentPreview';
import { RoomCatalogModal } from '../components/RoomCatalogModal';
import { HouseRulesModal } from '../components/HouseRulesModal';
import { AdminDashboardModal } from '../components/AdminDashboardModal';
import { AdminLoginModal } from '../components/AdminLoginModal';
import { FloatingWhatsApp } from '../components/FloatingWhatsApp';

const STORAGE_KEY_MESSAGES = 'kost_rosy_chat_history_v1';
const STORAGE_KEY_ADMIN_AUTH = 'kost_rosy_admin_auth_v1';

const INITIAL_MESSAGE: Message = {
  id: 'welcome-1',
  sender: 'bot',
  text: `Halo Kak! Selamat datang di **Kost Ibu Ros** (Tiban Indah, Batam) 🏡✨

Saya **Rosy**, AI Virtual Assistant yang siap membantu memberikan informasi seputar:
* 🛏️ **Kondisi Kamar: Kosongan (Unfurnished)** — Bebas bawa & tata perabot sendiri:
  - **Kamar Kecil**: Rp 600.000 / bulan (5 unit • Ukuran standar & kompak)
  - **Kamar Besar**: Rp 700.000 / bulan (6 unit • Ukuran lebih luas & ekstra lega)
  - **Paviliun Mandiri**: Rp 1.500.000 / bulan (1 unit eksklusif • KM dalam & teras privat)
* 💡 **Listrik & Air**: **Sudah Termasuk** (Bebas biaya tambahan!)
* 🍳 **Fasilitas Bersama**: Dapur bersama, kamar mandi bersama, parkiran motor, & CCTV 24 Jam
* 📅 **Jatuh Tempo**: Sesuai tanggal awal masuk (misal masuk 14 Agustus, jatuh tempo berikutnya 14 September)
* 📶 **Koneksi Internet**: Tidak tersedia Wi-Fi bersama (penyewa gunakan kuota/modem pribadi)

Silakan tanyakan apa saja seputar kos kita, atau pilih pertanyaan cepat di bawah ini ya!`,
  timestamp: 'Baru saja',
};

export default function KostApp() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [isHistoryLoaded, setIsHistoryLoaded] = useState<boolean>(false);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [attachment, setAttachment] = useState<AttachmentData | null>(null);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(true);
  const [isRoomModalOpen, setIsRoomModalOpen] = useState<boolean>(false);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState<boolean>(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load chat history and admin auth on initial client mount
  useEffect(() => {
    try {
      const savedMessages = localStorage.getItem(STORAGE_KEY_MESSAGES);
      if (savedMessages) {
        const parsed = JSON.parse(savedMessages);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      }

      const savedAuth = localStorage.getItem(STORAGE_KEY_ADMIN_AUTH);
      if (savedAuth === 'true') {
        setIsAdminAuthenticated(true);
      }
    } catch {
      // Ignore parse errors and keep defaults
    } finally {
      setIsHistoryLoaded(true);
    }
  }, []);

  // Persist messages whenever they update after initial load
  useEffect(() => {
    if (!isHistoryLoaded) return;
    try {
      // Sanitize messages before saving: avoid storing temporary blob urls
      const sanitized = messages.map((m) => {
        if (m.attachment?.previewUrl?.startsWith('blob:')) {
          return {
            ...m,
            attachment: { ...m.attachment, previewUrl: '' },
          };
        }
        return m;
      });
      localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(sanitized));
    } catch {
      // LocalStorage error fallback
    }
  }, [messages, isHistoryLoaded]);

  // Scroll to bottom whenever messages update
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Check backend health
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await fetch('/api/health');
        if (res.ok) {
          setIsBackendConnected(true);
        } else {
          // fallback direct port 5001
          const directRes = await fetch('http://localhost:5001/health').catch(() => null);
          setIsBackendConnected(directRes ? directRes.ok : false);
        }
      } catch {
        setIsBackendConnected(false);
      }
    };
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size max 10MB
    if (file.size > 10 * 1024 * 1024) {
      alert('Ukuran berkas maksimal adalah 10 MB.');
      return;
    }

    const isImage = file.type.startsWith('image/');
    const previewUrl = isImage ? URL.createObjectURL(file) : '';
    const formattedSize =
      file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`;

    setAttachment({
      file,
      previewUrl,
      name: file.name,
      size: formattedSize,
      type: file.type,
      isImage,
    });

    // Reset native input value
    e.target.value = '';
  };

  const handleRemoveAttachment = () => {
    if (attachment?.previewUrl) {
      URL.revokeObjectURL(attachment.previewUrl);
    }
    setAttachment(null);
  };

  // Submit chat message
  const handleSendMessage = async (textOverride?: string) => {
    const textToSend = textOverride !== undefined ? textOverride : input;
    if ((!textToSend || !textToSend.trim()) && !attachment) return;

    const userMessageId = `user-${Date.now()}`;
    const userMsg: Message = {
      id: userMessageId,
      sender: 'user',
      text: textToSend.trim() || (attachment ? `Mengirim ${attachment.name}` : ''),
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      attachment: attachment
        ? {
            name: attachment.name,
            size: attachment.size,
            type: attachment.type,
            previewUrl: attachment.previewUrl,
            isImage: attachment.isImage,
          }
        : undefined,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    const currentAttachment = attachment;
    setAttachment(null);
    setIsLoading(true);

    try {
      let response;
      const apiBase = isBackendConnected ? '' : 'http://localhost:5001';

      if (currentAttachment) {
        const formData = new FormData();
        formData.append('prompt', textToSend.trim());

        if (currentAttachment.isImage) {
          formData.append('image', currentAttachment.file);
          response = await fetch(`${apiBase}/api/generate-from-image`, {
            method: 'POST',
            body: formData,
          }).catch(async () => {
            return await fetch('http://localhost:5001/generate-from-image', {
              method: 'POST',
              body: formData,
            });
          });
        } else {
          formData.append('document', currentAttachment.file);
          response = await fetch(`${apiBase}/api/generate-from-document`, {
            method: 'POST',
            body: formData,
          }).catch(async () => {
            return await fetch('http://localhost:5001/generate-from-document', {
              method: 'POST',
              body: formData,
            });
          });
        }
      } else {
        response = await fetch(`${apiBase}/api/generate-text`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: textToSend.trim() }),
        }).catch(async () => {
          return await fetch('http://localhost:5001/generate-text', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: textToSend.trim() }),
          });
        });
      }

      if (!response || !response.ok) {
        const errorData = await response?.json().catch(() => ({}));
        throw new Error(errorData?.error?.message || errorData?.message || 'Gagal menghubungi server Rosy.');
      }

      const data = await response.json();
      const botReplyText = data.result || 'Maaf ya Kak, Rosy sedang tidak dapat memproses jawaban saat ini.';
      const escalation: EscalationInfo | undefined = data.escalation;

      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: botReplyText,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        escalation,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Terjadi kendala jaringan.';
      const errorMsg: Message = {
        id: `bot-err-${Date.now()}`,
        sender: 'bot',
        text: `⚠️ Maaf ya Kak, terjadi kendala koneksi: **${errorMessage}**\n\nJika ada kebutuhan mendesak, silakan hubungi langsung Ibu Ros melalui WhatsApp: [Chat WhatsApp Ibu Ros (${OWNER_CONTACT.phone})](${OWNER_CONTACT.whatsappUrl}).`,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        isError: true,
        escalation: {
          required: true,
          ownerNumber: OWNER_CONTACT.phone,
          whatsappUrl: OWNER_CONTACT.whatsappUrl,
          actionLabel: 'Chat WhatsApp Ibu Ros',
        },
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  };

  const handleClearChat = () => {
    setMessages([INITIAL_MESSAGE]);
    try {
      localStorage.removeItem(STORAGE_KEY_MESSAGES);
    } catch {
      // ignore
    }
  };

  const handleSelectPrompt = (prompt: string) => {
    handleSendMessage(prompt);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleLoginSuccess = () => {
    setIsAdminAuthenticated(true);
    try {
      localStorage.setItem(STORAGE_KEY_ADMIN_AUTH, 'true');
    } catch {
      // ignore
    }
    setIsAdminModalOpen(true);
  };

  const handleExecuteLogout = () => {
    setIsAdminAuthenticated(false);
    setIsLogoutModalOpen(false);
    try {
      localStorage.removeItem(STORAGE_KEY_ADMIN_AUTH);
    } catch {
      // ignore
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#faf8f5] dark:bg-[#121110]">
      {/* Header with Role-Based Controls */}
      <Header
        onOpenRooms={() => setIsRoomModalOpen(true)}
        onOpenRules={() => setIsRulesModalOpen(true)}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onClearChat={handleClearChat}
        isAdminAuthenticated={isAdminAuthenticated}
        onLogout={() => setIsLogoutModalOpen(true)}
        isBackendConnected={isBackendConnected}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-4 sm:py-6 flex flex-col justify-between">
        {/* Chat Feed */}
        <div className="flex-1 space-y-4">
          {/* Top Info Banner - Clean Modern Card */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 border border-zinc-200/60 dark:border-zinc-700/60 flex items-center justify-center shrink-0">
                <Building className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="text-xs sm:text-sm">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="font-bold text-zinc-900 dark:text-zinc-100">
                    Kost Ibu Ros
                  </span>
                  <span className="text-zinc-400 dark:text-zinc-600 hidden sm:inline">•</span>
                  <span className="text-zinc-500 dark:text-zinc-400 text-xs hidden sm:inline">
                    Tiban Indah, Sekupang
                  </span>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border border-zinc-200/80 dark:border-zinc-700/80">
                    Kamar Kosongan
                  </span>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40">
                    Free Listrik & Air
                  </span>
                </div>
                <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-0.5">
                  11 Kamar Kosongan + Paviliun • Dapur Bersama, Parkir Motor, & CCTV 24 Jam
                </p>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsRoomModalOpen(true)}
                className="text-xs font-medium px-3.5 py-1.5 rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition cursor-pointer shadow-2xs"
              >
                Katalog Kamar
              </button>
            </div>
          </div>

          {/* Quick FAQ Starters */}
          <QuickPrompts onSelectPrompt={handleSelectPrompt} />

          {/* Message List */}
          <div className="space-y-4 pt-2">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <div className="flex items-start gap-3 my-4 animate-in fade-in">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl overflow-hidden shadow-xs shrink-0 mt-0.5 border border-zinc-200 dark:border-zinc-700 bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/icon.png" alt="Rosy Avatar" className="w-full h-full object-cover" />
                </div>
                <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-tl-xs shadow-xs">
                  <div className="flex items-center gap-1.5 py-1 px-1">
                    <span className="w-2 h-2 rounded-full bg-amber-600 typing-dot-1" />
                    <span className="w-2 h-2 rounded-full bg-amber-600 typing-dot-2" />
                    <span className="w-2 h-2 rounded-full bg-amber-600 typing-dot-3" />
                    <span className="text-xs text-zinc-500 dark:text-zinc-400 ml-2 font-medium">
                      Rosy sedang mengetik jawaban...
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Bar Section */}
        <div className="sticky bottom-0 z-20 pt-4 pb-2 bg-gradient-to-t from-[#faf8f5] via-[#faf8f5]/95 dark:from-[#121110] dark:via-[#121110]/95">
          {/* Attachment Preview if any */}
          <AttachmentPreview
            attachment={attachment}
            onRemove={handleRemoveAttachment}
          />

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-2 sm:p-2.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-end gap-2"
          >
            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/png,image/jpeg,image/webp,image/gif,application/pdf,text/plain"
            />

            {/* Attachment Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2.5 rounded-xl text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
              title="Unggah Foto (KTP / Bukti Transfer / Kerusakan) atau Dokumen"
              aria-label="Unggah Lampiran"
            >
              <Paperclip className="w-5 h-5" />
            </button>

            {/* Textarea */}
            <div className="flex-1">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                placeholder="Tanya seputar kos"
                className="w-full max-h-32 py-2 px-1 text-xs sm:text-sm bg-transparent border-0 focus:ring-0 focus:outline-hidden resize-none text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500"
              />
            </div>

            {/* Send Button */}
            <button
              type="submit"
              disabled={isLoading || ((!input || !input.trim()) && !attachment)}
              className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-amber-600 dark:hover:bg-amber-700 disabled:opacity-40 disabled:cursor-not-allowed text-white shadow-2xs transition cursor-pointer flex items-center justify-center"
              aria-label="Kirim Pesan"
            >
              <Send className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </form>

          {/* Footer Disclaimer & Discreet Admin Trigger */}
          <div className="mt-2 flex flex-col sm:flex-row items-center justify-between gap-1 text-[11px] text-zinc-400 px-1">
            <span>
              💡 <strong>Rosy</strong> by Kost Ibu Ros • Kamar Kosongan (Bebas Tata Sendiri) • WhatsApp: {OWNER_CONTACT.phone}
            </span>

            {isAdminAuthenticated ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAdminModalOpen(true)}
                  className="inline-flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Panel Pemilik Aktif</span>
                </button>
                <span className="text-zinc-300 dark:text-zinc-700">•</span>
                <button
                  type="button"
                  onClick={() => setIsLogoutModalOpen(true)}
                  className="inline-flex items-center gap-1 text-rose-500 hover:text-rose-700 hover:underline cursor-pointer"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsLoginModalOpen(true)}
                className="inline-flex items-center gap-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:underline cursor-pointer"
              >
                <Lock className="w-3 h-3" />
                <span>Login Pemilik Kos</span>
              </button>
            )}
          </div>
        </div>
      </main>

      {/* Floating WhatsApp Quick Dial (Tenants only) */}
      {!isAdminAuthenticated && <FloatingWhatsApp />}

      {/* Room Catalog Modal (Consumes Live Data) */}
      <RoomCatalogModal
        isOpen={isRoomModalOpen}
        onClose={() => setIsRoomModalOpen(false)}
        onSelectPrompt={handleSelectPrompt}
      />

      {/* House Rules Modal */}
      <HouseRulesModal
        isOpen={isRulesModalOpen}
        onClose={() => setIsRulesModalOpen(false)}
      />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Admin Dashboard Management Modal */}
      {isAdminAuthenticated && (
        <AdminDashboardModal
          isOpen={isAdminModalOpen}
          onClose={() => setIsAdminModalOpen(false)}
        />
      )}

      {/* Custom In-App Logout Confirmation Dialog (Matching Checkout Dialog UX) */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-zinc-200 dark:border-zinc-800 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  Konfirmasi Logout
                </h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Keluar dari Sesi Pemilik Kos
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/70 dark:border-zinc-700/60 text-xs text-zinc-700 dark:text-zinc-300 space-y-1">
              <p>
                Apakah Anda yakin ingin keluar dari akun <strong>Pemilik Kos (Ibu Ros)</strong>?
              </p>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">
                Tampilan antarmuka akan kembali ke mode publik penyewa.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsLogoutModalOpen(false)}
                className="px-3.5 py-2 text-xs font-medium rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleExecuteLogout}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition cursor-pointer flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Ya, Logout Sekarang</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
