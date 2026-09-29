# Security

The goblin runs inside pages where you’re signed in, so his security matters more than a toy’s usually would.

## What he promises

- He makes **no network requests** and never sends page content anywhere.
- He never uses `innerHTML`, `eval` or string-built code, so text on the page can’t become code.
- The only element he clicks is a post’s “… more” button.
- Everything he changes is local to your tab and gone on reload.

A break in any of these is a vulnerability.

## Reporting a vulnerability

Please report it privately through
[GitHub’s private vulnerability reporting](https://github.com/nickjlamb/slop-goblin/security/advisories/new),
not in a public issue. Include the browser, the page and the steps to reproduce.

You’ll get a reply within a week. Fixes ship as a new release, and reporters are credited in the changelog
unless they’d rather not be.

## Supported versions

Only the latest release is supported. The bookmark on the [site](https://slopgoblin.pharmatools.ai) is always the
latest; if you installed an older one, drag the green button to your bookmarks bar again.
