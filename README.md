# Tupyo - 완전 자동화 AI 미디어 사이트

AI가 매일 자동으로 콘텐츠를 생성하는 테크 미디어 플랫폼입니다. Google Gemini API로 블로그 글을 생성하고, Unsplash에서 이미지를 검색하여 Firebase에 저장합니다.

## 🎯 주요 기능

- ✅ **완전 자동화**: GitHub Actions가 매일 자동으로 콘텐츠 생성
- ✅ **AI 콘텐츠 생성**: Google Gemini API를 활용한 고품질 기술 블로그
- ✅ **자동 이미지 수집**: Pexels API로 관련 이미지 검색 및 저장
- ✅ **SEO 최적화**: Next.js Metadata API로 검색 엔진 최적화
- ✅ **반응형 디자인**: Tailwind CSS로 구현한 모던한 UI

## 🛠️ 기술 스택

### Frontend
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**

### Backend & Database
- **Firebase Firestore** (데이터베이스)
- **Firebase Storage** (이미지 저장)
- **Firebase Hosting** (배포)

### AI & APIs
- **Google Gemini API** (텍스트 생성)
- **Pexels API** (이미지 검색)

### Automation
- **GitHub Actions** (자동화 스케줄러)

## 📦 설치 방법

### 1. 저장소 클론

\`\`\`bash
git clone https://github.com/yourusername/tupyo.git
cd tupyo
\`\`\`

### 2. 의존성 설치

\`\`\`bash
npm install
\`\`\`

### 3. 환경 변수 설정

\`.env.example\` 파일을 \`.env\`로 복사하고 필요한 값들을 입력합니다:

\`\`\`bash
cp .env.example .env
\`\`\`

#### 필요한 API 키 및 설정:

##### Firebase 설정
1. [Firebase Console](https://console.firebase.google.com/)에서 프로젝트 생성
2. 프로젝트 설정에서 웹 앱 추가 후 설정 값 복사
3. Firestore Database 생성 (테스트 모드로 시작)
4. Storage 활성화
5. 서비스 계정 키 생성:
   - 프로젝트 설정 > 서비스 계정 > 새 비공개 키 생성
   - 다운로드한 JSON 파일을 \`serviceAccountKey.json\`으로 저장

##### Google Gemini API
1. [Google AI Studio](https://makersuite.google.com/app/apikey)에서 API 키 발급
2. \`GEMINI_API_KEY\`에 입력

##### Pexels API
1. [Pexels API](https://www.pexels.com/api/)에서 무료 계정 생성
2. API Key를 \`PEXELS_API_KEY\`에 입력

### 4. 개발 서버 실행

\`\`\`bash
npm run dev
\`\`\`

브라우저에서 [http://localhost:3000](http://localhost:3000)을 엽니다.

## 🤖 자동화 설정

### 로컬에서 자동화 스크립트 테스트

\`\`\`bash
npm run automate
\`\`\`

### GitHub Actions 설정

1. GitHub 저장소의 Settings > Secrets and variables > Actions로 이동
2. 다음 시크릿들을 추가:
   - \`GEMINI_API_KEY\`
   - \`PEXELS_API_KEY\`
   - \`FIREBASE_STORAGE_BUCKET\`
   - \`FIREBASE_SERVICE_ACCOUNT_KEY\` (serviceAccountKey.json 파일의 전체 내용)

3. \`.github/workflows/main.yml\` 파일이 자동으로 매일 00:00 UTC (한국시간 09:00)에 실행됩니다.

### 수동 실행
GitHub Actions 탭에서 "Daily Content Automation" 워크플로우를 선택하고 "Run workflow" 버튼을 클릭하여 수동으로 실행할 수 있습니다.

## 📁 프로젝트 구조

\`\`\`
tupyo/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # 루트 레이아웃
│   ├── page.tsx             # 메인 페이지 (포스트 리스트)
│   ├── globals.css          # 글로벌 스타일
│   ├── post/
│   │   └── [id]/
│   │       └── page.tsx     # 포스트 상세 페이지
│   └── about/
│       └── page.tsx         # 소개 페이지
├── .github/
│   └── workflows/
│       └── main.yml         # GitHub Actions 워크플로우
├── firebase.js              # Firebase 클라이언트 설정
├── firebase-admin.js        # Firebase Admin SDK 설정
├── automation_script.js     # 콘텐츠 생성 자동화 스크립트
├── package.json
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── .env.example
\`\`\`

## 🚀 배포

### Vercel 배포 (추천)

\`\`\`bash
npm install -g vercel
vercel
\`\`\`

환경 변수를 Vercel 대시보드에서 설정해야 합니다.

### Firebase Hosting 배포

\`\`\`bash
npm run build
firebase init hosting
firebase deploy
\`\`\`

## 📝 사용 방법

### 콘텐츠 자동 생성 흐름

1. **GitHub Actions 실행**: 매일 정해진 시간에 자동 실행
2. **주제 선택**: 미리 정의된 IT/테크 주제 중 랜덤 선택
3. **AI 콘텐츠 생성**: Gemini API로 블로그 글 생성
4. **이미지 검색**: 키워드 기반으로 Pexels에서 이미지 검색
5. **이미지 업로드**: Firebase Storage에 이미지 저장
6. **데이터 저장**: Firestore에 제목, 본문, 이미지 URL 저장
7. **자동 표시**: Next.js 프론트엔드에 자동으로 표시

### Firestore 데이터 구조

\`\`\`javascript
{
  title: string,           // 블로그 제목
  content: string,         // 마크다운 형식의 본문
  keywords: string[],      // 키워드 배열
  imageUrl: string,        // Firebase Storage 이미지 URL
  imageCredit: {
    photographer: string,
    photographerUrl: string
  },
  topic: string,           // 원본 주제
  createdAt: string,       // ISO 날짜 문자열
  views: number            // 조회수
}
\`\`\`

## 🔧 커스터마이징

### 주제 변경
\`automation_script.js\`의 \`topics\` 배열을 수정하여 원하는 주제로 변경할 수 있습니다.

### 스케줄 변경
\`.github/workflows/main.yml\`의 cron 표현식을 수정하여 실행 시간을 변경할 수 있습니다.

\`\`\`yaml
schedule:
  - cron: '0 0 * * *'  # 매일 00:00 UTC
\`\`\`

### 디자인 커스터마이징
Tailwind CSS를 사용하므로 \`tailwind.config.js\`와 각 컴포넌트의 클래스를 수정하여 디자인을 변경할 수 있습니다.

## 🐛 문제 해결

### Firebase 연결 오류
- 환경 변수가 올바르게 설정되었는지 확인
- Firebase 프로젝트에서 Firestore와 Storage가 활성화되었는지 확인

### 자동화 스크립트 오류
- API 키가 유효한지 확인
- Firebase 서비스 계정 키가 올바른지 확인
- API 사용량 제한을 초과하지 않았는지 확인

### GitHub Actions 실패
- GitHub Secrets가 올바르게 설정되었는지 확인
- Actions 탭에서 로그를 확인하여 오류 원인 파악

## 📄 라이선스

MIT License

## 🤝 기여

이슈와 풀 리퀘스트를 환영합니다!

## 📧 문의

프로젝트에 대한 질문이나 제안사항이 있으시면 이슈를 등록해주세요.

---

**Made with ❤️ using Google Gemini, Pexels & Firebase**

