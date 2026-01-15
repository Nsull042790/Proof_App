import type { Metadata, Viewport } from 'next';
import './globals.css';
import { DataProvider } from '@/components/providers/DataProvider';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import FAB from '@/components/layout/FAB';

export const metadata: Metadata = {
  title: 'PROOF — The Golf Trip App',
  description: 'Every trip leaves a mark. Track scores, challenges, and memories with your crew.',
  manifest: '/Proof_App/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'PROOF',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0a0a0a',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/Proof_App/icons/icon-192.png" />
      </head>
      <body className="antialiased">
        <DataProvider>
          <Header />
          <main className="pt-14 pb-20 min-h-screen">
            {children}
          </main>
          <FAB />
          <BottomNav />
        </DataProvider>
      </body>
    </html>
  );
}
