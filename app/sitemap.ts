// Sitemap 생성
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://mijunews-ec404.web.app';
  const now = new Date();
  
  // 정적 페이지
  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'hourly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/?category=미국주식`,
      lastModified: now,
      changeFrequency: 'hourly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/?category=코인`,
      lastModified: now,
      changeFrequency: 'hourly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/post`,
      lastModified: now,
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
  ];
}

