'use client';

import React, { useState } from 'react';
import { Sparkles, MessageSquare } from 'lucide-react';
import { QUICK_CATEGORIES } from '../data/kostData';

interface QuickPromptsProps {
  onSelectPrompt: (prompt: string) => void;
}

export const QuickPrompts: React.FC<QuickPromptsProps> = ({ onSelectPrompt }) => {
  const [activeTab, setActiveTab] = useState<number>(0);

  return (
    <div className="my-3 p-3.5 sm:p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs">
      <div className="flex items-center gap-2 mb-2.5">
        <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
        <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
          Pertanyaan Cepat
        </span>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
        {QUICK_CATEGORIES.map((cat, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setActiveTab(idx)}
            className={`whitespace-nowrap px-3 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              activeTab === idx
                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-2xs'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
            }`}
          >
            {cat.category}
          </button>
        ))}
      </div>

      {/* Prompts for Active Category */}
      <div className="mt-2.5 flex flex-wrap gap-1.5">
        {QUICK_CATEGORIES[activeTab].prompts.map((prompt, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectPrompt(prompt)}
            className="text-left px-3 py-1.5 text-xs rounded-lg bg-zinc-50 dark:bg-zinc-800/60 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200/70 dark:border-zinc-700/60 hover:border-zinc-300 dark:hover:border-zinc-600 transition cursor-pointer flex items-center gap-1.5"
          >
            <MessageSquare className="w-3 h-3 text-zinc-400 dark:text-zinc-500 shrink-0" />
            <span>{prompt}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
