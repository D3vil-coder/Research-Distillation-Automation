import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Research Automation',
  description: 'AI-Powered Research Summarizer & Content Generator',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <div className="background-gradient">
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
          <div className="blob blob-3"></div>
        </div>
        <main style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          padding: '2rem',
          paddingTop: '4rem',
          zIndex: 10
        }}>
          <div style={{
            width: '100%',
            maxWidth: '80rem',
            minHeight: '80vh',
            padding: '2rem'
          }}>
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
