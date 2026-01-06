import type { Metadata } from 'next';
import './globals.css';
import AdSenseScript from './components/AdSenseScript';
import GoogleAnalytics from './components/GoogleAnalytics';
import Image from 'next/image';

export const metadata: Metadata = {
  metadataBase: new URL('https://tupyo-net.web.app'),
  title: {
    default: '투표넷 - 뉴스 너머, 사람들의 진짜 목소리',
    template: '%s | 투표넷',
  },
  description: '정치, 경제, 부동산, 증권, 코인, 연예, 스포츠, 과학, 건강, 세계, IT 등 모든 주제의 뉴스와 사람들의 의견을 확인하세요',
  keywords: ['뉴스', '정치', '경제', '부동산', '증권', '코인', '암호화폐', '비트코인', '연예', '스포츠', '과학', '건강', '세계', 'IT', '투표', '여론', '의견', '종합뉴스'],
  authors: [{ name: '투표넷', url: 'https://tupyo-net.web.app' }],
  creator: '투표넷',
  publisher: '투표넷',
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
    siteName: '투표넷',
    title: '투표넷 - 뉴스 너머, 사람들의 진짜 목소리',
    description: '정치, 경제, 부동산, 증권, 코인, 연예, 스포츠, 과학, 건강, 세계, IT 등 모든 주제의 뉴스와 사람들의 의견을 확인하세요',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: '투표넷 - 뉴스 너머, 사람들의 진짜 목소리',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '투표넷 - 뉴스 너머, 사람들의 진짜 목소리',
    description: '정치, 경제, 부동산, 증권, 코인, 연예, 스포츠, 과학, 건강, 세계, IT 등 모든 주제의 뉴스와 사람들의 의견을 확인하세요',
    images: ['/og-image.png'],
    creator: '@tupyonet',
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
            {/* 로고 - 가운데 정렬 */}
            <div className="py-3 flex justify-center">
              <a href="/" className="inline-block">
                <Image src="/logo.png" alt="투표넷" width={200} height={48} className="h-10 w-auto" priority />
              </a>
            </div>
            
            {/* 카테고리 네비게이션 - 가운데 정렬, 모바일 스크롤 가능 */}
            <nav className="pb-3 -mx-4 px-4 overflow-x-auto scrollbar-hide">
              <div className="flex items-center justify-center gap-3 min-w-max">
                  <a href="/" className="text-sm font-bold text-gray-900 hover:text-blue-600 transition whitespace-nowrap">
                    홈
                  </a>
                  <a href="/?category=정치" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition whitespace-nowrap">
                    정치
                  </a>
                  <a href="/?category=경제" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition whitespace-nowrap">
                    경제
                  </a>
                  <a href="/?category=부동산" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition whitespace-nowrap">
                    부동산
                  </a>
                  <a href="/?category=증권" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition whitespace-nowrap">
                    증권
                  </a>
                  <a href="/?category=코인" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition whitespace-nowrap">
                    코인
                  </a>
                  <a href="/?category=연예" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition whitespace-nowrap">
                    연예
                  </a>
                  <a href="/?category=스포츠" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition whitespace-nowrap">
                    스포츠
                  </a>
                  <a href="/?category=IT" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition whitespace-nowrap">
                    IT
                  </a>
                  <a href="/?category=과학" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition whitespace-nowrap">
                    과학
                  </a>
                  <a href="/?category=건강" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition whitespace-nowrap">
                    건강
                  </a>
                  <a href="/?category=세계" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition whitespace-nowrap">
                    세계
                  </a>
                </div>
              </nav>
          </div>
        </header>
        
        <main className="min-h-screen">
          {children}
        </main>
        
        <footer className="bg-white border-t mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center text-gray-600">
              <p>&copy; {new Date().getFullYear()} 투표넷. 뉴스 너머, 사람들의 진짜 목소리.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

