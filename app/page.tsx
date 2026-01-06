'use client';

import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/firebase';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

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
  }).format(date);
}

// 콘텐츠 미리보기 생성
function getContentPreview(content: string, maxLength: number = 150): string {
  const textOnly = content.replace(/[#*`\[\]]/g, '').trim();
  if (textOnly.length <= maxLength) return textOnly;
  return textOnly.substring(0, maxLength) + '...';
}

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const postsQuery = query(
          collection(db, 'posts'),
          orderBy('createdAt', 'desc'),
          limit(20)
        );
        
        const querySnapshot = await getDocs(postsQuery);
        
        const fetchedPosts: Post[] = [];
        querySnapshot.forEach((doc) => {
          fetchedPosts.push({
            id: doc.id,
            ...doc.data(),
          } as Post);
        });
        
        setPosts(fetchedPosts);
      } catch (error) {
        console.error('포스트 가져오기 실패:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

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
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          AI가 만드는 테크 미디어
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          매일 Google Gemini AI가 생성하는 최신 IT/테크 뉴스와 인사이트를 만나보세요
        </p>
      </div>

      {/* Posts Grid */}
      {posts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">
            아직 포스트가 없습니다. 곧 AI가 생성한 콘텐츠를 만나보실 수 있습니다!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <Link href={`/post?id=${post.id}`}>
                <div className="relative h-48 w-full">
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                
                <div className="p-6">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.keywords.slice(0, 3).map((keyword, index) => (
                      <span
                        key={index}
                        className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                  
                  <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition">
                    {post.title}
                  </h2>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {getContentPreview(post.content)}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <time dateTime={post.createdAt}>
                      {formatDate(post.createdAt)}
                    </time>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {post.views}
                    </span>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

