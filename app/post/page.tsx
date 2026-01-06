'use client';

import { doc, getDoc, updateDoc, increment, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Script from 'next/script';
import AdSense from '../components/AdSense';

interface Post {
  id: string;
  title: string;
  content: string;
  keywords: string[];
  imageUrl?: string;
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

// 마크다운을 간단한 HTML로 변환
function parseMarkdown(markdown: string): string {
  let html = markdown;
  
  // 헤딩
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  
  // 볼드
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // 이탤릭
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // 코드
  html = html.replace(/`(.*?)`/g, '<code>$1</code>');
  
  // 링크
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  
  // 리스트
  html = html.replace(/^\- (.*$)/gim, '<li>$1</li>');
  html = html.replace(/(<li>[\s\S]*<\/li>)/, '<ul>$1</ul>');
  
  // 단락
  html = html.split('\n\n').map(para => {
    if (para.startsWith('<h') || para.startsWith('<ul') || para.startsWith('<li')) {
      return para;
    }
    return `<p>${para.replace(/\n/g, '<br>')}</p>`;
  }).join('\n');
  
  return html;
}

export default function PostPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasVoted, setHasVoted] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    // 투표 여부 확인 (로컬스토리지)
    const votedPosts = JSON.parse(localStorage.getItem('votedPosts') || '{}');
    if (votedPosts[id]) {
      setHasVoted(true);
    }

    async function fetchPost() {
      try {
        if (!id) {
          setPost(null);
          setLoading(false);
          return;
        }
        
        const docRef = doc(db, 'posts', id);
        const docSnap = await getDoc(docRef);
        
        if (!docSnap.exists()) {
          setPost(null);
          setLoading(false);
          return;
        }
        
        // 조회수 증가
        updateDoc(docRef, {
          views: increment(1),
        }).catch(error => console.error('조회수 업데이트 실패:', error));
        
        const postData = {
          id: docSnap.id,
          likes: 0,
          dislikes: 0,
          ...docSnap.data(),
        } as Post;
        
        setPost(postData);
        
        // 관련 기사 가져오기 (최신 20개 중 랜덤 3개)
        fetchRelatedPosts(id);
      } catch (error) {
        console.error('포스트 가져오기 실패:', error);
        setPost(null);
      } finally {
        setLoading(false);
      }
    }

    async function fetchRelatedPosts(currentPostId: string) {
      try {
        const postsRef = collection(db, 'posts');
        const q = query(postsRef, orderBy('createdAt', 'desc'), limit(20));
        const snapshot = await getDocs(q);
        
        const posts: Post[] = snapshot.docs
          .filter(doc => doc.id !== currentPostId) // 현재 포스트 제외
          .map(doc => ({
            id: doc.id,
            likes: 0,
            dislikes: 0,
            ...doc.data()
          } as Post));
        
        // 랜덤하게 3개 선택
        const shuffled = posts.sort(() => 0.5 - Math.random());
        setRelatedPosts(shuffled.slice(0, 3));
      } catch (error) {
        console.error('관련 기사 가져오기 실패:', error);
      }
    }

    fetchPost();
  }, [id]);

  const handleVote = async (type: 'like' | 'dislike') => {
    if (!id || !post || hasVoted || isVoting) return;

    setIsVoting(true);
    try {
      const docRef = doc(db, 'posts', id);
      const field = type === 'like' ? 'likes' : 'dislikes';
      
      await updateDoc(docRef, {
        [field]: increment(1),
      });

      // 로컬스토리지에 투표 기록 저장
      const votedPosts = JSON.parse(localStorage.getItem('votedPosts') || '{}');
      votedPosts[id] = type;
      localStorage.setItem('votedPosts', JSON.stringify(votedPosts));

      // UI 업데이트
      setPost({
        ...post,
        likes: (post.likes || 0) + (type === 'like' ? 1 : 0),
        dislikes: (post.dislikes || 0) + (type === 'dislike' ? 1 : 0),
      });
      setHasVoted(true);
    } catch (error) {
      console.error('투표 실패:', error);
    } finally {
      setIsVoting(false);
    }
  };

  const getVotePercentage = (likes: number, dislikes: number) => {
    const total = likes + dislikes;
    if (total === 0) return { likePercent: 0, dislikePercent: 0 };
    return {
      likePercent: Math.round((likes / total) * 100),
      dislikePercent: Math.round((dislikes / total) * 100),
    };
  };

  const { likePercent, dislikePercent } = getVotePercentage(
    post?.likes || 0,
    post?.dislikes || 0
  );

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

  if (!post || !id) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          포스트를 찾을 수 없습니다
        </h2>
        <Link
          href="/"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          홈으로 돌아가기
        </Link>
      </div>
    );
  }
  
  const htmlContent = parseMarkdown(post.content);
  
  // 구조화된 데이터 (JSON-LD) 생성
  const structuredData: any = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: post.title,
    datePublished: post.createdAt,
    dateModified: post.createdAt,
    author: {
      '@type': 'Organization',
      name: '투표넷',
      url: 'https://tupyo-net.web.app',
    },
    publisher: {
      '@type': 'Organization',
      name: '투표넷',
      logo: {
        '@type': 'ImageObject',
        url: 'https://tupyo-net.web.app/logo.png',
      },
    },
    description: post.content.substring(0, 160).replace(/[#*`\[\]]/g, '').trim(),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://tupyo-net.web.app/post?id=${id}`,
    },
    articleSection: post.category || '종합',
    keywords: post.keywords.join(', '),
    interactionStatistic: [
      {
        '@type': 'InteractionCounter',
        interactionType: 'https://schema.org/LikeAction',
        userInteractionCount: post.likes || 0,
      },
      {
        '@type': 'InteractionCounter',
        interactionType: 'https://schema.org/DislikeAction',
        userInteractionCount: post.dislikes || 0,
      },
    ],
  };
  
  // 이미지가 있을 때만 추가
  if (post.imageUrl) {
    structuredData.image = [post.imageUrl];
  }
  
  return (
    <>
      {/* 구조화된 데이터 */}
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* 뒤로가기 버튼 */}
      <div className="mb-8">
        <Link 
          href="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 transition"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          목록으로 돌아가기
        </Link>
      </div>

      <article className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* 메인 이미지 - 이미지가 있을 때만 표시 */}
        {post.imageUrl && (
          <div className="relative h-96 w-full">
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
            {post.imageCredit && (
              <div className="absolute bottom-0 right-0 bg-black bg-opacity-50 text-white text-xs px-3 py-2">
                Photo by{' '}
                <a
                  href={post.imageCredit.photographerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-blue-300"
                >
                  {post.imageCredit.photographer}
                </a>
                {' '}on Pexels
              </div>
            )}
          </div>
        )}

        <div className="p-8 md:p-12">
          {/* 메타 정보 */}
          <div className="flex flex-wrap gap-2 mb-4">
            {post.category && (
              <span className="inline-block bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full font-semibold">
                {post.category}
              </span>
            )}
            {post.keywords.map((keyword, index) => (
              <span
                key={index}
                className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
              >
                {keyword}
              </span>
            ))}
          </div>

          {/* 제목 */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {post.title}
          </h1>

          {/* 날짜 및 조회수 */}
          <div className="flex items-center gap-6 text-gray-600 mb-8 pb-8 border-b">
            <time dateTime={post.createdAt} className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formatDate(post.createdAt)}
            </time>
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {post.views} views
            </span>
          </div>

          {/* 본문 */}
          <div 
            className="markdown-content"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />

          {/* 투표 섹션 */}
          <div className="mt-12 pt-8 border-t">
            <h3 className="text-xl font-bold text-gray-900 mb-4">이 글이 도움이 되셨나요?</h3>
            
            {/* 투표 버튼 */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => handleVote('like')}
                disabled={hasVoted || isVoting}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${
                  hasVoted
                    ? 'bg-green-100 text-green-700 cursor-not-allowed'
                    : 'bg-green-500 text-white hover:bg-green-600 active:scale-95'
                } ${isVoting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
                좋아요
                {post.likes ? ` (${post.likes})` : ''}
              </button>
              
              <button
                onClick={() => handleVote('dislike')}
                disabled={hasVoted || isVoting}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${
                  hasVoted
                    ? 'bg-red-100 text-red-700 cursor-not-allowed'
                    : 'bg-red-500 text-white hover:bg-red-600 active:scale-95'
                } ${isVoting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                </svg>
                나빠요
                {post.dislikes ? ` (${post.dislikes})` : ''}
              </button>
            </div>

            {/* 투표 비율 표시 */}
            {(post.likes || post.dislikes) ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>투표 결과</span>
                  <span className="font-semibold">
                    총 {((post.likes || 0) + (post.dislikes || 0)).toLocaleString()}표
                  </span>
                </div>
                
                {/* 비율 막대 */}
                <div className="flex h-8 rounded-lg overflow-hidden shadow-sm">
                  {(() => {
                    const { likePercent, dislikePercent } = getVotePercentage(
                      post.likes || 0,
                      post.dislikes || 0
                    );
                    return (
                      <>
                        {likePercent > 0 && (
                          <div
                            className="bg-green-500 flex items-center justify-center text-white font-semibold text-sm transition-all duration-500"
                            style={{ width: `${likePercent}%` }}
                          >
                            {likePercent}%
                          </div>
                        )}
                        {dislikePercent > 0 && (
                          <div
                            className="bg-red-500 flex items-center justify-center text-white font-semibold text-sm transition-all duration-500"
                            style={{ width: `${dislikePercent}%` }}
                          >
                            {dislikePercent}%
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
                
                {/* 상세 비율 */}
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 bg-green-500 rounded"></span>
                    좋아요: {likePercent}%
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 bg-red-500 rounded"></span>
                    나빠요: {dislikePercent}%
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">첫 번째 투표를 해주세요!</p>
            )}
          </div>

          {/* 관련 기사 */}
          {relatedPosts.length > 0 && (
            <div className="mt-12 pt-8 border-t">
              <h3 className="text-xl font-bold text-gray-900 mb-4">다른 기사 보기</h3>
              <ul className="space-y-3">
                {relatedPosts.map((relatedPost) => (
                  <li key={relatedPost.id}>
                    <Link
                      href={`/post?id=${relatedPost.id}`}
                      className="block p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition group"
                    >
                      <div className="flex items-start gap-3">
                        {relatedPost.category && (
                          <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded font-semibold whitespace-nowrap">
                            {relatedPost.category}
                          </span>
                        )}
                        <span className="text-gray-900 group-hover:text-blue-600 font-medium transition">
                          {relatedPost.title}
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* AdSense - Post Bottom */}
          <AdSense
            adClient="ca-pub-3280756983507658"
            adSlot="2272898322"
            adFormat="horizontal"
            fullWidthResponsive={true}
          />

        </div>
      </article>
      </div>
    </>
  );
}

