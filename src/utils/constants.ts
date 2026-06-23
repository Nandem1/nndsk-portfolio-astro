/**
 * Constantes compartidas del proyecto
 */

// Avatar del desarrollador
export const AVATAR_URL = 'https://avatars.githubusercontent.com/u/103139553?v=4';

// Información del autor
export const AUTHOR = {
  name: 'Nande',
  role: 'Fullstack Developer',
  email: 'vicenteignacioac22@gmail.com',
  github: 'https://github.com/Nandem1',
  linkedin: 'https://www.linkedin.com/in/vicente-nandev/',
};

// Enlaces de navegación
export const NAV_LINKS = [{ href: '/', label: 'Inicio' }];

// Enlaces sociales
export const SOCIAL_LINKS = [
  {
    name: 'GitHub',
    url: AUTHOR.github,
    icon: 'GitHubIcon' as const,
  },
  {
    name: 'LinkedIn',
    url: AUTHOR.linkedin,
    icon: 'LinkedInIcon' as const,
  },
  {
    name: 'Email',
    url: `mailto:${AUTHOR.email}`,
    icon: 'EmailIcon' as const,
  },
] as const;

// Metadata del sitio
export const SITE_METADATA = {
  title: 'Nande - Desarrollador Pragmático',
  description: 'Portfolio de Nande. Fullstack dev, TypeScript, Go y Rust.',
  url: 'https://nande.dev',
  locale: 'es_ES',
};

// Configuración de estilos
export const THEME_COLORS = {
  background: '#0a0f1c',
  foreground: '#e0e0e0',
  accent: '#81a1c1',
  muted: '#616e88',
  card: '#111827',
  border: '#1e293b',
};
