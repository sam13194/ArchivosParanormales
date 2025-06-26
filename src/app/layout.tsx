import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { cn } from '@/lib/utils';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { PlayerProvider } from '@/context/player-context';
import { PlayerWrapper } from '@/components/player-wrapper';

export const metadata: Metadata = {
  title: 'Echoes of the Unseen - Archivos Paranormales',
  description: 'The Netflix of Terror for real paranormal testimonials.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn("font-body antialiased")}>
        <PlayerProvider>
          <PlayerWrapper>
            <SiteHeader />
            <main className="flex-grow">{children}</main>
            <SiteFooter />
          </PlayerWrapper>
          <Toaster />
        </PlayerProvider>
      </body>
    </html>
  );
}
