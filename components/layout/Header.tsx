'use client';

import { useState } from 'react';
import Link from 'next/link';
import Menu from './Menu';
import buildInfo from '@/lib/build-info.json';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-[#0a0a0a] border-b border-[#2a2a2a] safe-top z-40">
        <div className="flex items-center justify-between h-14 px-4 max-w-lg mx-auto">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-[#FFD700]">PROOF</span>
            <span className="text-[10px] text-[#666666]">v{buildInfo.version}</span>
          </Link>

          <button
            onClick={() => setMenuOpen(true)}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[#1a1a1a] transition-colors"
            aria-label="Open menu"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </header>

      <Menu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
