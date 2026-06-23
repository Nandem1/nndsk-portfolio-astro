/**
 * Constantes compartidas del proyecto
 */

// Avatar del desarrollador
export const AVATAR_URL = 'https://avatars.githubusercontent.com/u/103139553?v=4';

// Información del autor
export const AUTHOR = {
  name: 'Nande',
  role: 'Fullstack Developer',
  email: 'nande@nndsk.dev',
  github: 'https://github.com/Nandem1',
  linkedin: 'https://www.linkedin.com/in/vicente-nandev/',
  instagram: 'https://www.instagram.com/nndsk._/',
  discord: 'nandem1',
};

// Enlaces de navegación
export const NAV_LINKS = [
  { href: '/#bio', label: 'Bio' },
  { href: '/#work', label: 'Proyectos' },
  { href: '/#contact', label: 'Contacto' },
];

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
    name: 'Instagram',
    url: AUTHOR.instagram,
    icon: 'InstagramIcon' as const,
  },
  {
    name: 'Email',
    url: `mailto:${AUTHOR.email}`,
    icon: 'EmailIcon' as const,
  },
] as const;

// Metadata del sitio
export const SITE_METADATA = {
  title: 'nndsk — Nande · Fullstack Developer',
  description:
    'Fullstack developer desde Chile. Trabajo con TypeScript, Go y Rust construyendo ERPs, herramientas open source y productos web.',
  url: 'https://nndsk.dev',
  locale: 'es_CL',
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
