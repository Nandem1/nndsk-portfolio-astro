import type { CollectionEntry } from 'astro:content';
import { SITE_METADATA } from '@/utils/constants';

export function personId(): string {
  return `${SITE_METADATA.url}/#person`;
}

export function softwareApplicationJsonLd(
  project: CollectionEntry<'projects'>,
  extras?: { applicationCategory?: string; url?: string }
) {
  const url = extras?.url ?? project.data.link ?? project.data.github;
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: project.data.title,
    description: project.data.description,
    ...(url && { url }),
    ...(project.data.github && {
      sameAs: [project.data.github],
      codeRepository: project.data.github,
    }),
    ...(project.data.stack &&
      project.data.stack.length > 0 && { keywords: project.data.stack.join(', ') }),
    ...(project.data.year && { dateCreated: `${project.data.year}-01-01` }),
    applicationCategory: extras?.applicationCategory ?? 'DeveloperApplication',
    author: { '@id': personId() },
  };
}
