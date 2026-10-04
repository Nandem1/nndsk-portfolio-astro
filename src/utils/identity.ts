export type IdentityOrigin = 'https://nndsk.dev';

export type LegalName = 'Vicente Ignacio Aguirre Caroca';
export type ProfessionalName = 'Vicente Aguirre';
export type BrandName = 'Nande';
export type SiteHandle = 'nndsk';
export type JobTitle = 'Fullstack Developer';
export type SiteEmail = 'nande@nndsk.dev';
export type MailtoHref = `mailto:${SiteEmail}`;
export type HttpsUrl = `https://${string}`;

export type NonUrlHandle<S extends string> = S extends
  `http://${string}` | `https://${string}` | `mailto:${string}` | `${string}/${string}`
  ? never
  : S;

export type DiscordHandle = NonUrlHandle<'nandem1'>;

export type ChannelId = 'github' | 'linkedin' | 'instagram' | 'email' | 'discord';
export type SocialIconName =
  'GitHubIcon' | 'LinkedInIcon' | 'InstagramIcon' | 'EmailIcon' | 'DiscordIcon';

export type ProfileChannel = {
  kind: 'profile';
  id: Extract<ChannelId, 'github' | 'linkedin' | 'instagram'>;
  label: string;
  href: HttpsUrl;
  icon: Exclude<SocialIconName, 'EmailIcon' | 'DiscordIcon'>;
};

export type EmailChannel = {
  kind: 'email';
  id: 'email';
  label: string;
  address: SiteEmail;
  icon: 'EmailIcon';
};

export type HandleChannel = {
  kind: 'handle';
  id: 'discord';
  label: string;
  handle: DiscordHandle;
  icon: 'DiscordIcon';
};

export type IdentityChannel = ProfileChannel | EmailChannel | HandleChannel;

export type IdentityNames = {
  legal: LegalName;
  professional: ProfessionalName;
  brand: BrandName;
  handle: SiteHandle;
  aliases: readonly ['Nandem1'];
};

export type Identity = {
  origin: IdentityOrigin;
  names: IdentityNames;
  jobTitle: JobTitle;
  image: HttpsUrl;
  skills: readonly ['TypeScript', 'Go', 'Rust'];
  channels: readonly [ProfileChannel, ProfileChannel, ProfileChannel, EmailChannel, HandleChannel];
};

export const IDENTITY = {
  origin: 'https://nndsk.dev',
  names: {
    legal: 'Vicente Ignacio Aguirre Caroca',
    professional: 'Vicente Aguirre',
    brand: 'Nande',
    handle: 'nndsk',
    aliases: ['Nandem1'],
  },
  jobTitle: 'Fullstack Developer',
  image: 'https://avatars.githubusercontent.com/u/103139553?v=4',
  skills: ['TypeScript', 'Go', 'Rust'],
  channels: [
    {
      kind: 'profile',
      id: 'github',
      label: 'GitHub',
      href: 'https://github.com/Nandem1',
      icon: 'GitHubIcon',
    },
    {
      kind: 'profile',
      id: 'linkedin',
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/vicente-nandev/',
      icon: 'LinkedInIcon',
    },
    {
      kind: 'profile',
      id: 'instagram',
      label: 'Instagram',
      href: 'https://www.instagram.com/nndsk._/',
      icon: 'InstagramIcon',
    },
    {
      kind: 'email',
      id: 'email',
      label: 'Email',
      address: 'nande@nndsk.dev',
      icon: 'EmailIcon',
    },
    {
      kind: 'handle',
      id: 'discord',
      label: 'Discord',
      handle: 'nandem1',
      icon: 'DiscordIcon',
    },
  ],
} as const satisfies Identity;

export const AUTHOR_META: `${LegalName} (${BrandName})` = `${IDENTITY.names.legal} (${IDENTITY.names.brand})`;

export type AnchorRel = 'me noopener noreferrer';

export type SocialAnchor = {
  kind: 'anchor';
  id: ProfileChannel['id'] | 'email';
  label: string;
  href: HttpsUrl | MailtoHref;
  rel: AnchorRel;
  icon: Exclude<SocialIconName, 'DiscordIcon'>;
};

export type SocialCopy = {
  kind: 'copy';
  id: 'discord';
  label: string;
  handle: DiscordHandle;
  icon: 'DiscordIcon';
};

export type SocialSurfaceItem = SocialAnchor | SocialCopy;

function mailtoHref(channel: EmailChannel): MailtoHref {
  return `mailto:${channel.address}`;
}

export function emailMailto(): MailtoHref {
  for (const channel of IDENTITY.channels) {
    if (channel.kind === 'email') {
      return mailtoHref(channel);
    }
  }
  return mailtoHref(IDENTITY.channels[3]);
}

function channelHrefForRelMe(channel: IdentityChannel): HttpsUrl | MailtoHref | undefined {
  switch (channel.kind) {
    case 'profile':
      return channel.href;
    case 'email':
      return mailtoHref(channel);
    case 'handle':
      return undefined;
    default: {
      const _never: never = channel;
      return _never;
    }
  }
}

export function sameAsUrls(): readonly HttpsUrl[] {
  return IDENTITY.channels.flatMap(channel => (channel.kind === 'profile' ? [channel.href] : []));
}

export function relMeHrefs(): readonly (HttpsUrl | MailtoHref)[] {
  return IDENTITY.channels.flatMap(channel => {
    const href = channelHrefForRelMe(channel);
    return href === undefined ? [] : [href];
  });
}

export function socialSurface(): readonly SocialSurfaceItem[] {
  return IDENTITY.channels.map((channel): SocialSurfaceItem => {
    switch (channel.kind) {
      case 'profile':
        return {
          kind: 'anchor',
          id: channel.id,
          label: channel.label,
          href: channel.href,
          rel: 'me noopener noreferrer',
          icon: channel.icon,
        };
      case 'email':
        return {
          kind: 'anchor',
          id: channel.id,
          label: channel.label,
          href: mailtoHref(channel),
          rel: 'me noopener noreferrer',
          icon: channel.icon,
        };
      case 'handle':
        return {
          kind: 'copy',
          id: channel.id,
          label: channel.label,
          handle: channel.handle,
          icon: channel.icon,
        };
      default: {
        const _never: never = channel;
        return _never;
      }
    }
  });
}

export function alternateNames(): readonly [
  ProfessionalName,
  BrandName,
  ...typeof IDENTITY.names.aliases,
  SiteHandle,
] {
  return [
    IDENTITY.names.professional,
    IDENTITY.names.brand,
    ...IDENTITY.names.aliases,
    IDENTITY.names.handle,
  ];
}
