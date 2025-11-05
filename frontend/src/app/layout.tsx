import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { Navbar, I18nProvider, AuthProvider, Footer } from '@/components';
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
            <AuthProvider>
              <Navbar />

              <main>{children}</main>

              <Footer />

              <Toaster
                position="bottom-right"
                toastOptions={{
                  duration: 3000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                  success: {
                    iconTheme: {
                      primary: '#10B981',
                      secondary: '#fff',
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: '#EF4444',
                      secondary: '#fff',
                    },
                  },
                }}
              />
            </AuthProvider>
          </I18nProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
