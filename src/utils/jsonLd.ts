import type { CollectionEntry } from 'astro:content';
import { SITE_METADATA } from '@/utils/constants';
import {
  IDENTITY,
  alternateNames,
  emailMailto,
  sameAsUrls,
  type HttpsUrl,
  type IdentityOrigin,
  type JobTitle,
  type LegalName,
  type MailtoHref,
} from '@/utils/identity';

export function personId(): string {
  return `${SITE_METADATA.url}/#person`;
}

export function websiteId(): string {
  return `${SITE_METADATA.url}/#website`;
}

export type PersonJsonLd = {
  '@context': 'https://schema.org';
  '@type': 'Person';
  '@id': string;
  name: LegalName;
  alternateName: ReturnType<typeof alternateNames>;
  jobTitle: JobTitle;
  url: IdentityOrigin;
  image: HttpsUrl;
  email: MailtoHref;
  sameAs: ReturnType<typeof sameAsUrls>;
};

export type WebSiteJsonLd = {
  '@context': 'https://schema.org';
  '@type': 'WebSite';
  '@id': string;
  url: IdentityOrigin;
  name: typeof IDENTITY.names.handle;
  inLanguage: 'es-CL';
  publisher: { '@id': string };
};

export function personJsonLd(): PersonJsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': personId(),
    name: IDENTITY.names.legal,
    alternateName: alternateNames(),
    jobTitle: IDENTITY.jobTitle,
    url: SITE_METADATA.url,
    image: IDENTITY.image,
    email: emailMailto(),
    sameAs: sameAsUrls(),
  };
}

export function webSiteJsonLd(): WebSiteJsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': websiteId(),
    url: SITE_METADATA.url,
    name: IDENTITY.names.handle,
    inLanguage: 'es-CL',
    publisher: { '@id': personId() },
  };
}

export function personWebSiteJsonLd(): readonly [PersonJsonLd, WebSiteJsonLd] {
  return [personJsonLd(), webSiteJsonLd()];
}

type SoftwareApplicationExtras = {
  applicationCategory?: string;
  url?: string;
  id?: string;
  description?: string;
  image?: string;
  operatingSystem?: string;
  softwareVersion?: string;
  downloadUrl?: string;
  alternateName?: string[];
  keywords?: string[];
  isPartOf?: { '@id': string };
  offers?: { '@type': 'Offer'; price: string; priceCurrency: string };
};

export function softwareApplicationJsonLd(
  project: CollectionEntry<'projects'>,
  extras?: SoftwareApplicationExtras
) {
  const url = extras?.url ?? project.data.link ?? project.data.github;
  const description = extras?.description ?? project.data.description;
  const keywords =
    extras?.keywords && extras.keywords.length > 0
      ? extras.keywords.join(', ')
      : project.data.stack && project.data.stack.length > 0
        ? project.data.stack.join(', ')
        : undefined;

  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    ...(extras?.id && { '@id': extras.id }),
    name: project.data.title,
    description,
    ...(url && { url }),
    ...(project.data.github && {
      sameAs: [project.data.github],
    }),
    ...(extras?.image && { image: extras.image, screenshot: extras.image }),
    ...(extras?.operatingSystem && { operatingSystem: extras.operatingSystem }),
    ...(extras?.softwareVersion && { softwareVersion: extras.softwareVersion }),
    ...(extras?.downloadUrl && { downloadUrl: extras.downloadUrl }),
    ...(extras?.alternateName && { alternateName: extras.alternateName }),
    ...(extras?.isPartOf && { isPartOf: extras.isPartOf }),
    ...(extras?.offers && { offers: extras.offers }),
    ...(keywords && { keywords }),
    ...(project.data.year && { dateCreated: `${project.data.year}-01-01` }),
    applicationCategory: extras?.applicationCategory ?? 'DeveloperApplication',
    author: { '@id': personId() },
  };
}

export function breadcrumbListJsonLd(id: string, items: { name: string; item: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    '@id': id,
    itemListElement: items.map((entry, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: entry.name,
      item: entry.item,
    })),
  };
}

export function faqPageJsonLd(id: string, faqs: { question: string; answer: string }[]) {
  return {
    '@type': 'FAQPage',
    '@id': id,
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}
