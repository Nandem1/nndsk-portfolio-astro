export { renderers } from '../renderers.mjs';

const GET = ({ site }) => {
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
      "Cache-Control": "public, max-age=86400"
    }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
