// RSS 수집 + AI 변환 + Firebase 전송 통합 스크립트
import 'dotenv/config';
import Parser from 'rss-parser';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from 'pexels';
import fetch from 'node-fetch';
import { adminDb, adminStorage } from './firebase-admin.js';

// API 초기화
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const pexelsClient = createClient(process.env.PEXELS_API_KEY);
const parser = new Parser();

// RSS 피드 URL 목록 (배열로 변경 - 카테고리별 여러 소스)
const RSS_FEEDS = {
  정치: [
    'https://www.chosun.com/arc/outboundfeeds/rss/category/politics/?outputType=xml',
    'https://www.khan.co.kr/rss/rssdata/politic_news.xml',
    'https://www.mk.co.kr/rss/30200030/',
    'https://www.hankyung.com/feed/politics',
  ],
  경제: [
    'https://www.chosun.com/arc/outboundfeeds/rss/category/economy/?outputType=xml',
    'https://www.khan.co.kr/rss/rssdata/economy_news.xml',
    'https://www.mk.co.kr/rss/30100041/',
    'https://www.hankyung.com/feed/economy',
  ],
  부동산: [
    'https://www.mk.co.kr/rss/50300009/',
    'https://www.hankyung.com/feed/realestate',
  ],
  증권: [
    'https://www.mk.co.kr/rss/50200011/',
    'https://www.hankyung.com/feed/finance',
  ],
  코인: [
    'https://www.coindesk.com/arc/outboundfeeds/rss/?outputType=xml',
    'https://cointelegraph.com/rss',
    'https://cryptopotato.com/feed/',
    'https://cryptoslate.com/feed/',
    'https://cryptonews.com/news/feed/',
    'https://thedefiant.io/feed/',
    'https://www.ccn.com/news/crypto-news/feeds/',
    'https://www.ccn.com/analysis/crypto-analysis/feeds/',
  ],
  연예: ['https://news.google.com/rss/headlines/section/topic/ENTERTAINMENT?hl=ko&gl=KR&ceid=KR:ko'],
  스포츠: ['https://news.google.com/rss/headlines/section/topic/SPORTS?hl=ko&gl=KR&ceid=KR:ko'],
  과학: ['https://news.google.com/rss/headlines/section/topic/SCITECH?hl=ko&gl=KR&ceid=KR:ko'],
  건강: ['https://news.google.com/rss/headlines/section/topic/HEALTH?hl=ko&gl=KR&ceid=KR:ko'],
  세계: ['https://news.google.com/rss/headlines/section/topic/WORLD?hl=ko&gl=KR&ceid=KR:ko'],
  IT: ['https://news.google.com/rss/headlines/section/topic/TECHNOLOGY?hl=ko&gl=KR&ceid=KR:ko'],
};

// 카테고리 매핑 (Google News 카테고리 → 사이트 카테고리)
const CATEGORY_MAP = {
  'POLITICS': '정치',
  'BUSINESS': '경제',
  'ENTERTAINMENT': '연예',
  'SPORTS': '스포츠',
  'SCITECH': '과학',
  'HEALTH': '건강',
  'WORLD': '세계',
  'TECHNOLOGY': 'IT',
  '정치': '정치',
  '경제': '경제',
  '부동산': '부동산',
  '증권': '증권',
  '코인': '코인',
  '연예': '연예',
  '스포츠': '스포츠',
  '과학': '과학',
  '건강': '건강',
  '세계': '세계',
  'IT': 'IT',
};

