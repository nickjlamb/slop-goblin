#!/usr/bin/env node
// slopify: run the goblin's translator from the terminal.
//
//   node examples/slopify.mjs "I'm thrilled to announce that we leverage synergies."
//   pbpaste | node examples/slopify.mjs
//   node examples/slopify.mjs --bites < post.txt       # list every bite and the bill
//
// No DOM needed: in Node the engine loads as a translator only.
import '../src/goblin.js';

const G = globalThis.SlopGoblin;
const args = process.argv.slice(2);
const showBites = args.includes('--bites');
const words = args.filter(a => a !== '--bites');

if (args.includes('--help') || args.includes('-h')) {
  console.log('usage: slopify [--bites] [text]   (reads stdin when no text is given)');
  process.exit(0);
}

const text = words.length ? words.join(' ') : await readStdin();
if (!text.trim()) {
  console.error('Nothing to eat. Pass some text, or pipe it in.');
  process.exit(1);
}

if (!showBites) {
  process.stdout.write(G.translate(text) + (text.endsWith('\n') ? '' : '\n'));
} else {
  const bites = G.bites(text);
  const servings = bites.reduce((n, b) => n + b.servings, 0);
  const width = Math.max(4, ...bites.map(b => b.text.length));
  for (const b of bites) console.log(`${b.text.padEnd(width)}  →  ${b.plain}   (+${b.servings})`);
  console.log(`\n${bites.length} bites · ${servings} servings · girth: ${G.girthFor(servings)}`);
}

async function readStdin() {
  if (process.stdin.isTTY) return '';
  let data = '';
  for await (const chunk of process.stdin) data += chunk;
  return data;
}
