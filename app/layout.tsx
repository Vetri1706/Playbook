import type { Metadata } from 'next';
import './globals.css';
import { PlaybookProvider } from '@/context/PlaybookContext';
import MusicPlayer from '@/components/MusicPlayer';
import ParticleBackground from '@/components/ParticleBackground';

export const metadata: Metadata = {
  title: 'SNS Design Thinking Playbook',
  description: 'Interactive Design Thinking Playbook for Grade 1-5 Students',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800;900&family=Fredoka+One&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans overflow-x-hidden bg-gradient-to-br from-hero-frozen to-hero-peppa bg-fixed">
        <PlaybookProvider>
          <ParticleBackground />
          <MusicPlayer />
          {children}
        </PlaybookProvider>
      </body>
    </html>
  );
}
