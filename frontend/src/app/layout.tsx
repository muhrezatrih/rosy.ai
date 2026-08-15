import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  interactiveWidget: 'resizes-content',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#faf8f5' },
    { media: '(prefers-color-scheme: dark)', color: '#121110' },
  ],
};

export const metadata: Metadata = {
  title: 'Rosy - AI Kost Concierge • Kost Ibu Ros (Tiban, Batam)',
  description:
    'Rosy adalah Smart AI Virtual Concierge dari Kost Ibu Ros di Tiban Indah, Sekupang, Batam. Menjawab FAQ Kamar Kecil (600rb), Kamar Besar (700rb), Paviliun (1.5jt), listrik & air gratis, dan jatuh tempo pembayaran.',
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
  keywords: [
    'Rosy AI',
    'Kost Ibu Ros',
    'Kost Tiban Indah Batam',
    'Kos Sekupang Batam',
    'Kos 600rb Batam',
    'Sewa Kost Batam',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${jakartaSans.variable} bg-[#faf8f5] dark:bg-[#121110]`}>
      <head>
        <link rel="icon" href="/icon.png" sizes="any" />
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#faf8f5" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#121110" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="font-sans antialiased bg-[#faf8f5] dark:bg-[#121110] text-zinc-900 dark:text-zinc-100 h-full overflow-hidden">
        {children}
      </body>
    </html>
  );
}
