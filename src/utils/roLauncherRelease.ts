const GITHUB_REPO = 'https://github.com/Nandem1/nndsk-ro-launcher';
const VERSION = '0.1.1' as const;
const TAG = `v${VERSION}` as const;
const APP_IMAGE_FILE = `RO-Launcher_${VERSION}_amd64.AppImage` as const;
const CHECKSUM_FILE = 'RO-Launcher_amd64.AppImage.sha256' as const;

export const RO_LAUNCHER_RELEASE = {
  version: VERSION,
  tag: TAG,
  arch: 'amd64',
  format: 'AppImage',
  appImageFileName: APP_IMAGE_FILE,
  checksumFileName: CHECKSUM_FILE,
  downloadUrl: `${GITHUB_REPO}/releases/download/${TAG}/${APP_IMAGE_FILE}`,
  checksumUrl: `${GITHUB_REPO}/releases/download/${TAG}/${CHECKSUM_FILE}`,
  releasesUrl: `${GITHUB_REPO}/releases/latest`,
} as const;
