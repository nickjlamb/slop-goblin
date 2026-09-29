# Changelog

All notable changes to the Slop Goblin are recorded here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and versions follow
[Semantic Versioning](https://semver.org/): a new phrase is a patch, a new feature is a minor release, and
anything that changes how you install or embed him is a major one.

## [Unreleased]

### Added

- A Zenodo DOI, [10.5281/zenodo.23034803](https://doi.org/10.5281/zenodo.23034803), shown as a badge in the README and recorded in CITATION.cff.

### Changed

- Credit Hugo Duprez’s Destroy Any Website by its full title, on the site and in the README.

## [1.0.0] - 2026-09-29

The first tagged release. The site has been live at [slopgoblin.pharmatools.ai](https://slopgoblin.pharmatools.ai)
since 28 September 2026; this release adds the tooling and documentation around it and fixes the translation
glitches found since launch.

### Added

- **The goblin.** A bookmarklet that walks down the page eating buzzwords, animated letter by letter, and gets
  visibly fatter as he goes. Click him to poke him; <kbd>Esc</kbd> sends him home.
- **The menu.** 235 phrase patterns and 83 buzzword families, from “synergy” to “I don’t know who needs to hear
  this”. Phrases are matched before the words inside them.
- **Translator mode**, on by default. Every bite is spat back as plain English, highlighted, with the original
  on hover. It can be switched off in the HUD.
- **Servings and girth.** One word is 1 serving, a two-word phrase 2, longer phrases 3, with a floating “+2”/“+3”.
  Eight girth levels from *Peckish* to *Visible from space*.
- **“… more” handling.** He opens a truncated post when slop is hiding in it, and never counts clipped text as
  visible.
- **Auto-scroll** with a pause to admire each translation, and a “No slop here!” when the feed runs dry.
- **The bill.** An itemised receipt on <kbd>Esc</kbd>, drawn on a canvas and saved or copied as a PNG.
- **The site**, with a practice feed of invented posts, a phone-friendly layout, self-hosted fonts and a social
  preview card.
- **For developers:** `dist/goblin.min.js` for embedding (also on jsDelivr), `SlopGoblin.translate()` and
  `SlopGoblin.bites()` in Node, the `slopify` CLI, an embed example, and a generated before-and-after gallery.
- **Quality:** translator, docs and build tests; an end-to-end smoke test in Chromium, Firefox and WebKit; and CI
  that fails if the committed site or bookmarklet doesn’t match the source.

### Fixed

Since the site went live on 28 September:

- “an innovative solution” now becomes “a product”, not “an product”: the translator fixes a/an before each swap.
- “a unicorn hire” no longer becomes “a perfect hire hire”.
- “innovation” now reads “progress”, so “Innovation matters” stays grammatical.

[Unreleased]: https://github.com/nickjlamb/slop-goblin/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/nickjlamb/slop-goblin/releases/tag/v1.0.0
