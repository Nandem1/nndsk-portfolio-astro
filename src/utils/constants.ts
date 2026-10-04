import { IDENTITY } from '@/utils/identity';

export const SITE_METADATA = {
  title: `${IDENTITY.names.handle} — ${IDENTITY.names.brand} (${IDENTITY.names.professional}) · ${IDENTITY.jobTitle}`,
  description:
    'Portfolio de Nande (Vicente Aguirre), fullstack developer desde Chile. TypeScript, Go y Rust. ERP de Mercado House, EcoRetirosRM y herramientas open source.',
  url: IDENTITY.origin,
  locale: 'es_CL',
} as const;

export const NAV_LINKS = [
  { href: '/#bio', label: 'Bio' },
  { href: '/#work', label: 'Proyectos' },
  { href: '/#contact', label: 'Contacto' },
];
