'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', icon: '🏠', label: 'Home' },
  { href: '/feed', icon: '📸', label: 'Feed' },
  { href: '/board', icon: '🏆', label: 'Board' },
  { href: '/chat', icon: '💬', label: 'Chat' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#1a1a1a] border-t border-[#2a2a2a] safe-bottom z-40">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== '/' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-16 h-14 rounded-lg transition-all ${
                isActive
                  ? 'text-[#FFD700]'
                  : 'text-[#888888] hover:text-white'
              }`}
            >
              <span className="text-xl mb-0.5">{item.icon}</span>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
