import type { CollectionEntry } from 'astro:content';
import { SITE_METADATA } from '@/utils/constants';

export function personId(): string {
  return `${SITE_METADATA.url}/#person`;
}

export function websiteId(): string {
  return `${SITE_METADATA.url}/#website`;
}

type SoftwareApplicationExtras = {
  applicationCategory?: string;
  url?: string;
  id?: string;
  description?: string;
  image?: string;
  operatingSystem?: string;
  alternateName?: string[];
  isPartOf?: { '@id': string };
  offers?: { '@type': 'Offer'; price: string; priceCurrency: string };
};

export function softwareApplicationJsonLd(
  project: CollectionEntry<'projects'>,
  extras?: SoftwareApplicationExtras
) {
  const url = extras?.url ?? project.data.link ?? project.data.github;
  const description = extras?.description ?? project.data.description;

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
    ...(extras?.alternateName && { alternateName: extras.alternateName }),
    ...(extras?.isPartOf && { isPartOf: extras.isPartOf }),
    ...(extras?.offers && { offers: extras.offers }),
    ...(project.data.stack &&
      project.data.stack.length > 0 && { keywords: project.data.stack.join(', ') }),
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
