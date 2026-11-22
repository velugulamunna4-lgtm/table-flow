import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { restaurantConfig } from '@/config/restaurant.config';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: `${restaurantConfig.name} - Modern Restaurant Digital Ordering`,
  description: 'Tap, order, and watch it cook with Table Flow digital QR dining experience.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#FAF7F2',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body className="min-h-screen selection:bg-primary/20 selection:text-content-primary antialiased bg-canvas text-content-primary">
        {children}
      </body>
    </html>
  );
}
