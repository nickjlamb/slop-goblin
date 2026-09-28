// Builds index.html (the site GitHub Pages serves) from src/page.html and src/goblin.js.
// Run from the repo root:  npm install && npm run build
import { readFileSync, writeFileSync } from 'node:fs';
import { minify } from 'terser';

const SITE = 'https://slopgoblin.pharmatools.ai/';
const DESC = 'A goblin that eats LinkedIn buzzwords, gets fatter with every bite and spits the plain-English version back into the post. A free bookmarklet; nothing leaves your browser.';
const SHORT = 'He eats LinkedIn buzzwords and spits out plain English. “I’m thrilled to announce that” → “News:”';

const src = readFileSync('src/goblin.js', 'utf8');
const min = await minify(src, { compress: { passes: 2 }, mangle: true, format: { comments: false } });

// Bookmarklet: only characters a URL would mangle are percent-encoded, which keeps it well under
// Firefox's bookmark length limit.
const enc = s => s.replace(/[%#\s]|[^\x20-\x7e]/g, c => encodeURIComponent(c));
const bookmarklet = 'javascript:' + enc(min.code + ';void 0');

let page = readFileSync('src/page.html', 'utf8');
page = page.replace('/*__GOBLIN__*/', () => min.code);
page = page.replace('"__BOOKMARKLET__"', () => JSON.stringify(bookmarklet));

const [headPart, bodyPart] = page.split('<div class="page">');
const head = headPart
  .replace(/<title>[\s\S]*?<\/title>\n?/, '')
  .replace(/<link rel="icon"[^>]*>\n?/, '')
  // fonts are self-hosted on the site (fonts/), so the page makes no third-party requests
  .replace(/<link rel="preconnect"[^>]*>\n?/g, '')
  .replace(/<link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com[^>]*>\n?/, '<link rel="stylesheet" href="fonts/fonts.css">\n');

const meta = `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>The Slop Goblin</title>
<meta name="description" content="${DESC}">
<link rel="canonical" href="${SITE}">
<meta property="og:type" content="website">
<meta property="og:url" content="${SITE}">
<meta property="og:site_name" content="The Slop Goblin">
<meta property="og:title" content="The Slop Goblin">
<meta property="og:description" content="${SHORT}">
<meta property="og:image" content="${SITE}og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="The Slop Goblin, before and after a week on LinkedIn, next to buzzwords translated into plain English">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="The Slop Goblin">
<meta name="twitter:description" content="${SHORT}">
<meta name="twitter:image" content="${SITE}og-image.png">
<link rel="icon" type="image/svg+xml" href="favicon.svg">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
<meta name="theme-color" content="#E8ECE2">
<style>html{color-scheme:light}body{margin:0;-webkit-text-size-adjust:100%}img{max-width:100%}[hidden]{display:none!important}</style>`;

const html = `<!doctype html>
<html lang="en-GB">
<head>
${meta}
${head.trim()}
</head>
<body>
<div class="page">${bodyPart}</body>
</html>
`;
writeFileSync('index.html', html);
writeFileSync('bookmarklet.txt', bookmarklet + '\n');
console.log(`index.html ${html.length} bytes; bookmarklet ${bookmarklet.length} chars`);
