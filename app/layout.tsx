import type { Metadata } from 'next';
import './globals.css';
import AdSenseScript from './components/AdSenseScript';
import GoogleAnalytics from './components/GoogleAnalytics';
import Image from 'next/image';

export const metadata: Metadata = {
  metadataBase: new URL('https://tupyo-net.web.app'),
  title: {
    default: '미주뉴스 - 미국주식과 코인 뉴스',
    template: '%s | 미주뉴스',
  },
  description: '미국주식, 암호화폐, 코인 관련 최신 뉴스와 정보를 확인하세요',
  keywords: ['미국주식', '미국증시', '뉴스', '코인', '암호화폐', '비트코인', '이더리움', '나스닥', 'S&P500', '다우존스', '주식투자', '가상화폐'],
  authors: [{ name: '미주뉴스', url: 'https://tupyo-net.web.app' }],
  creator: '미주뉴스',
  publisher: '미주뉴스',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://tupyo-net.web.app',
    siteName: '미주뉴스',
    title: '미주뉴스 - 미국주식과 코인 뉴스',
    description: '미국주식, 암호화폐, 코인 관련 최신 뉴스와 정보를 확인하세요',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: '미주뉴스 - 미국주식과 코인 뉴스',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '미주뉴스 - 미국주식과 코인 뉴스',
    description: '미국주식, 암호화폐, 코인 관련 최신 뉴스와 정보를 확인하세요',
    images: ['/og-image.png'],
    creator: '@mijunews',
  },
  verification: {
    google: 'gvt7PPYCSbSdW6Ma6VaNeCVsH7eaqv4qaaEq88J2R94',
  },
  alternates: {
    canonical: 'https://tupyo-net.web.app',
  },
  manifest: '/manifest.json',
  other: {
    'naver-site-verification': '3e4d9f5feb680d7e84ee0732d0bca8b07f97c364',
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
        <GoogleAnalytics />
        <AdSenseScript />
        <header className="bg-white border-b-2 border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* 헤더 - 로고 왼쪽, 네비게이션 오른쪽 */}
            <div className="py-1.5 flex items-center justify-between">
              {/* 로고 - 왼쪽 */}
              <a href="/" className="inline-block">
                <Image src="/logo.png" alt="미주뉴스" width={200} height={48} className="h-10 w-auto" priority />
              </a>
              
              {/* 카테고리 네비게이션 - 오른쪽 */}
              <nav className="flex items-center gap-6">
                <a href="/" className="text-sm font-bold text-gray-900 hover:text-blue-600 transition whitespace-nowrap">
                  홈
                </a>
                <a href="/?category=미국주식" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition whitespace-nowrap">
                  미국주식
                </a>
                <a href="/?category=코인" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition whitespace-nowrap">
                  코인
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
              <p>&copy; {new Date().getFullYear()} 미주뉴스. 미국주식과 코인 뉴스.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

