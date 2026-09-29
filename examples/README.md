# Examples

| Example | What it shows | Run it |
| --- | --- | --- |
| [**before-and-after.md**](before-and-after.md) | Every practice-feed post, before and after, with the bill for each | Just read it |
| [**embed.html**](embed.html) | The goblin on your own page, scoped to one element, with every option and event hook | Open it in a browser from a clone |
| [**slopify.mjs**](slopify.mjs) | The translator from the terminal, no browser needed | `npm run slopify -- "your text"` |
| [**gen-before-after.mjs**](gen-before-after.mjs) | How the gallery is generated (and kept honest by the tests) | `npm run examples` |

## slopify

```console
$ npm run slopify -- "I'm thrilled to announce that we leverage synergies to drive meaningful impact. Agree?"
News: we work together to help. (no question was asked)

$ printf "Rise and grind. No excuses.\nLet's take this offline and circle back on the low-hanging fruit.\n" | node examples/slopify.mjs --bites
Rise and grind     →  Wake up   (+3)
No excuses         →  Some excuses   (+2)
take this offline  →  talk privately   (+3)
circle back        →  follow up   (+2)
low-hanging fruit  →  easy wins   (+2)

5 bites · 12 servings · girth: Well-fed
```

Pipe in anything: `pbpaste | node examples/slopify.mjs` on a Mac turns whatever you've copied into plain English.

## Embedding

```html
<script>window.__SLOP_GOBLIN_NO_AUTOSTART = true;</script>
<script src="https://cdn.jsdelivr.net/gh/nickjlamb/slop-goblin@v1.0.0/dist/goblin.min.js"></script>
<script>
  SlopGoblin({ root: document.querySelector('article'), autoScroll: false });
</script>
```

See the [options table](../README.md#options) in the main README.
