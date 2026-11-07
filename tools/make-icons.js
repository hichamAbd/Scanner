// Draws the app icon and renders every size the app needs (home screens, favicon).
// Usage, from the repo root: node tools/make-icons.js .   (needs Playwright with Chromium)
const { chromium } = require('playwright');
const fs = require('fs');
const out = process.argv[2];

// rounded: rounded-square background (favicon / in-app); scale: shrink artwork (maskable safe zone)
function svg({ rounded = false, scale = 1 } = {}) {
  const bg = rounded ? '<rect width="1024" height="1024" rx="228" fill="url(#bg)"/>' : '<rect width="1024" height="1024" fill="url(#bg)"/>';
  const glow = rounded ? '<rect width="1024" height="1024" rx="228" fill="url(#hi)"/>' : '<rect width="1024" height="1024" fill="url(#hi)"/>';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#4f8cff"/>
      <stop offset="1" stop-color="#6a3ce8"/>
    </linearGradient>
    <radialGradient id="hi" cx="0.22" cy="0.12" r="0.75">
      <stop offset="0" stop-color="#ffffff" stop-opacity=".28"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="sweep" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#7ff0ff" stop-opacity="0"/>
      <stop offset="1" stop-color="#7ff0ff" stop-opacity=".35"/>
    </linearGradient>
    <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="22" stdDeviation="26" flood-color="#1b1060" flood-opacity=".35"/>
    </filter>
    <filter id="beamGlow" x="-20%" y="-400%" width="140%" height="900%">
      <feGaussianBlur stdDeviation="10"/>
    </filter>
    <clipPath id="page">
      <path d="M342 250H622L712 340V760Q712 790 682 790H342Q312 790 312 760V280Q312 250 342 250Z"/>
    </clipPath>
  </defs>
  ${bg}
  ${glow}
  <g transform="translate(512 520) scale(${scale}) translate(-512 -520)">
    <!-- the photographed page: tilted, faint -->
    <rect x="292" y="230" width="440" height="580" rx="34" fill="#fff" fill-opacity=".2" transform="rotate(-13 512 520)"/>
    <!-- the straightened page -->
    <g filter="url(#shadow)">
      <path d="M342 250H622L712 340V760Q712 790 682 790H342Q312 790 312 760V280Q312 250 342 250Z" fill="#fff"/>
    </g>
    <path d="M622 250V312Q622 340 650 340H712Z" fill="#d5ddf6"/>
    <g clip-path="url(#page)">
      <rect x="362" y="318" width="176" height="36" rx="18" fill="#4f8cff"/>
      <rect x="362" y="404" width="300" height="24" rx="12" fill="#cfd8ee"/>
      <rect x="362" y="462" width="250" height="24" rx="12" fill="#cfd8ee"/>
      <rect x="362" y="520" width="300" height="24" rx="12" fill="#cfd8ee"/>
      <rect x="362" y="578" width="210" height="24" rx="12" fill="#cfd8ee"/>
      <rect x="362" y="636" width="280" height="24" rx="12" fill="#cfd8ee"/>
      <rect x="362" y="694" width="160" height="24" rx="12" fill="#cfd8ee"/>
      <!-- area already scanned -->
      <rect x="300" y="250" width="420" height="300" fill="url(#sweep)"/>
    </g>
    <!-- scan line -->
    <rect x="236" y="544" width="552" height="14" rx="7" fill="#7ff0ff" filter="url(#beamGlow)"/>
    <rect x="236" y="546" width="552" height="10" rx="5" fill="#e8feff"/>
    <!-- viewfinder corners -->
    <g fill="none" stroke="#fff" stroke-width="36" stroke-linecap="round" stroke-linejoin="round">
      <path d="M232 300V196H336"/>
      <path d="M688 196H792V300"/>
      <path d="M792 740V844H688"/>
      <path d="M336 844H232V740"/>
    </g>
  </g>
</svg>`;
}

(async () => {
  fs.writeFileSync(`${out}/icon.svg`, svg({ rounded: true }));
  const b = await chromium.launch();
  const p = await b.newPage();
  const render = async (file, size, src, transparent) => {
    await p.setViewportSize({ width: size, height: size });
    await p.setContent(`<html><body style="margin:0;background:${transparent ? 'transparent' : '#000'}"><img src="data:image/svg+xml;base64,${Buffer.from(src).toString('base64')}" width="${size}" height="${size}" style="display:block"></body></html>`);
    await p.waitForTimeout(50);
    await p.screenshot({ path: `${out}/${file}`, omitBackground: !!transparent });
  };
  await render('apple-touch-icon.png', 180, svg());            // iPhone home screen (iOS rounds the corners)
  await render('icon-192.png', 192, svg({ rounded: true }), true);
  await render('icon-512.png', 512, svg({ rounded: true }), true);
  await render('icon-maskable-512.png', 512, svg({ scale: 0.8 })); // Android adaptive icons crop to any shape
  await render('favicon-32.png', 32, svg({ rounded: true }), true);
  await b.close();
})();
