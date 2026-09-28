# The Slop Goblin

A small green goblin that walks down your LinkedIn feed eating buzzwords, gets visibly fatter with every bite, and spits the plain-English version back into the post.

**Try it:** [slopgoblin.pharmatools.ai](https://slopgoblin.pharmatools.ai)

![The Slop Goblin, before and after a week on LinkedIn](og-image.png)

> “I’m thrilled to announce that” → “News:”
> “We have a strategic rightsizing of our talent landscape” → “We have layoffs”
> “Let’s double-click on how we operationalise our north star” → “Let’s look at how we do our goal”

## Install

1. Open [slopgoblin.pharmatools.ai](https://slopgoblin.pharmatools.ai) on a desktop browser.
2. Show your bookmarks bar (<kbd>⌘ ⇧ B</kbd> on a Mac, <kbd>Ctrl ⇧ B</kbd> on Windows).
3. Drag the green **Slop Goblin** button onto the bar.
4. Open LinkedIn and click the bookmark.

Click the goblin to poke him. **Esc** (or ✕) sends him home and brings the bill: a receipt you can save or copy as an image.

Works in desktop Chrome, Edge, Brave, Arc, Firefox and Safari. Phones can play with the practice feed on the site, but bookmarks can’t run the goblin there.

## What he does

- **Eats phrases first, then words.** About 230 phrase patterns (“is a testament to”, “hit the ground running”, “I don’t know who needs to hear this”) and 80-odd buzzword families (“synergy”, “leverage”, “delve”, “operationalise”).
- **Translator mode.** Each bite is replaced with plain English, highlighted so you can see it. Hover a highlight to see the original. Switch it off in the HUD to leave gaps instead.
- **Servings.** A lone word is 1 serving, a two-word phrase 2, anything longer 3. Girth goes from *Peckish* to *Visible from space*.
- **Opens “…more”.** If a truncated post is hiding slop, or he has already eaten something from it, he clicks its “…more” button and carries on.
- **Scrolls by himself**, pausing so you can read what he has translated.

## Privacy

The goblin runs entirely inside your browser tab.

- It makes **no network requests**: no analytics, no tracking, no server.
- It **reads the text on the page only to find buzzwords**, and never stores or sends it anywhere.
- It **only changes what you see**. Nothing is posted, edited or saved on LinkedIn; reload the page and every word comes back.
- The only thing it clicks is a post’s “…more” button.
- The site itself loads nothing from third parties either: its fonts are self-hosted and there are no analytics.

All the code is in [`src/goblin.js`](src/goblin.js) if you’d like to check before running it.

## Adding phrases

Phrases live in the `PHRASES` list in `src/goblin.js`, as `[pattern, plain English]` pairs. Single words live in `FOOD` (the patterns) and `PLAIN` (their translations). Pull requests with new slop are welcome.

```
npm install
npm run build    # writes index.html and bookmarklet.txt
```

## Credits

Made by [Nick Lamb](https://www.pharmatools.ai) at PharmaTools.AI. Inspired by Hugo Duprez’s [Destroy](https://destroy.spritefusion.com).

Not affiliated with, or endorsed by, LinkedIn.

MIT licence.
