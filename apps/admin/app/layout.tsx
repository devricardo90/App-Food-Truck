import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
  title: 'Foodtrucks Admin',
  description: 'Painel operacional para barracas e gestao central.',
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
