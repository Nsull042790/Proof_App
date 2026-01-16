'use client';

import Link from 'next/link';
import { useEffect } from 'react';

interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { href: '/schedule', icon: '📅', label: 'Schedule' },
  { href: '/challenges', icon: '🎯', label: 'Challenges' },
  { href: '/scores', icon: '📝', label: 'Enter Scores' },
  { href: '/bets', icon: '🎰', label: 'Side Bets' },
  { href: '/games', icon: '🌙', label: 'Night Games' },
  { href: '/predictions', icon: '🔮', label: 'Predictions' },
  { href: '/capsule', icon: '⏱️', label: 'Time Capsule' },
  { href: '/shame', icon: '😈', label: 'Shame Board' },
  { href: '/awards', icon: '🏅', label: 'Awards' },
  { href: '/info', icon: 'ℹ️', label: 'Trip Info' },
  { href: '/setup', icon: '⚙️', label: 'Player Setup' },
];

export default function Menu({ isOpen, onClose }: MenuProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-50 animate-fade-in"
        onClick={onClose}
      />

      {/* Menu Panel */}
      <div className="fixed top-0 right-0 bottom-0 w-72 bg-[#1a1a1a] z-50 animate-slide-up overflow-y-auto">
        <div className="p-4 border-b border-[#2a2a2a] flex items-center justify-between">
          <span className="text-lg font-semibold text-white">Menu</span>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[#2a2a2a] transition-colors"
            aria-label="Close menu"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="py-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="flex items-center gap-4 px-4 py-3 hover:bg-[#2a2a2a] transition-colors"
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-white font-medium">{item.label}</span>
            </Link>
          ))}
        </div>

        <div className="p-4 border-t border-[#2a2a2a] mt-4">
          <p className="text-[#666666] text-xs text-center">
            PROOF — Every trip leaves a mark
          </p>
        </div>
      </div>
    </>
  );
}
