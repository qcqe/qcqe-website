import { SiteConfig, PageConfig } from '@shared/types';

export interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

export class SitemapGenerator {
  private siteConfig: SiteConfig;

  constructor(siteConfig: SiteConfig) {
    this.siteConfig = siteConfig;
  }

  generate(pages: PageConfig[]): string {
    const urls = pages.map(page => this.mapPage(page));

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    return sitemap;
  }

  private mapPage(page: PageConfig): SitemapUrl {
    return {
      loc: this.buildUrl(page.path),
      lastmod: page.lastModified || new Date().toISOString().split('T')[0],
      changefreq: page.changeFreq || 'weekly',
      priority: page.priority || 0.8
    };
  }

  private buildUrl(path: string): string {
    const domain = this.siteConfig.subdomain
      ? `${this.siteConfig.subdomain}.${this.siteConfig.domain}`
      : this.siteConfig.domain;
    return `https://${domain}/${path}`;
  }
}
