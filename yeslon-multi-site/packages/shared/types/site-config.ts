export interface SiteConfig {
  subdomain: string;
  domain: string;
  siteName: string;
  siteNameEn: string;
  description: string;
  keywords: string[];
  industry: string;
  region?: string;
  language: string;
  primaryColor: string;
  secondaryColor: string;
  logo: string;
  features: string[];
  seo: SEOSettings;
  social: SocialSettings;
  contact: ContactInfo;
}

export interface SEOSettings {
  titleTemplate: string;
  description: string;
  keywords: string[];
  ogImage: string;
  twitterCard: string;
  noIndex?: boolean;
  hreflang?: HreflangConfig[];
}

export interface HreflangConfig {
  hreflang: string;
  href: string;
}

export interface SocialSettings {
  wechat?: string;
  weibo?: string;
  linkedin?: string;
}

export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  workingHours?: string;
}

export interface PageConfig {
  path: string;
  title: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  lastModified?: string;
  changeFreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export interface GeoSettings {
  enabled: boolean;
  regions: RegionConfig[];
  redirectStrategy: 'auto' | 'manual';
}

export interface RegionConfig {
  code: string;
  name: string;
  nameEn: string;
  currency: string;
  timezone: string;
  content: RegionContent;
}

export interface RegionContent {
  contact: ContactInfo;
  cases: string[];
  partners: string[];
}

export interface Solution {
  id: string;
  slug: string;
  title: string;
  description: string;
  features: string[];
  category: string;
  image: string;
  publishedAt: string;
}

export interface Case {
  id: string;
  slug: string;
  title: string;
  description: string;
  client: string;
  image: string;
  solutionIds: string[];
  publishedAt: string;
}

export interface News {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  category: string;
  image: string;
  publishedAt: string;
}
