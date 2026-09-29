#!/usr/bin/env python3
"""Draws docs/architecture-light.svg and docs/architecture-dark.svg.

The README shows whichever matches the reader's GitHub theme via <picture>.
Colours are GitHub's own (Primer) so the diagram sits naturally on the page.

    python3 docs/gen_diagram.py      (or: npm run diagram)
"""
from pathlib import Path
from html import escape

W, H = 1000, 640
SANS = '-apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, &quot;Noto Sans&quot;, Helvetica, Arial, sans-serif'
MONO = 'ui-monospace, SFMono-Regular, &quot;SF Mono&quot;, Menlo, Consolas, &quot;Liberation Mono&quot;, monospace'

THEMES = {
    'light': dict(fg='#1f2328', muted='#59636e', border='#d1d9e0', box='#f6f8fa', panel='#ffffff',
                  build='#0969da', build_bg='#ddf4ff', run='#1a7f37', run_bg='#dafbe1', warn='#9a6700',
                  skin='#86ad5e', skin_line='#34501f'),
    'dark': dict(fg='#f0f6fc', muted='#9198a1', border='#3d444d', box='#151b23', panel='#0d1117',
                 build='#4493f8', build_bg='#0c2d6b', run='#3fb950', run_bg='#033a16', warn='#d29922',
                 skin='#86ad5e', skin_line='#34501f'),
}


