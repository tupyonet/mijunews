// 동적 메타데이터 생성 (서버 컴포넌트)
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const docRef = doc(db, 'posts', params.id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return {
        title: '포스트를 찾을 수 없습니다 | Tupyo',
        description: '요청하신 포스트를 찾을 수 없습니다.',
      };
    }
    
    const post = docSnap.data();
    const description = post.content
      ? post.content.substring(0, 160).replace(/[#*`\[\]]/g, '').trim()
      : 'Tupyo 종합 뉴스 미디어에서 최신 뉴스를 확인하세요.';
    
    return {
      title: `${post.title} | Tupyo`,
      description: description,
      keywords: post.keywords || [],
      category: post.category || '종합',
      openGraph: {
        title: post.title,
        description: description,
        images: [
          {
            url: post.imageUrl,
            width: 1200,
            height: 630,
            alt: post.title,
          },
        ],
        type: 'article',
        publishedTime: post.createdAt,
        authors: ['Tupyo'],
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: description,
        images: [post.imageUrl],
      },
    };
  } catch (error) {
    console.error('메타데이터 생성 실패:', error);
    return {
      title: 'Tupyo - 종합 뉴스 미디어',
      description: 'Tupyo 종합 뉴스 미디어에서 최신 뉴스를 확인하세요.',
    };
  }
}

