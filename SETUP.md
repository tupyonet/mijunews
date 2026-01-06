# 빠른 설정 가이드

## ✅ 이미 완료된 것
- ✅ Gemini API Key 설정됨
- ✅ Pexels API Key 설정됨

## 🔧 Firebase 설정 (필수)

### 1. Firebase 프로젝트 생성
1. [Firebase Console](https://console.firebase.google.com/)에 접속
2. "프로젝트 추가" 클릭
3. 프로젝트 이름: `tupyo` 입력
4. Google Analytics는 선택 사항 (필요시 활성화)

### 2. Firestore Database 생성
1. 좌측 메뉴 > "Firestore Database" 선택
2. "데이터베이스 만들기" 클릭
3. **테스트 모드**로 시작 선택
4. 위치: `asia-northeast3 (Seoul)` 선택 권장
5. "사용 설정" 클릭

### 3. Storage 활성화
1. 좌측 메뉴 > "Storage" 선택
2. "시작하기" 클릭
3. **테스트 모드**로 시작 선택
4. 위치: Firestore와 동일하게 설정
5. "완료" 클릭

### 4. 웹 앱 추가 및 설정값 가져오기
1. 프로젝트 개요 페이지로 이동
2. "웹" 아이콘(`</>`) 클릭
3. 앱 닉네임: `tupyo-web` 입력
4. Firebase Hosting는 체크 해제 (나중에 설정 가능)
5. "앱 등록" 클릭
6. 표시되는 **Firebase 설정 객체**를 복사

예시:
```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "tupyo-xxx.firebaseapp.com",
  projectId: "tupyo-xxx",
  storageBucket: "tupyo-xxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

### 5. .env 파일에 Firebase 설정 입력
위에서 복사한 값을 `.env` 파일에 입력:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tupyo-xxx.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tupyo-xxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tupyo-xxx.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef

FIREBASE_STORAGE_BUCKET=tupyo-xxx.appspot.com
```

### 6. Firebase Admin SDK 서비스 계정 키 생성
1. Firebase Console > 프로젝트 설정 (톱니바퀴 아이콘)
2. "서비스 계정" 탭 클릭
3. "새 비공개 키 생성" 클릭
4. 다운로드된 JSON 파일을 프로젝트 루트에 `serviceAccountKey.json`으로 저장

⚠️ **중요**: `serviceAccountKey.json` 파일은 절대 Git에 커밋하지 마세요! (이미 `.gitignore`에 포함됨)

## 🚀 실행하기

### 1. 의존성 설치
```bash
npm install
```

### 2. 개발 서버 실행
```bash
npm run dev
```

브라우저에서 http://localhost:3000 열기

### 3. 자동화 스크립트 테스트 (Firebase 설정 완료 후)
```bash
npm run automate
```

첫 번째 AI 포스트가 생성되고 Firestore에 저장됩니다!

## 🤖 GitHub Actions 설정 (선택)

나중에 자동화를 위해 GitHub에 코드를 푸시할 때:

1. GitHub 저장소 생성
2. Settings > Secrets and variables > Actions
3. 다음 시크릿 추가:
   - `GEMINI_API_KEY`: AIzaSyDxSGsYRbFFiUJgCt2GLMAXfUxScXGSg78
   - `PEXELS_API_KEY`: sAXJyOBLJG2kCqkCqtuJHb5HwK8TP7efQSL5UIzPkHBR6JvxjBiPSjl2
   - `FIREBASE_STORAGE_BUCKET`: (Firebase 설정에서 가져온 값)
   - `FIREBASE_SERVICE_ACCOUNT_KEY`: (serviceAccountKey.json 파일 내용 전체를 복사)

## 📝 다음 단계

1. Firebase 설정 완료
2. `npm run automate`로 첫 포스트 생성
3. `npm run dev`로 프론트엔드 확인
4. GitHub에 푸시하고 Actions 설정
5. 매일 자동으로 새 포스트 생성됨!

## ❓ 문제 해결

### "serviceAccountKey.json을 찾을 수 없습니다" 오류
- Firebase Admin SDK 키를 프로젝트 루트에 `serviceAccountKey.json`으로 저장했는지 확인

### Firestore 권한 오류
- Firestore를 **테스트 모드**로 시작했는지 확인
- 테스트 모드는 30일 후 만료되므로, 프로덕션에서는 보안 규칙을 설정해야 함

### API 호출 오류
- `.env` 파일의 API 키가 올바른지 확인
- Gemini API와 Pexels API 할당량을 확인

## 🎉 완료!

모든 설정이 완료되면 자동으로 AI가 생성하는 테크 미디어 사이트가 작동합니다!

