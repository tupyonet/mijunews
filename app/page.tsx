'use client';

import { collection, getDocs, query, orderBy, limit, where } from 'firebase/firestore';
import { db } from '@/firebase';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Script from 'next/script';
import AdSense from './components/AdSense';

// 포스트 타입 정의
interface Post {
  id: string;
  title: string;
  content: string;
  keywords: string[];
  imageUrl: string;
  imageCredit?: {
    photographer: string;
    photographerUrl: string;
  };
  topic?: string;
  category?: string;
  createdAt: string;
  views: number;
  likes?: number;
  dislikes?: number;
}

// 투표 비율 계산 함수
function getVotePercentage(likes: number = 0, dislikes: number = 0) {
  const total = likes + dislikes;
  if (total === 0) return { likePercent: 0, dislikePercent: 0 };
  return {
    likePercent: Math.round((likes / total) * 100),
    dislikePercent: Math.round((dislikes / total) * 100),
  };
}

// 날짜 포맷팅
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

// 콘텐츠 미리보기 생성
function getContentPreview(content: string, maxLength: number = 200): string {
  const textOnly = content.replace(/[#*`\[\]]/g, '').trim();
  if (textOnly.length <= maxLength) return textOnly;
  return textOnly.substring(0, maxLength) + '...';
}

export default function HomePage() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  
  const [usStockPosts, setUsStockPosts] = useState<Post[]>([]);
  const [coinPosts, setCoinPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        if (category) {
          // 특정 카테고리만 보기
          const categoryQuery = query(
            collection(db, 'posts'),
            where('category', '==', category),
            orderBy('createdAt', 'desc'),
            limit(12)
          );
          
          const categorySnapshot = await getDocs(categoryQuery);
          const posts: Post[] = [];
          categorySnapshot.forEach((doc) => {
            posts.push({ id: doc.id, ...doc.data() } as Post);
          });
          
          if (category === '미국주식') {
            setUsStockPosts(posts);
            setCoinPosts([]);
          } else if (category === '코인') {
            setCoinPosts(posts);
            setUsStockPosts([]);
          }
        } else {
          // 홈: 미국주식과 코인 섹션 모두 표시
          // 미국주식 섹션
          const usStockQuery = query(
            collection(db, 'posts'),
            where('category', '==', '미국주식'),
            orderBy('createdAt', 'desc'),
            limit(12)
          );
          
          const usStockSnapshot = await getDocs(usStockQuery);
          const usStocks: Post[] = [];
          usStockSnapshot.forEach((doc) => {
            usStocks.push({ id: doc.id, ...doc.data() } as Post);
          });
          setUsStockPosts(usStocks);

          // 코인 섹션
          const coinQuery = query(
            collection(db, 'posts'),
            where('category', '==', '코인'),
            orderBy('createdAt', 'desc'),
            limit(12)
          );
          
          const coinSnapshot = await getDocs(coinQuery);
          const coins: Post[] = [];
          coinSnapshot.forEach((doc) => {
            coins.push({ id: doc.id, ...doc.data() } as Post);
          });
          setCoinPosts(coins);
        }

      } catch (error) {
        console.error('포스트 가져오기 실패:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, [category]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }
  
  // 구조화된 데이터 (홈페이지용)
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: '미주뉴스 - 미국주식과 코인 뉴스',
    url: 'https://mijunews-ec404.web.app',
    description: '미국주식, 암호화폐, 코인 관련 최신 뉴스와 실시간 시세 정보',
    publisher: {
      '@type': 'Organization',
      name: '미주뉴스',
      logo: {
        '@type': 'ImageObject',
        url: 'https://mijunews-ec404.web.app/logo.png',
      },
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://mijunews-ec404.web.app/?search={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  // 섹션 렌더링 함수 (동아일보 스타일)
  const renderSection = (posts: Post[], title: string, emoji: string, categoryLink?: string) => {
    if (posts.length === 0) {
      return (
        <section className="mb-16">
          <div className="border-b-4 border-gray-900 mb-6 pb-2">
            <h2 className="text-2xl font-black text-gray-900">
              {emoji} {title}
            </h2>
          </div>
          <div className="text-center py-12 text-gray-500">
            <p>아직 기사가 없습니다.</p>
          </div>
        </section>
      );
    }

    const mainPost = posts[0];
    const sidebarPosts = posts.slice(1, 5);
    const gridPosts = posts.slice(5, 11);

    return (
      <section className="mb-10">
        {/* 섹션 제목 - 동아일보 스타일 */}
        <div className="border-b-4 border-gray-900 mb-4 pb-2 flex items-center justify-between">
          <h2 className="text-3xl font-black text-gray-900">
            {emoji} {title}
          </h2>
          {categoryLink && !category && (
            <a 
              href={categoryLink} 
              className="text-sm font-bold text-gray-600 hover:text-blue-600 transition"
            >
              전체보기 →
            </a>
          )}
        </div>

        {/* 메인 히어로 영역 - 좌우 2단 구조 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
          {/* 왼쪽: 메인 기사 이미지 */}
          <div className="lg:col-span-1">
            <Link href={`/post?id=${mainPost.id}`}>
              <article className="group">
                {/* 메인 이미지 */}
                {mainPost.imageUrl && (
                  <div className="relative w-full h-[350px] mb-3 overflow-hidden">
                    <Image
                      src={mainPost.imageUrl}
                      alt={mainPost.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      priority
                    />
                  </div>
                )}
                
                {/* 제목 */}
                <h3 className="text-3xl font-bold text-gray-900 mb-2 leading-snug group-hover:text-blue-600 transition">
                  {mainPost.title}
                </h3>
                
                {/* 미리보기 */}
                <p className="text-base text-gray-600 leading-relaxed line-clamp-2">
                  {getContentPreview(mainPost.content, 120)}
                </p>
              </article>
            </Link>
          </div>
          
          {/* 오른쪽: 서브 기사 리스트 (텍스트만) */}
          <div className="space-y-0 border-l-2 border-gray-200 pl-5">
            {sidebarPosts.map((post, index) => (
              <Link key={post.id} href={`/post?id=${post.id}`}>
                <article className="group py-2 border-b border-gray-200 last:border-0">
                  {/* 불릿 포인트와 제목 */}
                  <div className="flex gap-2">
                    <span className="text-blue-600 font-bold mt-0.5">•</span>
                    <h4 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition line-clamp-2">
                      {post.title}
                    </h4>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>

        {/* 3단 그리드 기사 - 동아일보 스타일 */}
        {gridPosts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-5 border-t border-gray-200">
            {gridPosts.map((post) => (
              <Link key={post.id} href={`/post?id=${post.id}`}>
                <article className="group">
                  {/* 이미지 */}
                  {post.imageUrl && (
                    <div className="relative w-full h-40 mb-2 overflow-hidden">
                      <Image
                        src={post.imageUrl}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  
                  {/* 제목 */}
                  <h4 className="text-base font-bold text-gray-900 mb-1.5 leading-snug line-clamp-2 group-hover:text-blue-600 transition">
                    {post.title}
                  </h4>
                  
                  {/* 간단한 설명 */}
                  <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                    {getContentPreview(post.content, 70)}
                  </p>
                </article>
              </Link>
            ))}
          </div>
        )}
      </section>
    );
  };
  
  return (
    <>
      {/* 구조화된 데이터 */}
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        {/* 상단 광고 */}
        <div className="mb-5">
          <AdSense adClient="ca-pub-3280756983507658" adSlot="2272898322" adFormat="horizontal" />
        </div>

        {/* 미국주식 섹션 */}
        {usStockPosts.length > 0 && renderSection(usStockPosts, '미국주식', '📈', '/?category=미국주식')}

        {/* 중간 광고 */}
        {!category && usStockPosts.length > 0 && coinPosts.length > 0 && (
          <div className="my-6">
            <AdSense adClient="ca-pub-3280756983507658" adSlot="2272898322" adFormat="horizontal" />
          </div>
        )}

        {/* 코인 섹션 */}
        {coinPosts.length > 0 && renderSection(coinPosts, '코인', '₿', '/?category=코인')}

        {/* 하단 광고 */}
        <div className="mt-6">
          <AdSense adClient="ca-pub-3280756983507658" adSlot="2272898322" adFormat="horizontal" />
        </div>
      </div>
    </>
  );
}
