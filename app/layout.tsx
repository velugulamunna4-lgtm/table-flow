import type { Metadata } from 'next';
import { Baloo_2, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { restaurantConfig } from '@/config/restaurant.config';

const baloo = Baloo_2({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-baloo',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: `${restaurantConfig.name} - Modern Restaurant Digital Ordering`,
  description: 'Tap, order, and watch it cook with Table Flow digital QR dining experience.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${baloo.variable} ${jakarta.variable}`}>
      <body className="min-h-screen selection:bg-primary/20 selection:text-content-primary">
        {children}
      </body>
    </html>
  );
}
