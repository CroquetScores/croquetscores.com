# LAYOUT.md — Copying the Current Site's Layout

Taking the shape of https://croquetscores.com/ — its green header, its dark green secondary navigation and its green footer — and rebuilding it here in the vocabulary `STYLE.md` sets out. The body between the green bars is not part of this: what goes there arrives with the features that specify it.

`SETUP.md` says how the repository is built. `STYLE.md` says what things are called and what the scales are. This says what the site looks like.

---

## 1. What is copied, and what is not

|                |                                                                                                                                                                                                                                       |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Copied**     | The header bar, the secondary navigation bar, the footer bar: their colours, their proportions, the way they stack, and how they behave as the screen narrows                                                                         |
| **Copied**     | Content sitting in a white panel on a coloured page, which is the arrangement the current site's tables already have and the reason the page behind them can be tinted at all                                                         |
| **Not copied** | The body content. Tables of tournaments, game scores, commentary — all of it arrives with its own feature and is specified there                                                                                                      |
| **Not copied** | The current site's markup and CSS. This is a rebuild to the same result, not a transplant: the current navigation is a plain always-visible list, and what replaces it is the `<details>` disclosure the public side already requires |

---

## 2. What the current site actually does

Measured from the live site, rather than taken from a screenshot by eye. Recorded here because a value nobody wrote down is a value somebody will later guess at.

| Thing                                 | Value                                                                                       |
| ------------------------------------- | ------------------------------------------------------------------------------------------- |
| Header and footer green               | `rgb(70, 165, 70)` — `#46a546`                                                              |
| Secondary navigation green            | `rgb(7, 134, 0)` — `#078600`                                                                |
| Body background                       | `#ffffff`                                                                                   |
| Body text                             | `#333333`                                                                                   |
| Family                                | `"Helvetica Neue", Helvetica, Arial, sans-serif` at `14px`                                  |
| Site name                             | `28px`, bold, white                                                                         |
| Page title, second line of the header | `24.5px`, bold, white                                                                       |
| Header navigation links               | `15.4px`, regular, white, `5px 10px` padding                                                |
| Secondary navigation tabs             | `15.4px`, white, `8px 12px` padding, `5px` radius                                           |
| The tab you are on                    | Black background, white text — not a lighter green                                          |
| Header height                         | `40px` for the bar alone; `147px` with a page title beneath it                              |
| Secondary navigation height           | `62px`                                                                                      |
| Footer height                         | `87px`                                                                                      |
| Content width                         | Full width. No centred column, and a gutter of about `20px`                                 |
| The top bar                           | `position: fixed; top: 0` — pinned. The page title and the section bar below it scroll away |

---

## 3. The page, as bars

```
┌─────────────────────────────────────────────┐
│  Croquet Scores      Tournaments … Register │  pinned bar, green, white
├─────────────────────────────────────────────┤  stays as the page scrolls
│  19th Spanish Championship…                 │  title strip, when a page
├─────────────────────────────────────────────┤  has a title. Scrolls away
│  [Recent]  Commentary  Block A  Block B     │  sections, dark green, only
├─────────────────────────────────────────────┤  when there are any
│    ┌─────────────────────────────────────┐  │
│    │  Latest Tournaments                 │  │  white panel, near-black text
│    │                                     │  │  on the light green page
│    └─────────────────────────────────────┘  │
├─────────────────────────────────────────────┤
│  Donate    …            © 2012–2026, …      │  footer green, white
└─────────────────────────────────────────────┘
```

**The bars run the full width of the window**, at every size, and nothing is centred in a column.

**The top bar is pinned to the top of the window** and stays there as the page scrolls, as the current site's does. Everything below it — the title strip, the section bar — scrolls away. That is what keeps a three-line tournament name off a phone screen once reading has started, while the site name and the way out remain in reach.

That pinning decides the markup. A sticky element only sticks within its own container, so a bar nested inside a header would scroll away the moment the header did. The pinned bar is therefore a `<header>` in its own right, and the page's title is a separate green strip beneath it rather than a second line of the same block.

The section bar appears only on pages with sections to move between, and is absent everywhere else rather than present and empty. The section being read is a **full-height black block**: no green above it and none below, because green showing through would read as a gap rather than as a selection. That costs the `5px` radius the current site gives its tabs, which cannot survive a tile that reaches the bar's edges.

Content sits in a **white panel with near-black text** on the light green page. That is what makes the tint work: the green is the surface the page is laid on, not the surface anything is read against.

Everything in a bar lines up with the text inside that panel — the site name, the tabs, the donate button — rather than with the panel's edge. One token carries the offset, so the alignment is a fact stated once instead of a number copied into four rules.

