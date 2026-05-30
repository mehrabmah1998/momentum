import type {Metadata} from 'next';
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const sans = Plus_Jakarta_Sans({
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
    <html lang="en" className={`${sans.variable} ${mono.variable} scroll-smooth`}>
      <body className="antialiased bg-[#020617] text-slate-100 font-sans" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

