import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

import Modal from '@/components/Modal';

import AuthProvider from '@/state/contexts/authProvider';
import StoreProvider from '@/state/atoms/storeProvider';
import SwrProvider from '@/state/contexts/swrProvider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata = {
  title: 'Chargeback AI',
  description: 'Smart subscription tracking',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <SwrProvider>
            <StoreProvider>
              {children}
              <Modal />
            </StoreProvider>
          </SwrProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
