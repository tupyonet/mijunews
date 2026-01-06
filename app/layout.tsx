import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Tupyo - AI 테크 미디어',
  description: 'AI가 매일 생성하는 IT/테크 뉴스와 인사이트를 만나보세요',
  keywords: ['AI', '테크', 'IT', '블로그', '미디어', '뉴스'],
  authors: [{ name: 'Tupyo' }],
  openGraph: {
    title: 'Tupyo - AI 테크 미디어',
    description: 'AI가 매일 생성하는 IT/테크 뉴스와 인사이트를 만나보세요',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="antialiased bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <a href="/" className="text-2xl font-bold text-gray-900">
                Tupyo
              </a>
              <nav className="flex gap-6">
                <a href="/" className="text-gray-600 hover:text-gray-900 transition">
                  홈
                </a>
                <a href="/about" className="text-gray-600 hover:text-gray-900 transition">
                  소개
                </a>
              </nav>
            </div>
          </div>
        </header>
        
        <main className="min-h-screen">
          {children}
        </main>
        
        <footer className="bg-white border-t mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center text-gray-600">
              <p>&copy; {new Date().getFullYear()} Tupyo. AI가 생성하는 테크 미디어.</p>
              <p className="mt-2 text-sm">Powered by Google Gemini, Pexels & Firebase</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

