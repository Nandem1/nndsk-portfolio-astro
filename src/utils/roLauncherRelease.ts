const GITHUB_REPO = 'https://github.com/Nandem1/nndsk-ro-launcher';
const CHECKSUM_FILE = 'RO-Launcher_amd64.AppImage.sha256' as const;

export const RO_LAUNCHER_RELEASE = {
  arch: 'amd64',
  format: 'AppImage',
  appImageFilePattern: 'RO-Launcher_*_amd64.AppImage',
  checksumFileName: CHECKSUM_FILE,
  checksumUrl: `${GITHUB_REPO}/releases/latest/download/${CHECKSUM_FILE}`,
  releasesUrl: `${GITHUB_REPO}/releases/latest`,
} as const;
