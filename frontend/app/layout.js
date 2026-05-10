import { Manrope } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';

const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' });

export const metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: {
    default: 'Traveloop',
    template: '%s | Traveloop'
  },
  description: 'AI-ready travel planning for personalized multi-city trips, budgets, checklists, and sharing.',
  openGraph: {
    title: 'Traveloop',
    description: 'Plan smarter multi-city trips with modern tools.',
    type: 'website'
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${manrope.variable} font-sans`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}