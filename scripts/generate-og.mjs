import sharp from 'sharp';
import { writeFileSync } from 'fs';

const nPath = 'M18 44V20h4.5l15 16.5V20H42v24h-4.5L22.5 27.5V44H18z';
const bigScale = 280 / 64;
const smallScale = 44 / 64;

const svg = `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#0a0f1c"/>

  <rect x="80" y="0" width="240" height="3" fill="#81a1c1" rx="1.5"/>

  <g transform="translate(820, 175)" opacity="0.25">
    <rect width="280" height="280" rx="60" fill="#111827"/>
    <g transform="scale(${bigScale})">
      <path d="${nPath}" fill="#81a1c1"/>
    </g>
  </g>

  <text x="80" y="280"
        font-family="'Helvetica Neue', Helvetica, Arial, sans-serif"
        font-size="96" font-weight="700" fill="#e0e0e0">Nande</text>

  <text x="80" y="340"
        font-family="'Helvetica Neue', Helvetica, Arial, sans-serif"
        font-size="38" font-weight="400" fill="#81a1c1">Fullstack Developer</text>

  <rect x="80" y="372" width="260" height="2" fill="#1e293b" rx="1"/>

  <text x="80" y="416"
        font-family="'Helvetica Neue', Helvetica, Arial, sans-serif"
        font-size="26" font-weight="400" fill="#7f8da3">TypeScript · Go · Rust</text>

  <g transform="translate(80, 524)">
    <rect width="44" height="44" rx="10" fill="#111827"/>
    <g transform="scale(${smallScale})">
      <path d="${nPath}" fill="#81a1c1"/>
    </g>
  </g>
  <text x="136" y="553"
        font-family="'Helvetica Neue', Helvetica, Arial, sans-serif"
        font-size="20" font-weight="400" fill="#7f8da3">nndsk.dev</text>
</svg>`;

const buffer = await sharp(Buffer.from(svg)).png().toBuffer();
writeFileSync('public/og.png', buffer);
console.log('✓ public/og.png generado');
