import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const sitemapUrl = site ? `${site.origin}/sitemap-index.xml` : '/sitemap-index.xml';

  const robots = `# Robots.txt para nndsk.dev
User-agent: *
Allow: /

# Sitemap
Sitemap: ${sitemapUrl}
`;

  return new Response(robots, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400',
    },
  });
};
