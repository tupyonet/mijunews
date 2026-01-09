import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '개인정보처리방침 | 미주뉴스',
  description: '미주뉴스 개인정보처리방침',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">개인정보처리방침</h1>
        
        <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">제1조 (개인정보의 처리목적)</h2>
            <p>
              미주뉴스(이하 &quot;회사&quot;)는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 개인정보 보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>서비스 제공: 미국주식 및 코인 뉴스 제공</li>
              <li>서비스 개선: 이용자 통계 분석 및 서비스 품질 향상</li>
              <li>문의 응대: 이용자 문의사항 응대 및 처리</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">제2조 (개인정보의 처리 및 보유기간)</h2>
            <p>
              회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
            </p>
            <p className="mt-4">
              각각의 개인정보 처리 및 보유 기간은 다음과 같습니다:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>서비스 이용 기록: 서비스 종료 시까지</li>
              <li>문의사항: 문의 처리 완료 후 3년</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">제3조 (처리하는 개인정보의 항목)</h2>
            <p>
              회사는 다음의 개인정보 항목을 처리하고 있습니다:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>서비스 이용 과정에서 자동 수집: IP주소, 쿠키, 접속 로그, 기기정보</li>
              <li>문의사항 처리: 이메일 주소 (선택사항)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">제4조 (개인정보의 제3자 제공)</h2>
            <p>
              회사는 정보주체의 개인정보를 제1조(개인정보의 처리목적)에서 명시한 범위 내에서만 처리하며, 정보주체의 동의, 법률의 특별한 규정 등 개인정보 보호법 제17조 및 제18조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">제5조 (개인정보처리의 위탁)</h2>
            <p>
              회사는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Google Analytics: 서비스 이용 통계 분석</li>
              <li>Google AdSense: 광고 서비스 제공</li>
              <li>Firebase: 데이터 저장 및 관리</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">제6조 (정보주체의 권리·의무 및 행사방법)</h2>
            <p>
              정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>개인정보 처리정지 요구</li>
              <li>개인정보 열람 요구</li>
              <li>개인정보 정정·삭제 요구</li>
            </ul>
            <p className="mt-4">
              위 권리 행사는 회사에 대해 서면, 전자우편 등을 통하여 하실 수 있으며 회사는 이에 대해 지체 없이 조치하겠습니다.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">제7조 (개인정보의 파기)</h2>
            <p>
              회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체 없이 해당 개인정보를 파기합니다.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">제8조 (개인정보 보호책임자)</h2>
            <p>
              회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
            </p>
            <div className="mt-4 p-4 bg-gray-50 rounded">
              <p><strong>이메일:</strong> trotradio@gmail.com</p>
            </div>
          </section>

          <div className="mt-12 pt-8 border-t">
            <p className="text-sm text-gray-500">
              본 방침은 2026년 1월 7일부터 시행됩니다.
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

