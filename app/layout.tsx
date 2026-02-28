import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'WSUA Legal Intelligence Platform',
  description: 'Federated Legal Intelligence Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="app-shell">{children}</body>
    </html>
  );
}