def diagram(t):
    out = []
    add = out.append

    def text(x, y, s, size=13, fill=None, weight=400, family=SANS, anchor='start'):
        add(f'<text x="{x}" y="{y}" font-family="{family}" font-size="{size}" font-weight="{weight}" '
            f'fill="{fill or t["fg"]}" text-anchor="{anchor}">{escape(s)}</text>')

    def box(x, y, w, h, title, lines=(), mono=False, accent=None, fill=None):
        add(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="8" fill="{fill or t["box"]}" '
            f'stroke="{accent or t["border"]}" stroke-width="{1.5 if accent else 1}"/>')
        text(x + 12, y + 22, title, 13.5, weight=600, family=MONO if mono else SANS)
        for i, line in enumerate(lines):
            text(x + 12, y + 41 + i * 16, line, 11.5, fill=t['muted'])

    def arrow(points, color=None, dashed=False, label=None, label_at=None):
        c = color or t['muted']
        d = 'M' + ' L'.join(f'{x} {y}' for x, y in points)
        dash = ' stroke-dasharray="4 4"' if dashed else ''
        add(f'<path d="{d}" fill="none" stroke="{c}" stroke-width="1.5"{dash} marker-end="url(#head-{id(c)})"/>')
        markers.add(c)
        if label:
            lx, ly = label_at
            text(lx, ly, label, 11, fill=t['muted'])

    markers = set()

    # ---------- build column ----------
    add(f'<rect x="16" y="16" width="290" height="{H - 32}" rx="12" fill="{t["panel"]}" stroke="{t["border"]}"/>')
    text(32, 44, 'BUILD', 12, fill=t['build'], weight=700)
    text(84, 44, 'npm run build', 12, fill=t['muted'], family=MONO)

    box(32, 60, 258, 58, 'src/goblin.js', ['the goblin, translator and bill'], mono=True)
    box(32, 128, 258, 58, 'src/page.html', ['the site and practice feed'], mono=True)
    arrow([(161, 186), (161, 214)])
    box(32, 216, 258, 74, 'src/build.mjs', ['minifies with terser', 'syncs counts in the README'],
        mono=True, accent=t['build'], fill=t['build_bg'])
    for i, (name, note) in enumerate([('index.html', 'the site, on GitHub Pages'),
                                      ('dist/bookmarklet.txt', 'the green button'),
                                      ('dist/goblin.min.js', 'embed it, or load it from a CDN')]):
        y = 326 + i * 70
        arrow([(161, 290), (161, 306), (40, 306), (40, y + 29), (54, y + 29)])
        box(56, y, 234, 58, name, [note], mono=True)

    text(32, 562, 'CI on every push', 12, weight=600)
    for i, line in enumerate(['build output is committed', 'unit tests: translator and docs',
                              'smoke test: Chromium, Firefox, WebKit']):
        text(32, 580 + i * 16, '✓ ' + line, 11.5, fill=t['muted'])

    # bookmarklet -> bookmark click
    arrow([(290, 425), (322, 425), (322, 87), (344, 87)], color=t['build'])

    # ---------- runtime container ----------
    add(f'<rect x="330" y="16" width="{W - 346}" height="{H - 32}" rx="12" fill="{t["panel"]}" '
        f'stroke="{t["run"]}" stroke-width="1.5" stroke-dasharray="6 5"/>')
    text(346, 44, 'IN YOUR BROWSER TAB', 12, fill=t['run'], weight=700)
    text(W - 32, 44, 'no network requests', 12, fill=t['run'], weight=600, anchor='end')

    box(346, 60, 170, 56, 'Click the bookmark', ['or press Release on the site'])
    arrow([(516, 88), (544, 88)])
    box(546, 60, 222, 56, 'SlopGoblin() starts', ['draws him and his HUD'], accent=t['run'], fill=t['run_bg'])
    goblin_head(add, 738, 88, 0.42)

    # the eating loop
    loop = [
        ('1  Hunt', ['visible text only', 'phrases first, then words']),
        ('2  Walk', ['waddles to the bite', 'slower as he fattens']),
        ('3  Eat', ['letters fly into his mouth', '1–3 servings each']),
        ('4  Translate', ['plain English spat back', 'original shown on hover']),
    ]
    lx, ly, lw, lh, gap = 346, 176, 142, 76, 18
    for i, (title, lines) in enumerate(loop):
        x = lx + i * (lw + gap)
        box(x, ly, lw, lh, title, lines, accent=t['run'] if i in (0, 3) else None)
        if i:
            arrow([(x - gap, ly + lh / 2), (x - 2, ly + lh / 2)])
    arrow([(657, 116), (657, 136), (417, 136), (417, 174)])
    last_x = lx + 3 * (lw + gap) + lw / 2
    arrow([(last_x, ly), (last_x, 156), (lx + lw / 2 + 14, 156), (lx + lw / 2 + 14, ly - 2)], label='next bite',
          label_at=(700, 151))

    # when the screen is clean
    sy = 300
    arrow([(417, ly + lh), (417, sy - 2)], label='screen clean?', label_at=(425, 283))
    box(346, sy, 196, 58, 'Open “… more”', ['if slop is hiding in the post'])
    box(556, sy, 196, 58, 'Scroll on', ['after a pause to admire his work'])
    arrow([(542, sy + 29), (554, sy + 29)])
    box(766, sy, 156, 58, 'Esc: the bill', ['a receipt to save as PNG'], accent=t['warn'])

    # the page he works on
    py = 420
    add(f'<rect x="346" y="{py}" width="{W - 392}" height="92" rx="8" fill="{t["box"]}" stroke="{t["border"]}"/>')
    text(362, py + 24, 'The page you’re on', 13.5, weight=600)
    text(362, py + 44, 'LinkedIn, or any page: its text, its “… more” buttons, its scrolling feed.', 11.5, fill=t['muted'])
    text(362, py + 62, 'He changes only what you see. Nothing is posted, and a reload brings every word back.', 11.5, fill=t['muted'])
    text(362, py + 80, 'He skips anything hidden, clipped or editable, such as the post you are writing.', 11.5, fill=t['muted'])
    arrow([(940, ly + lh), (940, py - 2)], dashed=True)
    text(934, 396, 'rewrites text', 11, fill=t['muted'], anchor='end')
    arrow([(444, sy + 58), (444, py - 2)], dashed=True, label='clicks', label_at=(452, 396))
    arrow([(654, sy + 58), (654, py - 2)], dashed=True, label='scrolls', label_at=(662, 396))

    # privacy footer
    fy = 548
    text(346, fy, 'Nothing leaves the tab.', 13.5, weight=600, fill=t['run'])
    text(346, fy + 20, 'No requests, no analytics, no storage. The site is static too: its fonts are self-hosted.', 11.5, fill=t['muted'])
    text(346, fy + 38, 'Works under strict Content Security Policy and Trusted Types: no innerHTML, no eval.', 11.5, fill=t['muted'])

    defs = ''.join(
        f'<marker id="head-{id(c)}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">'
        f'<path d="M0 0 L10 5 L0 10 z" fill="{c}"/></marker>' for c in markers)
    body = '\n'.join(out)
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}" '
            f'role="img" aria-labelledby="title desc">\n'
            f'<title id="title">How the Slop Goblin works</title>\n'
            f'<desc id="desc">The build turns src/goblin.js and src/page.html into the site, the bookmarklet and an '
            f'embeddable script. In your browser tab the goblin hunts visible buzzwords, walks to them, eats them and '
            f'spits the plain-English version back, opening “… more” and scrolling when the screen is clean. '
            f'Esc brings the bill. Nothing leaves the tab.</desc>\n'
            f'<defs>{defs}</defs>\n{body}\n</svg>\n')


def goblin_head(add, cx, cy, s):
    """The goblin's head, as on the favicon."""
    add(f'<g transform="translate({cx} {cy}) scale({s})" stroke="#34501f" stroke-width="3" stroke-linejoin="round">'
        '<path d="M-13 -8 L-38 -27 L-10 7 Z" fill="#86ad5e"/><path d="M13 -8 L38 -27 L10 7 Z" fill="#86ad5e"/>'
        '<circle r="19" fill="#86ad5e"/>'
        '<circle cx="-7.8" cy="-3" r="6.4" fill="#f6d84a" stroke-width="2"/><circle cx="7.8" cy="-3" r="6.4" fill="#f6d84a" stroke-width="2"/>'
        '<circle cx="-6.4" cy="-2.4" r="2.9" fill="#1a1a12" stroke="none"/><circle cx="9.2" cy="-2.4" r="2.9" fill="#1a1a12" stroke="none"/>'
        '<path d="M-11.5 7 Q0 15.5 11.5 7" fill="none" stroke-width="2.8" stroke-linecap="round"/></g>')


if __name__ == '__main__':
    here = Path(__file__).resolve().parent
    for name, theme in THEMES.items():
        (here / f'architecture-{name}.svg').write_text(diagram(theme), encoding='utf-8')
        print(f'wrote docs/architecture-{name}.svg')
