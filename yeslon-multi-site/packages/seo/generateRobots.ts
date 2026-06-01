import { SiteConfig } from '@shared/types';

export class RobotsGenerator {
  private siteConfig: SiteConfig;

  constructor(siteConfig: SiteConfig) {
    this.siteConfig = siteConfig;
  }

  generate(): string {
    const baseUrl = this.siteConfig.subdomain
      ? `${this.siteConfig.subdomain}.${this.siteConfig.domain}`
      : this.siteConfig.domain;

    return `# robots.txt for ${baseUrl}
User-agent: *
Allow: /

# Sitemap
Sitemap: https://${baseUrl}/sitemap.xml

# Crawl-delay
Crawl-delay: 1

# Disallow unnecessary paths
Disallow: /api/
Disallow: /*.json$
Disallow: /admin/`;
  }
}
