import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Navbar, I18nProvider } from '@/components';
import './globals.css';
import { QueryProvider } from './providers/QueryProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Morganna - Product Management',
  description: 'A modern product management system built with Next.js and NestJS',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>
        <QueryProvider>
          <I18nProvider>
            <Navbar />

            <main>{children}</main>
            

          </I18nProvider>
        </QueryProvider>
      </body>
    </html>
  );
}