// 자동화 스크립트: AI 콘텐츠 생성 및 Firestore 저장
import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from 'pexels';
import fetch from 'node-fetch';
import { adminDb, adminStorage } from './firebase-admin.js';

// API 초기화
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const pexelsClient = createClient(process.env.PEXELS_API_KEY);

// 주제 목록 (랜덤하게 선택)
const topics = [
  'AI와 머신러닝의 최신 트렌드',
  '클라우드 컴퓨팅 기술의 발전',
  '사이버 보안과 데이터 프라이버시',
  '웹 개발 프레임워크 비교',
  '모바일 앱 개발의 미래',
  '블록체인과 암호화폐 기술',
  '빅데이터 분석과 활용',
  'IoT와 스마트 홈 기술',
  '5G 네트워크와 통신 혁신',
  '프로그래밍 언어 트렌드',
];

// 1. Gemini API로 블로그 글 생성
async function generateBlogPost(topic) {
  try {
    console.log(`📝 주제로 블로그 글 생성 중: ${topic}`);
    
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    
    const prompt = `당신은 IT/테크 전문 블로거입니다. 다음 주제에 대해 흥미롭고 전문적인 블로그 포스팅을 작성해주세요.

주제: ${topic}

요구사항:
1. 매력적인 제목을 만들어주세요 (한글, 30자 이내)
2. 본문은 마크다운 형식으로 작성해주세요
3. 본문 길이는 800-1200자 정도로 작성해주세요
4. 전문적이면서도 읽기 쉬운 톤을 유지해주세요
5. 실용적인 정보와 통찰을 포함해주세요

다음 JSON 형식으로 응답해주세요:
{
  "title": "블로그 제목",
  "content": "마크다운 형식의 본문",
  "keywords": ["키워드1", "키워드2", "키워드3"]
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // JSON 파싱 (코드 블록 제거)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('유효한 JSON 응답을 받지 못했습니다.');
    }
    
    const parsed = JSON.parse(jsonMatch[0]);
    console.log('✅ 블로그 글 생성 완료');
    return parsed;
  } catch (error) {
    console.error('❌ 블로그 글 생성 실패:', error);
    throw error;
  }
}

// 2. Pexels에서 이미지 검색
async function searchImage(keywords) {
  try {
    const searchQuery = keywords.join(' ');
    console.log(`🔍 이미지 검색 중: ${searchQuery}`);
    
    const result = await pexelsClient.photos.search({
      query: searchQuery,
      per_page: 1,
      orientation: 'landscape',
    });

    if (result && result.photos && result.photos.length > 0) {
      const photo = result.photos[0];
      console.log('✅ 이미지 검색 완료');
      return {
        url: photo.src.large,
        photographer: photo.photographer,
        photographerUrl: photo.photographer_url,
      };
    } else {
      // 기본 이미지 사용
      console.log('⚠️ 검색 결과 없음, 기본 이미지 사용');
      return {
        url: 'https://images.pexels.com/photos/270404/pexels-photo-270404.jpeg',
        photographer: 'Pexels',
        photographerUrl: 'https://www.pexels.com',
      };
    }
  } catch (error) {
    console.error('❌ 이미지 검색 실패:', error);
    // 기본 이미지 반환
    return {
      url: 'https://images.pexels.com/photos/270404/pexels-photo-270404.jpeg',
      photographer: 'Pexels',
      photographerUrl: 'https://www.pexels.com',
    };
  }
}

// 3. Pexels는 다운로드 트리거가 필요없음 (삭제된 함수)

// 4. 이미지를 Firebase Storage에 업로드
async function uploadImageToStorage(imageUrl, postId) {
  try {
    console.log('📤 Firebase Storage에 이미지 업로드 중...');
    
    // 이미지 다운로드
    const response = await fetch(imageUrl);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Storage에 업로드
    const bucket = adminStorage.bucket();
    const fileName = `posts/${postId}.jpg`;
    const file = bucket.file(fileName);
    
    await file.save(buffer, {
      metadata: {
        contentType: 'image/jpeg',
      },
      public: true,
    });
    
    // 공개 URL 생성
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
    console.log('✅ 이미지 업로드 완료');
    return publicUrl;
  } catch (error) {
    console.error('❌ 이미지 업로드 실패:', error);
    // 원본 URL 반환
    return imageUrl;
  }
}

// 5. Firestore에 포스트 저장
async function savePostToFirestore(postData) {
  try {
    console.log('💾 Firestore에 포스트 저장 중...');
    
    const docRef = await adminDb.collection('posts').add({
      ...postData,
      createdAt: new Date().toISOString(),
      views: 0,
    });
    
    console.log('✅ Firestore에 저장 완료. ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('❌ Firestore 저장 실패:', error);
    throw error;
  }
}

// 메인 실행 함수
async function main() {
  try {
    console.log('🚀 자동화 스크립트 시작\n');
    
    // 1. 랜덤 주제 선택
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    
    // 2. 블로그 글 생성
    const blogPost = await generateBlogPost(randomTopic);
    
    // 3. 이미지 검색
    const imageData = await searchImage(blogPost.keywords);
    
    // 4. 임시 ID 생성 (Storage 업로드용)
    const tempId = `post_${Date.now()}`;
    
    // 5. 이미지를 Firebase Storage에 업로드
    const storageImageUrl = await uploadImageToStorage(imageData.url, tempId);
    
    // 6. Firestore에 저장할 데이터 구성
    const postData = {
      title: blogPost.title,
      content: blogPost.content,
      keywords: blogPost.keywords,
      imageUrl: storageImageUrl,
      imageCredit: {
        photographer: imageData.photographer,
        photographerUrl: imageData.photographerUrl,
      },
      topic: randomTopic,
    };
    
    // 7. Firestore에 저장
    const postId = await savePostToFirestore(postData);
    
    console.log('\n🎉 자동화 완료!');
    console.log('포스트 ID:', postId);
    console.log('제목:', blogPost.title);
    
  } catch (error) {
    console.error('\n❌ 자동화 실패:', error);
    process.exit(1);
  }
}

// 스크립트 실행
main();