// 1. RSS 피드에서 최신 기사 수집 (특정 카테고리만)
async function fetchRSSFeeds(targetCategory = null) {
  const articles = [];
  
  // 특정 카테고리만 수집하거나 전체 수집
  const categoriesToFetch = targetCategory 
    ? { [targetCategory]: RSS_FEEDS[targetCategory] }
    : RSS_FEEDS;
  
  for (const [category, urls] of Object.entries(categoriesToFetch)) {
    console.log(`📰 ${category} 카테고리 RSS 피드 수집 중...`);
    
    // 각 카테고리의 여러 RSS 소스에서 수집
    for (const url of urls) {
      try {
        const feed = await parser.parseURL(url);
        
        // 최신 2개 기사만 수집 (여러 소스이므로 개수 줄임)
        const items = feed.items.slice(0, 2);
        
        for (const item of items) {
          articles.push({
            title: item.title,
            link: item.link,
            pubDate: item.pubDate,
            category: CATEGORY_MAP[category] || category,
            sourceCategory: category,
          });
        }
        
        console.log(`   ✅ ${url.substring(0, 40)}...: ${items.length}개 기사 수집`);
      } catch (error) {
        console.error(`   ❌ RSS 수집 실패 (${url.substring(0, 40)}...):`, error.message);
      }
    }
  }
  
  console.log(`\n📊 총 ${articles.length}개 기사 수집 완료\n`);
  return articles;
}

// 2. 기사 내용 가져오기 (간단한 요약용)
async function fetchArticleContent(link) {
  try {
    // Google News 링크는 리다이렉트되므로 실제 URL 추출 필요
    // 여기서는 제목과 링크만 사용하고 AI가 요약 생성
    return null; // 실제 구현 시 기사 본문 크롤링 가능
  } catch (error) {
    console.error('기사 내용 가져오기 실패:', error);
    return null;
  }
}

