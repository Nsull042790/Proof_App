'use client';

import { useState } from 'react';
import Link from 'next/link';

const fabActions = [
  { href: '/feed?action=upload', icon: '📸', label: 'Quick Photo' },
  { href: '/challenges?action=claim', icon: '🎯', label: 'Log Challenge' },
  { href: '/scores', icon: '📝', label: 'Enter Score' },
  { href: '/chat?action=quote', icon: '💬', label: 'Add Quote' },
  { href: '/bets?action=create', icon: '🎰', label: 'Create Bet' },
];

export default function FAB() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 animate-fade-in"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Action Buttons */}
      <div className="fixed bottom-20 right-4 z-50 flex flex-col-reverse items-end gap-3">
        {isOpen &&
          fabActions.map((action, index) => (
            <Link
              key={action.href}
              href={action.href}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <span className="bg-[#2a2a2a] text-white text-sm font-medium px-3 py-2 rounded-lg shadow-lg">
                {action.label}
              </span>
              <span className="w-12 h-12 flex items-center justify-center bg-[#1a1a1a] rounded-full shadow-lg text-xl border border-[#2a2a2a]">
                {action.icon}
              </span>
            </Link>
          ))}

        {/* Main FAB Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 flex items-center justify-center rounded-full shadow-lg transition-all duration-300 ${
            isOpen
              ? 'bg-[#2a2a2a] rotate-45'
              : 'bg-[#FFD700]'
          }`}
          aria-label={isOpen ? 'Close actions' : 'Open actions'}
        >
          <svg
            className={`w-7 h-7 ${isOpen ? 'text-white' : 'text-black'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </div>
    </>
  );
}
