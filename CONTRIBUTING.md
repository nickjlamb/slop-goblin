# Contributing

Thanks for feeding the goblin. The menu currently holds <!--phrases-->235<!--/phrases--> phrases and
<!--words-->83<!--/words--> buzzword families, and it’s never finished.

## Ways to help

- **Report slop he missed.** Use the [missed slop form](https://github.com/nickjlamb/slop-goblin/issues/new?template=missed-slop.yml).
  A real example sentence (with names removed) helps most.
- **Add phrases yourself.** It takes about five minutes; see below.
- **Report a bug.** Use the [bug form](https://github.com/nickjlamb/slop-goblin/issues/new?template=bug-report.yml),
  with your browser and what you saw.
- **Pick something from the [roadmap](ROADMAP.md).** Open an issue first for anything bigger than a phrase, so we
  can agree the approach.

## Set up

You need Node 20 or newer.

```sh
git clone https://github.com/nickjlamb/slop-goblin.git && cd slop-goblin && npm install && npm test
```

For the browser smoke test, install the engines once with `npx playwright install chromium firefox webkit`, then
run `npm run test:browser`.

To try your change on a real page, run `npm run build`, open `index.html` and press **Release the goblin**, or
drag the green button from your local `index.html` to your bookmarks bar.

## Adding slop

Everything lives in [`src/goblin.js`](src/goblin.js).

**A single word** needs two edits:

1. Add its pattern to `FOOD`, covering its forms: `'streamlin(?:e|es|ed|ing)'`.
2. Add a translation for each form to `PLAIN`, keyed in lower case without spaces or hyphens:
   `streamline: 'simplify', streamlines: 'simplifies', streamlined: 'simplified', streamlining: 'simplifying'`.

**A phrase** is one line in `PHRASES`: a regular expression and its plain English.

```js
['hitting the ground running', 'starting quickly'], ['hit the ground running', 'start quickly'],
```

A few rules keep the output readable:

- **Make it shorter and duller.** The joke is the deflation: “a strategic rightsizing” is “layoffs”.
- **Keep the grammar.** Add a line per tense or number rather than one that fits none of them. Use a capture
  group when a word must survive: `['empowering (\\w+) to', 'letting $1']`.
- **Specific before general.** When two patterns could match starting at the same word, the one listed first
  wins, so a longer phrase goes above any shorter one that begins the same way.
- **Use the helpers.** `Q` matches both apostrophes (`'` and `’`), `[- ]` matches a hyphen or a space, and
  `ADJ` allows up to two adjectives: `'embarking on (?:a |my )' + ADJ + 'journey'`.
- **Punch at the language, never at people.** No real names in patterns, tests or examples.

Then add a sentence using your phrase to the `GOLDEN` list in
[`tests/translate.test.mjs`](tests/translate.test.mjs), and run:

```sh
npm run build && npm run examples && npm test
```

The build refreshes the counts in the README and here, and CI fails if the built files you commit don’t match the
source, so commit everything the build changed.

## Pull requests

- One topic per pull request. A batch of phrases is one topic.
- Describe what changed and, for new slop, where you saw it.
- `npm test` passes, and `npm run test:browser` too if you touched how he moves, eats or draws.
- Add a line under **Unreleased** in [CHANGELOG.md](CHANGELOG.md).

## Releasing

For maintainers:

1. Bump the version in `package.json`, `VERSION` in `src/goblin.js` and `version` in `CITATION.cff`
   (a test checks they agree).
2. Move the **Unreleased** notes in `CHANGELOG.md` under the new version and date, and write
   `.github/releases/vX.Y.Z.md`.
3. `npm run build && npm test`, commit, then
   `git tag vX.Y.Z && git push --tags && gh release create vX.Y.Z --title "vX.Y.Z" --notes-file .github/releases/vX.Y.Z.md dist/bookmarklet.txt dist/goblin.min.js`.

## Code of conduct

Everyone taking part agrees to the [code of conduct](CODE_OF_CONDUCT.md).
