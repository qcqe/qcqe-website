import React from 'react';
import { Helmet } from 'react-helmet-async';
import { MetaData } from '@seo/metaGenerator';

interface MetaHeadProps {
  meta: MetaData;
  siteName: string;
  locale?: string;
}

export const MetaHead: React.FC<MetaHeadProps> = ({
  meta,
  siteName,
  locale = 'zh-CN'
}) => {
  return (
    <Helmet>
      <html lang={locale} />
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <meta name="keywords" content={meta.keywords} />
      <link rel="canonical" href={meta.canonical} />
      <meta name="robots" content={meta.robots} />

      <meta property="og:type" content="website" />
      <meta property="og:title" content={meta.ogTitle} />
      <meta property="og:description" content={meta.ogDescription} />
      <meta property="og:image" content={meta.ogImage} />
      <meta property="og:url" content={meta.ogUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={locale} />

      <meta name="twitter:card" content={meta.twitterCard} />
      <meta name="twitter:title" content={meta.twitterTitle} />
      <meta name="twitter:description" content={meta.twitterDescription} />
      <meta name="twitter:image" content={meta.ogImage} />
    </Helmet>
  );
};
