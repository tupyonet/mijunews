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
  
  const [hotPosts, setHotPosts] = useState<Post[]>([]);
  const [latestPosts, setLatestPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        if (category) {
          // 카테고리 필터링
          const categoryQuery = query(
            collection(db, 'posts'),
            where('category', '==', category),
            orderBy('createdAt', 'desc'),
            limit(20)
          );
          
          const categorySnapshot = await getDocs(categoryQuery);
          const posts: Post[] = [];
          categorySnapshot.forEach((doc) => {
            posts.push({ id: doc.id, ...doc.data() } as Post);
          });
          
          setHotPosts(posts.slice(0, 10));
          setLatestPosts(posts.slice(0, 10));
        } else {
          // 핫이슈 - 투표 많은 순
          const hotQuery = query(
            collection(db, 'posts'),
            orderBy('likes', 'desc'),
            limit(10)
          );
          
          const hotSnapshot = await getDocs(hotQuery);
          const hot: Post[] = [];
          hotSnapshot.forEach((doc) => {
            hot.push({ id: doc.id, ...doc.data() } as Post);
          });
          setHotPosts(hot);

          // 최신 뉴스
          const latestQuery = query(
            collection(db, 'posts'),
            orderBy('createdAt', 'desc'),
            limit(10)
          );
          
          const latestSnapshot = await getDocs(latestQuery);
          const latest: Post[] = [];
          latestSnapshot.forEach((doc) => {
            latest.push({ id: doc.id, ...doc.data() } as Post);
          });
          setLatestPosts(latest);
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
    url: 'https://tupyo-net.web.app',
    description: '미국주식, 암호화폐, 코인 관련 최신 뉴스와 정보',
    publisher: {
      '@type': 'Organization',
      name: '미주뉴스',
      logo: {
        '@type': 'ImageObject',
        url: 'https://tupyo-net.web.app/logo.png',
      },
    },
  };

  // 섹션 렌더링 함수 (전통 미디어 스타일)
  const renderSection = (posts: Post[], title: string, emoji: string) => {
    if (posts.length === 0) {
      return (
        <section className="mb-12">
          <div className="border-b-2 border-gray-900 mb-6">
            <h2 className="text-2xl font-black text-gray-900 pb-3">
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
    const sidebarPosts = posts.slice(1, 4);
    const gridPosts = posts.slice(4, 10);

    return (
      <section className="mb-12">
        {/* 섹션 제목 */}
        <div className="border-b-2 border-gray-900 mb-6">
          <h2 className="text-2xl font-black text-gray-900 pb-3">
            {emoji} {title}
          </h2>
        </div>

        {/* 메인 콘텐츠 영역 (3단 구조) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* 메인 히어로 기사 (왼쪽 2칸) */}
          <div className="lg:col-span-2">
            <Link href={`/post?id=${mainPost.id}`}>
              <article className="group">
                {/* 카테고리 태그 */}
                {mainPost.category && (
                  <span className="inline-block bg-blue-600 text-white text-xs font-bold px-3 py-1 mb-3">
                    {mainPost.category}
                  </span>
                )}
                
                {/* 메인 이미지 */}
                {mainPost.imageUrl && (
                  <div className="relative w-full h-[400px] mb-4 overflow-hidden">
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
                <h3 className="text-3xl font-black text-gray-900 mb-3 leading-tight group-hover:text-blue-600 transition">
                  {mainPost.title}
                </h3>
                
                {/* 미리보기 */}
                <p className="text-base text-gray-700 leading-relaxed mb-4 line-clamp-3">
                  {getContentPreview(mainPost.content)}
                </p>
                
                {/* 메타 정보 */}
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                  <time dateTime={mainPost.createdAt}>
                    {formatDate(mainPost.createdAt)}
                  </time>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    {mainPost.views.toLocaleString()}
                  </span>
                  {(() => {
                    const total = (mainPost.likes || 0) + (mainPost.dislikes || 0);
                    return total > 0 ? (
                      <span className="flex items-center gap-1">
                        투표수 {total.toLocaleString()}표
                      </span>
                    ) : null;
                  })()}
                </div>

                {/* 투표 결과 바 */}
                {(() => {
                  const likes = mainPost.likes || 0;
                  const dislikes = mainPost.dislikes || 0;
                  const total = likes + dislikes;
                  const { likePercent, dislikePercent } = getVotePercentage(likes, dislikes);
                  
                  return total > 0 ? (
                    <div className="flex h-2 rounded-full overflow-hidden bg-gray-200">
                      {likePercent > 0 && (
                        <div className="bg-green-500" style={{ width: `${likePercent}%` }} />
                      )}
                      {dislikePercent > 0 && (
                        <div className="bg-red-500" style={{ width: `${dislikePercent}%` }} />
                      )}
                    </div>
                  ) : null;
                })()}
              </article>
            </Link>
          </div>
          
          {/* 사이드바 기사 (오른쪽 1칸) */}
          <div className="space-y-6">
            {sidebarPosts.map((post, index) => (
              <Link key={post.id} href={`/post?id=${post.id}`}>
                <article className="group border-b border-gray-200 pb-4 last:border-0">
                  {/* 이미지 */}
                  {post.imageUrl && (
                    <div className="relative w-full h-48 mb-3 overflow-hidden rounded">
                      <Image
                        src={post.imageUrl}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  
                  {/* 카테고리 */}
                  {post.category && (
                    <span className="inline-block bg-gray-200 text-gray-800 text-xs font-bold px-2 py-1 mb-2">
                      {post.category}
                    </span>
                  )}
                  
                  {/* 제목 */}
                  <h4 className="text-lg font-bold text-gray-900 mb-2 leading-tight line-clamp-2 group-hover:text-blue-600 transition">
                    {post.title}
                  </h4>
                  
                  {/* 날짜와 투표 */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                    <time dateTime={post.createdAt}>
                      {new Date(post.createdAt).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })}
                    </time>
                    {(() => {
                      const total = (post.likes || 0) + (post.dislikes || 0);
                      return total > 0 ? (
                        <span className="font-semibold">👍 {total.toLocaleString()}표</span>
                      ) : null;
                    })()}
                  </div>

                  {/* 투표 결과 바 */}
                  {(() => {
                    const likes = post.likes || 0;
                    const dislikes = post.dislikes || 0;
                    const total = likes + dislikes;
                    const { likePercent, dislikePercent } = getVotePercentage(likes, dislikes);
                    
                    return total > 0 ? (
                      <div className="flex h-1.5 rounded-full overflow-hidden bg-gray-200">
                        {likePercent > 0 && (
                          <div className="bg-green-500" style={{ width: `${likePercent}%` }} />
                        )}
                        {dislikePercent > 0 && (
                          <div className="bg-red-500" style={{ width: `${dislikePercent}%` }} />
                        )}
                      </div>
                    ) : null;
                  })()}
                </article>
              </Link>
            ))}
          </div>
        </div>

        {/* 그리드 기사 (4열) */}
        {gridPosts.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {gridPosts.map((post) => (
              <Link key={post.id} href={`/post?id=${post.id}`}>
                <article className="group">
                  {/* 이미지 */}
                  {post.imageUrl && (
                    <div className="relative w-full h-40 mb-3 overflow-hidden rounded">
                      <Image
                        src={post.imageUrl}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  
                  {/* 카테고리 */}
                  {post.category && (
                    <span className="inline-block bg-purple-100 text-purple-800 text-xs font-bold px-2 py-1 rounded mb-2">
                      {post.category}
                    </span>
                  )}
                  
                  {/* 제목 */}
                  <h4 className="text-sm font-bold text-gray-900 mb-2 leading-tight line-clamp-2 group-hover:text-blue-600 transition">
                    {post.title}
                  </h4>
                  
                  {/* 메타 */}
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                    <time dateTime={post.createdAt}>
                      {new Date(post.createdAt).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
                    </time>
                    {(() => {
                      const total = (post.likes || 0) + (post.dislikes || 0);
                      return total > 0 ? (
                        <>
                          <span>•</span>
                          <span>투표수 {total.toLocaleString()}</span>
                        </>
                      ) : null;
                    })()}
                  </div>

                  {/* 투표 결과 바 */}
                  {(() => {
                    const likes = post.likes || 0;
                    const dislikes = post.dislikes || 0;
                    const total = likes + dislikes;
                    const { likePercent, dislikePercent } = getVotePercentage(likes, dislikes);
                    
                    return total > 0 ? (
                      <div className="flex h-1.5 rounded-full overflow-hidden bg-gray-200">
                        {likePercent > 0 && (
                          <div className="bg-green-500" style={{ width: `${likePercent}%` }} />
                        )}
                        {dislikePercent > 0 && (
                          <div className="bg-red-500" style={{ width: `${dislikePercent}%` }} />
                        )}
                      </div>
                    ) : null;
                  })()}
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
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 상단 광고 */}
        <AdSense adClient="ca-pub-3280756983507658" adSlot="2272898322" adFormat="horizontal" />

        {/* 핫이슈 섹션 */}
        {!category && renderSection(hotPosts, '핫이슈', '🔥')}

        {/* 중간 광고 */}
        {!category && <AdSense adClient="ca-pub-3280756983507658" adSlot="2272898322" adFormat="horizontal" />}

        {/* 최신 뉴스 섹션 */}
        {renderSection(latestPosts, category ? `${category} 뉴스` : '최신 뉴스', category ? '📰' : '⚡')}

        {/* 하단 광고 */}
        <AdSense adClient="ca-pub-3280756983507658" adSlot="2272898322" adFormat="horizontal" />
      </div>
    </>
  );
}
