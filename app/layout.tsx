import type {Metadata} from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const sans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Momentum — Living Knowledge & Documentation Platform for Software Projects',
  description: 'Momentum maintains the structured knowledge and planning layer that makes every AI code builder smarter. Always current, structured, and queryable.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable} scroll-smooth`} suppressHydrationWarning>
      <body className="antialiased bg-[var(--bg)] text-[var(--text-primary)] font-sans" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

