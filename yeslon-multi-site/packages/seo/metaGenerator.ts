import { SiteConfig, PageConfig } from '@shared/types';

export interface MetaData {
  title: string;
  description: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogUrl: string;
  twitterCard: string;
  twitterTitle: string;
  twitterDescription: string;
  canonical: string;
  robots: string;
}

export class MetaGenerator {
  private siteConfig: SiteConfig;

  constructor(siteConfig: SiteConfig) {
    this.siteConfig = siteConfig;
  }

  generate(page: PageConfig): MetaData {
    const { seo } = this.siteConfig;
    const { path, title, description, keywords, ogImage } = page;

    const fullTitle = seo.titleTemplate
      .replace('{siteName}', this.siteConfig.siteName)
      .replace('{pageTitle}', title);

    const fullDescription = description || seo.description;
    const pageKeywords = keywords?.join(', ') || seo.keywords.join(', ');
    const pageOgImage = ogImage || seo.ogImage;

    return {
      title: fullTitle,
      description: fullDescription,
      keywords: pageKeywords,
      ogTitle: fullTitle,
      ogDescription: fullDescription,
      ogImage: pageOgImage,
      ogUrl: this.buildUrl(path),
      twitterCard: seo.twitterCard,
      twitterTitle: fullTitle,
      twitterDescription: fullDescription,
      canonical: this.buildUrl(path),
      robots: seo.noIndex ? 'noindex, nofollow' : 'index, follow'
    };
  }

  private buildUrl(path: string): string {
    const protocol = 'https';
    const domain = this.siteConfig.subdomain
      ? `${this.siteConfig.subdomain}.${this.siteConfig.domain}`
      : this.siteConfig.domain;
    return `${protocol}://${domain}/${path}`;
  }
}
