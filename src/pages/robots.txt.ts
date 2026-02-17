import type { APIRoute } from "astro";

export const GET: APIRoute = ({ site }) => {
  const sitemapUrl = site ? `${site.origin}/sitemap.xml` : "/sitemap.xml";

  const robots = `# Robots.txt para ${site?.host || "mi-sitio.com"}
User-agent: *
Allow: /

# Sitemap
Sitemap: ${sitemapUrl}

# Reglas opcionales
# User-agent: *
# Disallow: /admin/
# Disallow: /private/
`;

  return new Response(robots, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=86400",
    },
  });
};
