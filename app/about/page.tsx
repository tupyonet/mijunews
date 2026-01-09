import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '소개 | 미주뉴스',
  description: '미주뉴스는 미국주식과 암호화폐(코인) 관련 최신 뉴스와 인사이트를 제공하는 미디어 플랫폼입니다. 나스닥, S&P500, 비트코인, 이더리움 등 주요 투자 정보를 제공합니다.',
  keywords: ['미주뉴스', '미국주식', '코인', '암호화폐', '투자정보', '금융뉴스', '주식뉴스'],
  openGraph: {
    title: '소개 | 미주뉴스',
    description: '미주뉴스는 미국주식과 암호화폐(코인) 관련 최신 뉴스와 인사이트를 제공하는 미디어 플랫폼입니다.',
    url: 'https://mijunews-ec404.web.app/about',
  },
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          미주뉴스 소개
        </h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-gray-700 mb-6">
            미주뉴스는 미국주식과 암호화폐(코인) 관련 최신 뉴스와 인사이트를 제공하는 미디어 플랫폼입니다.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
            📰 우리의 미션
          </h2>
          <p className="text-gray-700 mb-6">
            빠르게 변화하는 미국 증시와 암호화폐 시장의 트렌드와 인사이트를
            독자들에게 전달하여 현명한 투자 결정에 도움을 드립니다.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
            🛠️ 기술 스택
          </h2>
          <ul className="space-y-2 mb-6">
            <li><strong>프론트엔드:</strong> Next.js 14 (App Router), Tailwind CSS</li>
            <li><strong>백엔드:</strong> Firebase (Firestore, Storage, Hosting)</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
            ✨ 주요 특징
          </h2>
          <ul className="space-y-2 mb-6">
            <li>✅ 미국주식 시장 뉴스</li>
            <li>✅ 암호화폐/코인 시장 동향</li>
            <li>✅ 반응형 디자인 & 현대적인 UI/UX</li>
            <li>✅ SEO 최적화</li>
            <li>✅ 빠른 로딩 속도</li>
          </ul>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6 mt-8">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              🚀 미래 계획
            </h3>
            <p className="text-gray-700">
              향후 실시간 시세 정보, 포트폴리오 관리, 투자 커뮤니티 등
              더 많은 기능을 추가할 예정입니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

