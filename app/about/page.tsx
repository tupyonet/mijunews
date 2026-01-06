import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '소개 | Tupyo',
  description: 'Tupyo는 AI가 자동으로 생성하는 테크 미디어 플랫폼입니다.',
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
            Tupyo는 AI가 매일 자동으로 콘텐츠를 생성하는 혁신적인 테크 미디어 플랫폼입니다.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
            🤖 어떻게 작동하나요?
          </h2>
          <ol className="list-decimal list-inside space-y-3 mb-6">
            <li>매일 정해진 시간에 GitHub Actions가 자동으로 실행됩니다</li>
            <li>Google Gemini AI가 IT/테크 주제로 블로그 글을 생성합니다</li>
            <li>Pexels API를 통해 관련 이미지를 검색합니다</li>
            <li>이미지를 Firebase Storage에 업로드하고 URL을 획득합니다</li>
            <li>제목, 본문, 이미지가 Firestore에 자동으로 저장됩니다</li>
            <li>Next.js 프론트엔드에서 최신 콘텐츠를 보여줍니다</li>
          </ol>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
            🛠️ 기술 스택
          </h2>
          <ul className="space-y-2 mb-6">
            <li><strong>프론트엔드:</strong> Next.js 14 (App Router), Tailwind CSS</li>
            <li><strong>백엔드:</strong> Firebase (Firestore, Storage, Hosting)</li>
            <li><strong>AI:</strong> Google Gemini API</li>
            <li><strong>이미지:</strong> Pexels API</li>
            <li><strong>자동화:</strong> GitHub Actions</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
            ✨ 주요 기능
          </h2>
          <ul className="space-y-2 mb-6">
            <li>✅ 완전 자동화된 콘텐츠 생성 파이프라인</li>
            <li>✅ AI 기반 고품질 기술 콘텐츠</li>
            <li>✅ 반응형 디자인 & 현대적인 UI/UX</li>
            <li>✅ SEO 최적화</li>
            <li>✅ 실시간 조회수 추적</li>
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

