import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();

  // Headers de seguridad
  const securityHeaders = {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'X-XSS-Protection': '1; mode=block',
  };

  // Content Security Policy para sitio estático
  const csp = [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https://avatars.githubusercontent.com https://images.unsplash.com",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ');

  // Crear nueva respuesta con headers
  const newResponse = new Response(response.body, response);

  // Añadir headers de seguridad
  Object.entries(securityHeaders).forEach(([key, value]) => {
    newResponse.headers.set(key, value);
  });

  // Añadir CSP
  newResponse.headers.set('Content-Security-Policy', csp);

  // Headers de cache para assets estáticos
  const url = new URL(context.request.url);
  if (url.pathname.match(/\.(css|js|png|jpg|jpeg|gif|ico|svg|webp|avif)$/)) {
    newResponse.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  } else if (url.pathname.match(/\.(html|xml|txt)$/)) {
    newResponse.headers.set('Cache-Control', 'public, max-age=3600');
  } else {
    newResponse.headers.set('Cache-Control', 'public, max-age=600');
  }

  return newResponse;
});
