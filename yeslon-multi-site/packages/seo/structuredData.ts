import { SiteConfig } from '@shared/types';

export interface OrganizationSchema {
  '@context': 'https://schema.org';
  '@type': 'Organization';
  name: string;
  url: string;
  logo: string;
  description: string;
  contactPoint: {
    '@type': 'ContactPoint';
    telephone: string;
    contactType: string;
    areaServed: string;
  };
}

export class StructuredDataGenerator {
  generateOrganizationSchema(config: SiteConfig): OrganizationSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: config.siteName,
      url: `https://${config.domain}`,
      logo: config.logo,
      description: config.description,
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: config.contact.phone,
        contactType: 'customer service',
        areaServed: 'CN'
      }
    };
  }

  generateWebSiteSchema(config: SiteConfig) {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: config.siteName,
      url: `https://${config.domain}`,
      description: config.description,
      potentialAction: {
        '@type': 'SearchAction',
        target: `https://${config.domain}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string'
      }
    };
  }

  generateBreadcrumbSchema(items: Array<{name: string; url: string}>) {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url
      }))
    };
  }
}
