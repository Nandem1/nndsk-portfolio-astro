import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();

  // Headers de seguridad (CSP vía meta http-equiv: astro.config.mjs security.csp)
  const securityHeaders = {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'X-XSS-Protection': '1; mode=block',
  };

  const newResponse = new Response(response.body, response);

  Object.entries(securityHeaders).forEach(([key, value]) => {
    newResponse.headers.set(key, value);
  });

  const url = new URL(context.request.url);
  if (
    url.pathname.match(
      /^\/(?:_astro|fonts)\/.*\.(css|js|png|jpg|jpeg|gif|ico|svg|webp|avif|woff|woff2)$/
    )
  ) {
    newResponse.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  } else if (url.pathname.match(/^\/scripts\/.*\.js$/)) {
    newResponse.headers.set('Cache-Control', 'public, max-age=3600, must-revalidate');
  } else if (url.pathname.match(/\.(html|xml|txt)$/)) {
    newResponse.headers.set('Cache-Control', 'public, max-age=3600');
  } else {
    newResponse.headers.set('Cache-Control', 'public, max-age=600');
  }

  return newResponse;
});
