// Builds everything the site and the release serve from the two source files:
//
//   src/goblin.js + src/page.html  ->  index.html            the site GitHub Pages serves
//                                  ->  dist/goblin.min.js    for embedding on your own page
//                                  ->  dist/bookmarklet.txt  the javascript: URL behind the green button
//
// It also refreshes the counts quoted in README.md and CONTRIBUTING.md (phrases, words, bookmarklet size),
// so the docs can't drift from the code. CI runs the build and fails if anything it writes has changed.
//
//   npm run build
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';
import { minify } from 'terser';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const at = p => join(ROOT, p);

const SITE = 'https://slopgoblin.pharmatools.ai/';
const REPO = 'https://github.com/nickjlamb/slop-goblin';
const DESC = 'A goblin that eats LinkedIn buzzwords, gets fatter with every bite and spits the plain-English version back into the post. A free bookmarklet; nothing leaves your browser.';
const SHORT = 'He eats LinkedIn buzzwords and spits out plain English. “I’m thrilled to announce that” → “News:”';

// Firefox and Chrome both cope with longer bookmarks, but staying under 64 KiB keeps every browser happy.
export const BOOKMARKLET_BUDGET = 65536;

// Only characters a URL would mangle are percent-encoded, which keeps the bookmarklet compact.
const encode = s => s.replace(/[%#\s]|[^\x20-\x7e]/g, c => encodeURIComponent(c));

export async function build() {
  const pkg = JSON.parse(readFileSync(at('package.json'), 'utf8'));
  const src = readFileSync(at('src/goblin.js'), 'utf8');
  const min = await minify(src, { compress: { passes: 2 }, mangle: true, format: { comments: false } });
  const code = min.code;

  const bookmarklet = 'javascript:' + encode(code + ';void 0');
  const banner = `/*! The Slop Goblin v${pkg.version} | MIT | ${REPO} */\n`;

  // The menu, counted by the engine itself (in Node it loads as a translator only).
  await import(pathToFileURL(at('src/goblin.js')).href);
  const G = globalThis.SlopGoblin;
  const counts = { phrases: G.phraseCount, words: G.menuSize, kb: Math.round(bookmarklet.length / 1024), version: pkg.version };

  let page = readFileSync(at('src/page.html'), 'utf8');
  page = page.replace('/*__GOBLIN__*/', () => code);
  page = page.replace('"__BOOKMARKLET__"', () => JSON.stringify(bookmarklet));
  page = page.replaceAll('__VERSION__', pkg.version);

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
<meta name="generator" content="slop-goblin ${pkg.version}">
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

  const docs = {};
  for (const f of ['README.md', 'CONTRIBUTING.md']) {
    if (existsSync(at(f))) docs[f] = syncCounts(readFileSync(at(f), 'utf8'), counts);
  }

  return {
    counts,
    files: {
      'index.html': html,
      'dist/goblin.min.js': banner + code + '\n',
      'dist/bookmarklet.txt': bookmarklet + '\n',
      ...docs
    }
  };
}

/* <!--phrases-->232<!--/phrases--> style markers, plus the menu and size badges between badge markers. */
export function syncCounts(text, c) {
  const put = (t, key, value) => t.replace(new RegExp(`(<!--${key}-->)[^<]*(<!--/${key}-->)`, 'g'), `$1${value}$2`);
  let out = text;
  for (const k of ['phrases', 'words', 'kb', 'version']) out = put(out, k, c[k]);
  const menu = `https://img.shields.io/badge/menu-${c.phrases}%20phrases%20%C2%B7%20${c.words}%20words-4b762a`;
  const size = `https://img.shields.io/badge/bookmarklet-${c.kb}%20KB-4b762a`;
  out = out.replace(/(<!--badge:menu-->)[\s\S]*?(<!--\/badge:menu-->)/g, `$1<img alt="Menu: ${c.phrases} phrases and ${c.words} words" src="${menu}">$2`);
  out = out.replace(/(<!--badge:size-->)[\s\S]*?(<!--\/badge:size-->)/g, `$1<img alt="Bookmarklet size: ${c.kb} KB" src="${size}">$2`);
  return out;
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
  const { files, counts } = await build();
  mkdirSync(at('dist'), { recursive: true });
  for (const [name, body] of Object.entries(files)) writeFileSync(at(name), body);
  const bm = files['dist/bookmarklet.txt'].length - 1;
  console.log(`built v${counts.version}: ${counts.phrases} phrases, ${counts.words} words; ` +
    `index.html ${files['index.html'].length} bytes; bookmarklet ${bm} chars (budget ${BOOKMARKLET_BUDGET})`);
  if (bm > BOOKMARKLET_BUDGET) { console.error('bookmarklet is over budget'); process.exit(1); }
}