As the window narrows, the bars stay and their contents wrap. The current site wraps its secondary tabs onto two and three rows at `390px` and collapses nothing, which is the behaviour to keep: those tabs are the page's own sections, and hiding them would hide the page.

---

## 4. The differences from the current site

1. **The header navigation is short.** `Register` (`/accounts/register`) is the one that matters; `Tournaments`, `Blog` and `Help` stand in beside it so the navigation has enough in it to behave like navigation. None of those destinations exists yet, so every one of them answers `404` until the feature that provides it lands — which is the honest state of a layout built before its pages, and worth knowing before anyone reports it as a fault.
2. **The body is out of scope.** Between the bars there is a panel with a heading in it and nothing else until a feature says otherwise.
3. **The page behind the panel is a very light green**, where the current site is white.
4. **The secondary navigation is kept**: dark green, tabs with a `5px` radius, the current one on black.

---

## 5. What changes in the style foundation

`STYLE.md` and `assets/site.css` were written before this brief. Three things in them change, each named here so it is a decision rather than a drift.

**The centred column gives way to full-width bars.** The foundation holds everything to `--page-max`. The bars now run edge to edge, and `.page` keeps its job of holding the _contents_ of a bar off the window edge. Prose stays held to `--measure`, because a line of text spanning a desktop window is tiring to read whatever the bars do.

**The palette changes, and gains a panel.** `--accent` becomes `#46a546`, a new `--accent-strong` carries the secondary navigation's `#078600`, `--surface` becomes the light green, and `--panel` with `--panel-ink` carry the white and the black that content is actually read in. This is what the tokens were for: a palette swap is one `:root` block, and any rule outside it that needs touching was wrong.

**The disclosure earns its place.** With four items rather than one, the `<details>` menu below `40rem` is doing real work, and the existing browser scenarios covering it still apply unchanged.

---

## 6. Light only, for now

Dark is deferred until light is settled. That is not simply "stop writing dark rules": the stylesheet already has a `prefers-color-scheme: dark` block and declares `color-scheme: light dark`, so a reader whose machine is set to dark **gets dark today**. Leaving it in place while light is being worked on means half the changes are checked against a theme nobody is looking at, and the other half quietly break it.

So: `color-scheme: light`, and the dark block comes out. Deleting it beats commenting it out, because a commented block rots while a deleted one gets rewritten against the palette that by then exists. Tokens stay named for their job, so reinstating dark is a second `:root` block and nothing else.

---

## 7. Settled

- **The page title in the header** is optional from the start, so the shape is right when the first page brings one.
- **The footer keeps the PayPal donate button**, alongside the plea and the copyright line.
- **The content green** is chosen from four candidates rendered against the real bars and a white panel. `A #f4f9f4` is so faint the panel all but disappears into it; `D #dcecdc` is definite and starts to feel heavy. **The recommendation is `C #e6f2e6`**, where the panel reads as a distinct surface and the green is unmistakably green without competing with the header. `B #eef6ee` is the quieter alternative if `C` looks too present once it is on a real page.

---

## 8. Settled while building

- **The content green is `C #e6f2e6`.**
- **Panel text is the foundation's near-black `--ink`** (`#16181c`) rather than pure `#000`: black to look at, slightly kinder to read.
- **A long tournament name wraps** onto as many lines as it needs, as the current site's does. The name is the page, and truncating it would lose the one thing the reader came for.
- **The bars are tight.** The pinned bar is `44px` and the section bar `45px`. Inline navigation items are `36px` at least, while the ones inside the disclosure keep `44px`: those are pressed with a thumb, these are pointed at with a mouse. `36px` still clears the `24px` that WCAG 2.2 asks for.
- **The active tab fills its bar.** No block padding and no row gap on the section list, so the black runs edge to edge and between wrapped rows.
- **Bar contents align with panel text**, through `--panel-inset`.

---

## 9. Done when

- A public page renders as bars — pinned header, optional title strip, optional sections, content, footer — full width at every size, with the content in a white panel on light green.
- The top bar is still at the top of the window after the page has been scrolled, and everything below it has gone.
- The current section's black reaches the top and bottom of its bar, with no green showing above or below it.
- The site name, the section tabs and the donate button all start at the same left edge as the text in the panel.
- The header holds the site name and four links, and they are reachable at `390px`: shown plainly above `40rem`, behind the disclosure below it.
- A page with sections renders the dark green secondary navigation beneath the header, the current section on black, wrapping rather than collapsing as the screen narrows.
- Nothing outside the token block names a colour.
- Nothing renders dark: `prefers-color-scheme: dark` has no effect, because there is nothing left for it to do.
- `npm run lint`, `npm run typecheck`, `npm run build` and `npm test` are clean, and the browser scenarios covering the navigation still pass.