// 3. AI로 기사 요약 및 재구성
async function processArticleWithAI(article) {
  try {
    console.log(`🤖 AI 처리 중: ${article.title.substring(0, 50)}...`);
    
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    
    const prompt = `당신은 전문 뉴스 기자입니다. 다음 뉴스 제목을 바탕으로 독창적이고 전문적인 뉴스 기사를 작성해주세요.

제목: ${article.title}
카테고리: ${article.category}
출처: ${article.link}

요구사항:
1. 매력적이고 정확한 제목을 만들어주세요 (한글, 40자 이내)
2. 본문은 마크다운 형식으로 1000-1500자 정도로 작성해주세요
3. 객관적이고 전문적인 톤을 유지해주세요
4. 실제 뉴스처럼 보도하되, 독창적인 관점을 포함해주세요
5. 카테고리는 반드시 주어진 카테고리("${article.category}")를 사용해주세요

다음 JSON 형식으로만 응답해주세요 (다른 설명 없이 JSON만):
{
  "title": "기사 제목",
  "content": "마크다운 형식의 본문",
  "keywords": ["키워드1", "키워드2", "키워드3", "키워드4", "키워드5"],
  "category": "${article.category}"
}

중요: 반드시 유효한 JSON 형식으로만 응답하고, 본문 내용에 줄바꿈은 \\n으로 표시해주세요.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // JSON 추출 개선 - 코드 블록이나 마크다운 제거
    let cleanText = text.trim();
    
    // ```json 또는 ``` 로 감싸진 경우 제거
    cleanText = cleanText.replace(/```json\s*/g, '').replace(/```\s*/g, '');
    
    // JSON 객체 찾기 (첫 번째 { 부터 마지막 } 까지)
    const firstBrace = cleanText.indexOf('{');
    const lastBrace = cleanText.lastIndexOf('}');
    
    if (firstBrace === -1 || lastBrace === -1) {
      throw new Error('유효한 JSON 응답을 받지 못했습니다.');
    }
    
    const jsonStr = cleanText.substring(firstBrace, lastBrace + 1);
    
    let parsed;
    try {
      parsed = JSON.parse(jsonStr);
    } catch (e) {
      // JSON 파싱 실패 시 더 자세한 오류 출력
      console.error('JSON 파싱 실패. 원본 텍스트:', jsonStr.substring(0, 200) + '...');
      throw e;
    }
    
    // 카테고리 강제 적용 (AI 응답 무시하고 원본 카테고리 사용)
    parsed.category = article.category;
    
    console.log(`✅ AI 처리 완료 - 카테고리: ${parsed.category}`);
    return parsed;
  } catch (error) {
    console.error('❌ AI 처리 실패:', error);
    throw error;
  }
}

// 4. Pexels에서 이미지 검색 (100개 중 랜덤 선택)
async function searchImage(keywords) {
  try {
    const searchQuery = keywords.slice(0, 3).join(' ');
    console.log(`🔍 이미지 검색 중: ${searchQuery}`);
    
    const result = await pexelsClient.photos.search({
      query: searchQuery,
      per_page: 80, // 최대 80개 (Pexels API 제한)
      orientation: 'landscape',
    });

    if (result && result.photos && result.photos.length > 0) {
      // 랜덤하게 하나 선택
      const randomIndex = Math.floor(Math.random() * result.photos.length);
      const photo = result.photos[randomIndex];
      
      console.log(`✅ ${result.photos.length}개 중 ${randomIndex + 1}번째 이미지 선택`);
      
      return {
        url: photo.src.large,
        photographer: photo.photographer,
        photographerUrl: photo.photographer_url,
      };
    } else {
      console.log('⚠️ 검색 결과 없음 - 이미지 없이 진행');
      return null;
    }
  } catch (error) {
    console.error('❌ 이미지 검색 실패:', error);
    return null;
  }
}

// 5. 이미지를 Firebase Storage에 업로드
async function uploadImageToStorage(imageUrl, postId) {
  if (!imageUrl) {
    console.log('⏭️ 이미지 없음 - 업로드 건너뜀');
    return null;
  }
  
  try {
    console.log('📤 Firebase Storage에 이미지 업로드 중...');
    
    const response = await fetch(imageUrl);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const bucket = adminStorage.bucket();
    const fileName = `posts/${postId}.jpg`;
    const file = bucket.file(fileName);
    
    await file.save(buffer, {
      metadata: {
        contentType: 'image/jpeg',
      },
      public: true,
    });
    
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
    console.log('✅ 이미지 업로드 완료');
    return publicUrl;
  } catch (error) {
    console.error('❌ 이미지 업로드 실패:', error);
    return null;
  }
}

// 6. 현재 카테고리별 기사 수 확인
async function getCategoryStats() {
  try {
    const snapshot = await adminDb.collection('posts').get();
    const stats = {
      정치: 0,
      경제: 0,
      부동산: 0,
      증권: 0,
      코인: 0,
      연예: 0,
      스포츠: 0,
      IT: 0,
      과학: 0,
      건강: 0,
      세계: 0,
    };
    
    snapshot.forEach(doc => {
      const category = doc.data().category;
      if (stats.hasOwnProperty(category)) {
        stats[category]++;
      }
    });
    
    return stats;
  } catch (error) {
    console.error('카테고리 통계 조회 실패:', error);
    return null;
  }
}

// 7. 목표 비율에 따라 가장 부족한 카테고리 선택
function selectCategoryByRatio(stats) {
  // 목표 비율 (정치:경제:부동산:증권:코인:연예:스포츠:IT:과학:건강:세계 = 4:4:1:2:4:1:1:1:0.5:1:1)
  const targetRatios = {
    정치: 4,
    경제: 4,
    부동산: 1,
    증권: 2,
    코인: 4,
    연예: 1,
    스포츠: 1,
    IT: 1,
    과학: 0.5,
    건강: 1,
    세계: 1,
  };
  
  console.log('\n📊 현재 카테고리별 기사 수:');
  for (const [category, count] of Object.entries(stats)) {
    console.log(`   ${category}: ${count}개 (목표 비율: ${targetRatios[category]})`);
  }
  
  // 각 카테고리의 현재 개수를 목표 비율로 나눈 값 계산
  // 이 값이 가장 작은 카테고리가 가장 부족한 카테고리
  let minCategory = null;
  let minRatio = Infinity;
  
  for (const [category, count] of Object.entries(stats)) {
    const ratio = count / targetRatios[category];
    console.log(`   ${category}: ${count} / ${targetRatios[category]} = ${ratio.toFixed(2)}`);
    
    if (ratio < minRatio) {
      minRatio = ratio;
      minCategory = category;
    }
  }
  
  console.log(`\n🎯 선택된 카테고리: ${minCategory} (비율: ${minRatio.toFixed(2)})\n`);
  return minCategory;
}

// 8. 중복 기사 확인 (제목 기준)
async function isDuplicateArticle(title) {
  try {
    const snapshot = await adminDb.collection('posts')
      .where('title', '==', title)
      .limit(1)
      .get();
    
    return !snapshot.empty;
  } catch (error) {
    console.error('중복 확인 실패:', error);
    return false;
  }
}

// 9. Firestore에 저장
async function savePostToFirestore(postData) {
  try {
    console.log('💾 Firestore에 포스트 저장 중...');
    
    const docRef = await adminDb.collection('posts').add({
      ...postData,
      createdAt: new Date().toISOString(),
      views: 0,
      likes: 0,
      dislikes: 0,
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
    console.log('🚀 RSS 처리 스크립트 시작\n');
    
    // 1. 현재 카테고리별 통계 확인
    console.log('📊 현재 DB 상태 확인 중...');
    const categoryStats = await getCategoryStats();
    
    if (!categoryStats) {
      console.log('❌ 카테고리 통계를 가져올 수 없습니다.');
      return;
    }
    
    // 2. 목표 비율에 따라 가장 부족한 카테고리 선택
    const targetCategory = selectCategoryByRatio(categoryStats);
    
    if (!targetCategory) {
      console.log('❌ 대상 카테고리를 선택할 수 없습니다.');
      return;
    }
    
    // 3. 선택된 카테고리의 RSS 피드만 수집
    const articles = await fetchRSSFeeds(targetCategory);
    
    if (articles.length === 0) {
      console.log(`⚠️ ${targetCategory} 카테고리 기사가 수집되지 않았습니다.`);
      return;
    }
    
    // 4. 해당 카테고리에서 랜덤으로 하나 선택
    const randomIndex = Math.floor(Math.random() * articles.length);
    const selectedArticle = articles[randomIndex];
    
    console.log(`\n🎲 선택된 기사: ${selectedArticle.title.substring(0, 50)}...`);
    console.log(`📂 카테고리: ${selectedArticle.category}\n`);
    
    let successCount = 0;
    
    // 선택된 기사 하나만 처리
    const articlesToProcess = [selectedArticle];
    
    for (const article of articlesToProcess) {
      try {
        // 중복 확인
        const isDup = await isDuplicateArticle(article.title);
        if (isDup) {
          console.log(`⏭️ 중복 기사 건너뛰기: ${article.title.substring(0, 50)}...`);
          continue;
        }
        
        // AI로 기사 처리
        const processedArticle = await processArticleWithAI(article);
        
        // 이미지 검색
        const imageData = await searchImage(processedArticle.keywords);
        
        // 이미지 업로드
        let storageImageUrl = null;
        let imageCredit = null;
        
        if (imageData) {
          const tempId = `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          storageImageUrl = await uploadImageToStorage(imageData.url, tempId);
          if (storageImageUrl) {
            imageCredit = {
              photographer: imageData.photographer,
              photographerUrl: imageData.photographerUrl,
            };
          }
        }
        
        // Firestore에 저장
        const postData = {
          title: processedArticle.title,
          content: processedArticle.content,
          keywords: processedArticle.keywords,
          category: processedArticle.category,
          originalLink: article.link,
          originalTitle: article.title,
        };
        
        // 이미지가 있을 때만 추가
        if (storageImageUrl) {
          postData.imageUrl = storageImageUrl;
          postData.imageCredit = imageCredit;
        }
        
        await savePostToFirestore(postData);
        successCount++;
        
        console.log(`✅ 완료: ${processedArticle.title}\n`);
        
        // API 할당량 고려하여 대기
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (error) {
        console.error(`❌ 기사 처리 실패: ${article.title}`, error.message);
        continue;
      }
    }
    
    console.log(`\n🎉 처리 완료! ${successCount}개 기사가 생성되었습니다.`);
    
  } catch (error) {
    console.error('\n❌ 스크립트 실행 실패:', error);
    process.exit(1);
  }
}

// 스크립트 실행
main();

