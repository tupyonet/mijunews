# Tupyo SEO 최적화 가이드

## 적용된 SEO 최적화 요소

### 1. 메타데이터 최적화 (app/layout.tsx)
- ✅ 타이틀 템플릿 설정
- ✅ 설명(description) 최적화
- ✅ 키워드 설정
- ✅ 저자 정보
- ✅ Open Graph 태그
- ✅ Twitter Card
- ✅ Canonical URL
- ✅ robots.txt 지시문
- ✅ manifest.json 연결

### 2. 구조화된 데이터 (JSON-LD)
- ✅ 홈페이지: WebSite 스키마
- ✅ 포스트 상세: NewsArticle 스키마
- ✅ 상호작용 통계 (좋아요/나빠요)
- ✅ 게시자 정보
- ✅ 카테고리 및 키워드

### 3. robots.txt (public/robots.txt)
- ✅ 모든 크롤러 허용
- ✅ Sitemap 위치 명시
- ✅ Crawl-delay 설정

### 4. Sitemap (app/sitemap.ts)
- ✅ 정적 페이지 포함
- ✅ 우선순위 설정
- ✅ 변경 빈도 설정

### 5. PWA 지원 (public/manifest.json)
- ✅ 앱 이름 및 설명
- ✅ 아이콘 설정
- ✅ 테마 색상

### 6. 성능 최적화 (next.config.js)
- ✅ Gzip 압축
- ✅ ETag 생성
- ✅ X-Powered-By 헤더 제거

### 7. 이미지 최적화
- ✅ Next.js Image 컴포넌트 사용
- ✅ alt 태그 설정
- ✅ 원격 이미지 패턴 설정

### 8. 시맨틱 HTML
- ✅ article, header, footer 태그 사용
- ✅ time 태그로 날짜 표시
- ✅ 적절한 heading 계층 구조

## Google Search Console 설정

### 1. 사이트 등록
1. [Google Search Console](https://search.google.com/search-console) 접속
2. 속성 추가: `https://tupyo-net.web.app`
3. HTML 태그 방법으로 소유권 확인
4. `app/layout.tsx`의 `verification.google` 값 업데이트

### 2. Sitemap 제출
1. Search Console > Sitemap 메뉴
2. 새 sitemap 추가: `https://tupyo-net.web.app/sitemap.xml`

### 3. URL 검사
- 주요 페이지 색인 요청

## Naver 검색 등록

### 1. Naver Webmaster Tools
1. [Naver Webmaster](https://searchadvisor.naver.com/) 접속
2. 사이트 등록: `https://tupyo-net.web.app`
3. HTML 파일 업로드 또는 메타 태그로 인증

### 2. RSS 제출
- Naver에서 RSS 피드 등록 가능

## 추가 개선 사항

### 1. Open Graph 이미지 생성
```bash
# public/og-image.png 파일 생성 (1200x630px)
# 브랜드 로고 및 타이틀 포함
```

### 2. 파비콘 추가
```bash
# public/favicon.ico
# public/icon-192x192.png
# public/icon-512x512.png
```

### 3. 성능 점검
- [PageSpeed Insights](https://pagespeed.web.dev/) 테스트
- [GTmetrix](https://gtmetrix.com/) 분석

### 4. 모바일 친화성
- [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)

### 5. 구조화된 데이터 검증
- [Rich Results Test](https://search.google.com/test/rich-results)

## 모니터링

### 주요 지표
- 검색 노출수
- 클릭률 (CTR)
- 평균 게재 순위
- 색인 생성된 페이지 수

### 정기 점검 항목
- [ ] 주간: Search Console 성과 확인
- [ ] 월간: 키워드 순위 추적
- [ ] 월간: 페이지 속도 테스트
- [ ] 분기: SEO 감사 (Audit)

## 콘텐츠 SEO 팁

### 1. 제목 최적화
- 40-60자 이내
- 핵심 키워드 앞쪽 배치
- 숫자 포함 (예: "2025년 IT 트렌드 TOP 10")

### 2. 설명 최적화
- 150-160자 이내
- 핵심 키워드 포함
- 행동 유도 문구 (CTA)

### 3. 키워드 전략
- 장기 키워드 (Long-tail keywords) 타겟
- 검색 의도 파악
- 경쟁사 분석

### 4. 내부 링크
- 관련 포스트 연결
- 앵커 텍스트 최적화

### 5. 외부 링크
- 신뢰할 수 있는 출처 인용
- nofollow 속성 적절히 사용

## 기술 SEO 체크리스트

- [✅] HTTPS 사용
- [✅] 모바일 반응형
- [✅] 빠른 로딩 속도
- [✅] robots.txt
- [✅] sitemap.xml
- [✅] 구조화된 데이터
- [✅] 메타 태그
- [✅] Open Graph
- [✅] Canonical URL
- [✅] 404 페이지
- [✅] 시맨틱 HTML
- [⏳] 이미지 최적화 (진행 중)
- [⏳] 파비콘 (필요)

## 문의
SEO 관련 문의: [이메일 주소]

