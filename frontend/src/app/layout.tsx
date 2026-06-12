import type { Metadata } from 'next';
import { Outfit, Space_Grotesk, Montserrat } from 'next/font/google';
import './globals.css';
import { ClientLayout } from '@/components/ClientLayout';

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });
const space = Space_Grotesk({ subsets: ['latin'], variable: '--font-space' });
const montserrat = Montserrat({ subsets: ['latin'], weight: ['200', '300', '400', '700'] });

export const metadata: Metadata = {
  title: 'MANITOR AI | Personal Life OS',
  description: 'AI-powered Personal Life Operating System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${outfit.variable} ${space.variable} ${montserrat.className} font-sans antialiased flex`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
