import { Inter } from 'next/font/google';
import { LayoutContent } from './layout-content';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'WPM - Typing Speed Game',
  description: 'Improve your typing speed with daily challenges and lessons',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LayoutContent>{children}</LayoutContent>
      </body>
    </html>
  );
}
