export const AVATAR_URL = 'https://avatars.githubusercontent.com/u/103139553?v=4';

export const AUTHOR = {
  name: 'Nande',
  role: 'Fullstack Developer',
  email: 'nande@nndsk.dev',
  github: 'https://github.com/Nandem1',
  linkedin: 'https://www.linkedin.com/in/vicente-nandev/',
  instagram: 'https://www.instagram.com/nndsk._/',
  discord: 'nandem1',
};

export const NAV_LINKS = [
  { href: '/#bio', label: 'Bio' },
  { href: '/#work', label: 'Proyectos' },
  { href: '/#contact', label: 'Contacto' },
];

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

export const SITE_METADATA = {
  title: 'nndsk — Nande · Fullstack Developer',
  description:
    'Fullstack developer desde Chile. TypeScript, Go y Rust. ERP de Mercado House, EcoRetirosRM y herramientas open source.',
  url: 'https://nndsk.dev',
  locale: 'es_CL',
};
