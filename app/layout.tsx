import type { Metadata } from 'next';
import './globals.css';
import AdSenseScript from './components/AdSenseScript';
import GoogleAnalytics from './components/GoogleAnalytics';
import TradingViewTicker from './components/TradingViewTicker';
import Image from 'next/image';

export const metadata: Metadata = {
  metadataBase: new URL('https://mijunews-ec404.web.app'),
  title: {
    default: '미주뉴스 - 미국주식과 코인 뉴스 | 실시간 시세 및 투자 정보',
    template: '%s | 미주뉴스',
  },
  description: '미국주식, 암호화폐, 코인 관련 최신 뉴스와 실시간 시세 정보를 제공합니다. 나스닥, S&P500, 다우존스, 비트코인, 이더리움 등 주요 지수와 암호화폐 시세를 확인하세요.',
  keywords: [
    '미국주식', '미국증시', '나스닥', 'S&P500', '다우존스', 'QQQ', 'SPY',
    '코인', '암호화폐', '비트코인', 'BTC', '이더리움', 'ETH', '솔라나', 'SOL',
    '주식투자', '가상화폐', '블록체인', '디지털자산', '투자정보', '금융뉴스',
    '실시간시세', '주식시세', '코인시세', '암호화폐뉴스', '미국주식뉴스'
  ],
  authors: [{ name: '미주뉴스', url: 'https://mijunews-ec404.web.app' }],
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
    url: 'https://mijunews-ec404.web.app',
    siteName: '미주뉴스',
    title: '미주뉴스 - 미국주식과 코인 뉴스 | 실시간 시세 및 투자 정보',
    description: '미국주식, 암호화폐, 코인 관련 최신 뉴스와 실시간 시세 정보를 제공합니다. 나스닥, S&P500, 다우존스, 비트코인, 이더리움 등 주요 지수와 암호화폐 시세를 확인하세요.',
    images: [
      {
        url: 'https://mijunews-ec404.web.app/logo.png',
        width: 1200,
        height: 630,
        alt: '미주뉴스 - 미국주식과 코인 뉴스',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '미주뉴스 - 미국주식과 코인 뉴스 | 실시간 시세 및 투자 정보',
    description: '미국주식, 암호화폐, 코인 관련 최신 뉴스와 실시간 시세 정보를 제공합니다.',
    images: ['https://mijunews-ec404.web.app/logo.png'],
    creator: '@mijunews',
  },
  verification: {
    google: 'gvt7PPYCSbSdW6Ma6VaNeCVsH7eaqv4qaaEq88J2R94',
  },
  alternates: {
    canonical: 'https://mijunews-ec404.web.app',
  },
  category: 'Finance',
  classification: 'News',
  manifest: '/manifest.json',
  other: {
    'naver-site-verification': 'fc3bdcc47ac6bfdd00e14524ecf39b588556a439',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        {/* 구조화된 데이터 - Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'NewsMediaOrganization',
              name: '미주뉴스',
              url: 'https://mijunews-ec404.web.app',
              logo: 'https://mijunews-ec404.web.app/logo.png',
              description: '미국주식, 암호화폐, 코인 관련 최신 뉴스와 실시간 시세 정보를 제공하는 뉴스 미디어',
              sameAs: [],
              contactPoint: {
                '@type': 'ContactPoint',
                email: 'trotradio@gmail.com',
                contactType: 'customer service',
              },
            }),
          }}
        />
        {/* 구조화된 데이터 - WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: '미주뉴스',
              url: 'https://mijunews-ec404.web.app',
              description: '미국주식, 암호화폐, 코인 관련 최신 뉴스와 실시간 시세 정보',
              publisher: {
                '@type': 'Organization',
                name: '미주뉴스',
                logo: {
                  '@type': 'ImageObject',
                  url: 'https://mijunews-ec404.web.app/logo.png',
                },
              },
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://mijunews-ec404.web.app/?search={search_term_string}',
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
      </head>
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
                <a href="https://jnp.monster/stock/" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition whitespace-nowrap">
                  시세
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
        
        {/* TradingView 티커 */}
        <TradingViewTicker />
        
        <main className="min-h-screen">
          {children}
        </main>
        
        <footer className="bg-white border-t mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center text-gray-600 space-y-4">
              {/* 링크 메뉴 */}
              <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
                <a href="/terms" className="hover:text-blue-600 transition">
                  이용약관
                </a>
                <span className="text-gray-300">|</span>
                <a href="/privacy" className="hover:text-blue-600 transition">
                  개인정보처리방침
                </a>
                <span className="text-gray-300">|</span>
                <a href="mailto:trotradio@gmail.com" className="hover:text-blue-600 transition">
                  Contact
                </a>
                <span className="text-gray-300">|</span>
                <span>trotradio@gmail.com</span>
              </div>
              
              {/* 저작권 */}
              <p className="text-xs text-gray-500">
                &copy; {new Date().getFullYear()} 미주뉴스. 미국주식과 코인 뉴스.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

