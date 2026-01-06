'use client';

import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/firebase';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

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
  topic: string;
  createdAt: string;
  views: number;
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

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
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
        
        setPost({
          id: docSnap.id,
          ...docSnap.data(),
        } as Post);
      } catch (error) {
        console.error('포스트 가져오기 실패:', error);
        setPost(null);
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [id]);

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
  
  return (
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
        {/* 메인 이미지 */}
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

        <div className="p-8 md:p-12">
          {/* 메타 정보 */}
          <div className="flex flex-wrap gap-2 mb-4">
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

          {/* AI 생성 안내 */}
          <div className="mt-12 p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>ℹ️ AI 생성 콘텐츠</strong>
              <br />
              이 글은 Google Gemini AI에 의해 자동으로 생성되었습니다.
              내용의 정확성을 위해 추가 검증이 필요할 수 있습니다.
            </p>
          </div>
        </div>
      </article>
    </div>
  );
}

