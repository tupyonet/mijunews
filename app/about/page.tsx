import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '소개 | Tupyo',
  description: 'Tupyo는 테크 미디어 플랫폼입니다.',
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Tupyo 소개
        </h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-gray-700 mb-6">
            Tupyo는 최신 IT/테크 뉴스와 인사이트를 제공하는 미디어 플랫폼입니다.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
            📰 우리의 미션
          </h2>
          <p className="text-gray-700 mb-6">
            빠르게 변화하는 기술 트렌드와 혁신적인 아이디어를 
            독자들에게 전달하여 기술 생태계의 발전에 기여합니다.
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
            <li>✅ 고품질 기술 콘텐츠</li>
            <li>✅ 반응형 디자인 & 현대적인 UI/UX</li>
            <li>✅ SEO 최적화</li>
            <li>✅ 빠른 로딩 속도</li>
            <li>✅ 키워드 기반 분류</li>
          </ul>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6 mt-8">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              🚀 미래 계획
            </h3>
            <p className="text-gray-700">
              향후 사용자 커스터마이징, 다국어 지원, 댓글 시스템, 
              추천 알고리즘 등 더 많은 기능을 추가할 예정입니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

