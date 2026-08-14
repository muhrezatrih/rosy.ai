'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { MessageCircle, ExternalLink } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  // Pre-process text to fix common unescaped phone numbers or broken markdown links
  const cleanedContent = content
    // Clean up any extra newline inside markdown links: [label](\n url) -> [label](url)
    .replace(/\[([^\]]+)\]\(\s*\n+\s*([^\)]+)\)/g, '[$1]($2)')
    // Clean up newline before URL queries: https://wa.me/...\n?text=... -> https://wa.me/...?text=...
    .replace(/(https:\/\/wa\.me\/[^\s\)]+)\s*\n+\s*(text=[^\s\)]+)/g, '$1?$2');

  return (
    <div className="prose-chat text-xs sm:text-sm leading-relaxed text-zinc-800 dark:text-zinc-200 space-y-1.5">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children }) => {
            const isWhatsApp = href?.includes('wa.me') || href?.includes('whatsapp.com');
            const isPhone = href?.startsWith('tel:');

            if (isWhatsApp) {
              return (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 my-1.5 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition duration-150 no-underline cursor-pointer border border-emerald-500/30"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-white" />
                  <span>{children}</span>
                  <ExternalLink className="w-3 h-3 opacity-80 ml-0.5" />
                </a>
              );
            }

            if (isPhone && href) {
              const cleanDigits = href.replace(/\D/g, '');
              const waTarget = cleanDigits.startsWith('0') ? `62${cleanDigits.slice(1)}` : cleanDigits;
              return (
                <a
                  href={`https://wa.me/${waTarget}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 my-1 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition no-underline cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-white" />
                  <span>Chat WhatsApp {children}</span>
                  <ExternalLink className="w-3 h-3 opacity-80" />
                </a>
              );
            }

            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-700 dark:text-amber-400 font-semibold underline decoration-amber-500/40 underline-offset-2 hover:text-amber-800 dark:hover:text-amber-300"
              >
                {children}
              </a>
            );
          },
          p: ({ children }) => (
            <p className="my-1 leading-relaxed text-zinc-800 dark:text-zinc-200">
              {children}
            </p>
          ),
          h1: ({ children }) => (
            <h3 className="text-base sm:text-lg font-bold text-zinc-950 dark:text-zinc-50 mt-3 mb-1.5">
              {children}
            </h3>
          ),
          h2: ({ children }) => (
            <h4 className="text-sm sm:text-base font-bold text-zinc-950 dark:text-zinc-100 mt-2.5 mb-1">
              {children}
            </h4>
          ),
          h3: ({ children }) => (
            <h5 className="text-xs sm:text-sm font-bold text-amber-950 dark:text-amber-200 mt-2 mb-1">
              {children}
            </h5>
          ),
          h4: ({ children }) => (
            <h6 className="text-xs font-bold text-amber-950 dark:text-amber-200 mt-1.5 mb-0.5">
              {children}
            </h6>
          ),
          ul: ({ children }) => (
            <ul className="my-1.5 space-y-1 pl-4 list-disc marker:text-amber-600 dark:marker:text-amber-400">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="my-1.5 space-y-1.5 pl-4 list-decimal marker:text-amber-600 dark:marker:text-amber-400 marker:font-bold">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="leading-relaxed text-zinc-800 dark:text-zinc-200">
              {children}
            </li>
          ),
          strong: ({ children }) => (
            <strong className="font-bold text-zinc-950 dark:text-zinc-100">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic text-zinc-700 dark:text-zinc-300">
              {children}
            </em>
          ),
          hr: () => (
            <hr className="my-3 border-t border-zinc-200 dark:border-zinc-800" />
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-3 border-amber-500 pl-3 my-2 italic text-zinc-600 dark:text-zinc-400 bg-amber-500/5 py-1 rounded-r-lg">
              {children}
            </blockquote>
          ),
          code: ({ children }) => (
            <code className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-amber-700 dark:text-amber-400 text-xs font-mono">
              {children}
            </code>
          ),
        }}
      >
        {cleanedContent}
      </ReactMarkdown>
    </div>
  );
};
