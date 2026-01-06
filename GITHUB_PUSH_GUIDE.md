# GitHub 푸시 가이드

## 1️⃣ Personal Access Token 생성

1. https://github.com/settings/tokens 접속
2. **"Generate new token"** → **"Generate new token (classic)"** 클릭
3. Note: `tupyo` 입력
4. Expiration: **No expiration** 선택
5. 권한 선택:
   - ✅ **repo** (전체 선택)
   - ✅ **workflow**
6. **"Generate token"** 클릭
7. 생성된 토큰을 복사 (한 번만 표시됨!)

## 2️⃣ 터미널에서 푸시

```bash
cd /Users/jayjung/Desktop/APPS/tupyo

# 원격 저장소 URL 변경 (토큰 사용)
git remote set-url origin https://YOUR_TOKEN@github.com/tupyonet/tupyo.git

# 푸시
git push -u origin main
```

`YOUR_TOKEN` 부분을 위에서 복사한 토큰으로 교체하세요.

## 또는: GitHub CLI 사용

```bash
# GitHub CLI 설치 (Homebrew)
brew install gh

# GitHub 로그인
gh auth login

# 푸시
cd /Users/jayjung/Desktop/APPS/tupyo
git push -u origin main
```

## 푸시 완료 후

https://github.com/tupyonet/tupyo 로 이동하여 코드가 업로드되었는지 확인하세요!

