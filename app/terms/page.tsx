import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '이용약관 | 미주뉴스',
  description: '미주뉴스 서비스 이용약관입니다. 서비스 이용과 관련된 권리, 의무 및 책임사항을 확인하세요.',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: '이용약관 | 미주뉴스',
    description: '미주뉴스 서비스 이용약관',
    url: 'https://mijunews-ec404.web.app/terms',
  },
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">이용약관</h1>
        
        <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">제1조 (목적)</h2>
            <p>
              본 약관은 미주뉴스(이하 &quot;회사&quot;)가 제공하는 온라인 서비스의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">제2조 (정의)</h2>
            <p>
              1. &quot;서비스&quot;란 회사가 제공하는 미국주식 및 코인 뉴스 서비스를 의미합니다.<br/>
              2. &quot;이용자&quot;란 본 약관에 따라 회사가 제공하는 서비스를 받는 회원 및 비회원을 말합니다.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">제3조 (약관의 게시와 개정)</h2>
            <p>
              회사는 본 약관의 내용을 이용자가 쉽게 알 수 있도록 서비스 초기 화면에 게시합니다. 회사는 필요한 경우 관련 법령을 위배하지 않는 범위에서 본 약관을 개정할 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">제4조 (서비스의 제공 및 변경)</h2>
            <p>
              회사는 다음과 같은 서비스를 제공합니다:<br/>
              1. 미국주식 뉴스 제공<br/>
              2. 암호화폐/코인 뉴스 제공<br/>
              3. 실시간 시세 정보 제공<br/>
              4. 기타 회사가 추가 개발하거나 제휴계약 등을 통해 제공하는 일체의 서비스
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">제5조 (서비스의 중단)</h2>
            <p>
              회사는 컴퓨터 등 정보통신설비의 보수점검, 교체 및 고장, 통신의 두절 등의 사유가 발생한 경우에는 서비스의 제공을 일시적으로 중단할 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">제6조 (면책조항)</h2>
            <p>
              회사는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다. 또한 회사는 이용자의 귀책사유로 인한 서비스 이용의 장애에 대하여는 책임을 지지 않습니다.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">제7조 (준거법 및 관할법원)</h2>
            <p>
              본 약관은 대한민국 법률에 따라 규율되고 해석되며, 회사와 이용자 간에 발생한 분쟁에 관한 소송은 민사소송법상의 관할법원에 제기합니다.
            </p>
          </section>

          <div className="mt-12 pt-8 border-t">
            <p className="text-sm text-gray-500">
              본 약관은 2026년 1월 7일부터 시행됩니다.
            </p>
          </div>
        </div>

        <div className="mt-8">
          <Link 
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition"
          >
            ← 홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}

