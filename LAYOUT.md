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
│  Croquet Scores      Home  Help …   Account │  pinned bar, green, white
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

The last thing in the pinned bar is the account menu, drawn as a filled person: pressed, it opens on what a reader can do with their account — registering, signing in and asking for a way back in, or, once they are signed in, their own pages and the way out (`accountMenu.feature`). It opens with no scripting, as a summary and the details beneath it, and its items are a panel hanging under the bar, in the dialog's surfaces (`STYLE.md` §5b) rather than the bar's green, so that what is read against them is read against white. The person is drawn inline rather than fetched or set in a font: it is one shape, it costs no request, and it takes the colour of the words beside it. It is named in words as well, for a reader who cannot see it. Whichever of its pages is being read is marked inside the menu, as the section bar marks its own, because the pages an account has are in here rather than in the navigation beside it.

That pinning decides the markup. A sticky element only sticks within its own container, so a bar nested inside a header would scroll away the moment the header did. The pinned bar is therefore a `<header>` in its own right, and the page's title is a separate green strip beneath it rather than a second line of the same block.

On a try website a white strip sits directly beneath the pinned bar, above the title strip, saying in bold that this is a safe place to learn the site and that anything entered may be removed at any time (`layout.feature`). It scrolls away with the rest, since once read it has said what it has to say. It is body text on white rather than a warning colour of its own: it is news the reader needs, not a fault they caused, and it keeps to a pairing the palette is already measured for. Nowhere else carries it, development included, so that a page worked on there looks as it will where it is served.

On a tournament's pages, its subtitle, where it has one, is on a strip of the header's green beneath the pinned bar, and so beneath the tournament's name in it (`layout.feature`). It scrolls away with the rest, so that a subtitle of several lines does not keep a phone's screen from what the page says.

The section bar appears only on pages with sections to move between, and is absent everywhere else rather than present and empty. A tournament's **competitions are tiles of one width**, as on the old site, since their names run long: "Championship Singles Block A" wraps within its tile onto tight lines of its own, and the tiles stand in even columns rather than running on in a ragged line. The tournament's own sections, Recent, Players, Notes and Commentary, are only as wide as their words. While the tournament has a note its managers wrote that the reader has not read as it is now, Notes is marked with a red asterisk beside it, in the middle of a small pale circle, since red alone is lost on the bar's dark green (`notes.feature`); and Commentary likewise while it has a commentary the reader has not read as it is now (`commentaries.feature`). In such a bar the section being read is a **black tile as tall as its own words**, not as its row: a tile reaching the bar's edges beside a name of three lines was a tall block of black. It keeps square corners rather than the old site's `5px` radius. A team tournament's tests in a group are not tiles of their own but the group's one tile, as on the old site, and the group's page and each of its tests' pages offer Summary and the group's tests in a row of their own above the heading, drawn as a competition's views are, the one being read filled (`group.feature`). A bar of no competitions, such as the years', keeps the **full-height black block**: no green above it and none below, because green showing through would read as a gap rather than as a selection.

Content sits in a **white panel with near-black text** on the light green page. That is what makes the tint work: the green is the surface the page is laid on, not the surface anything is read against.

A page whose purpose is a form has no panel. The form is a dialog standing on the light green page instead, centred, with its own title bar, content and buttons (`STYLE.md` §5b).

Everything in a bar lines up with the text inside that panel — the site name, the tabs, the donate button — rather than with the panel's edge. One token carries the offset, so the alignment is a fact stated once instead of a number copied into four rules.

As the window narrows, the bars stay and their contents wrap. The current site wraps its secondary tabs onto two and three rows at `390px` and collapses nothing, which is the behaviour to keep: those tabs are the page's own sections, and hiding them would hide the page.

---

## 4. The differences from the current site

1. **The header navigation is short, and ends in the account menu.** Registering, signing in and the rest are inside that menu rather than beside it, so the bar carries one item for an account however many pages an account has. Beside it are `Home` and `Help`, and `Admin` for a reader who is signed in: the admin shows nothing to anybody else, so offering it to them would only send them to sign in (`navigation.feature`). `Help` is the pages written in `docs/help`, shown in the language the rest of the site is in (`help.feature`). Most of the menu's pages do not exist yet, so each of them answers `404` until the feature that provides it lands — which is the honest state of a layout built before its pages, and worth knowing before anyone reports it as a fault.
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

## 6. Dark, and choosing it

Light was settled first, so that every change was checked against the theme somebody was actually looking at. It is settled, so dark is here, and so is a way to ask for it.

Dark is not light inverted. Three things change beyond lightness. The bars give up the brand's green for black, since a full-width band of green glares at night: the section bar is the darker black, and the header and footer a black a little lighter, as in light the section bar is the darker green. The tile marking the current section turns pale — black on a dark bar reads as a hole rather than as a selection. And links take a colour of their own, because the dark green that works on white disappears on a dark panel.

**The two palettes are one block.** Each token pairs its light and dark value in a single `light-dark()` declaration, and which one applies follows `color-scheme`. A second palette kept in step with the first is a thing that goes out of step, so there is not one.

Those pairs sit behind `@supports (color: light-dark(#000, #fff))`, and the plain light values on `:root` in front of them are the whole palette for a browser that cannot answer that query. It is written that way because the obvious alternative does not work. Writing each token twice — the plain value, then the `light-dark()` one — looks like a fallback and is not: a custom property is not checked when it is declared, so a browser that cannot evaluate `light-dark()` accepts the second line all the same and throws the plain value away. The failure only surfaces when `background: var(--surface)` is worked out, and a property that is invalid at that point falls back to transparent. The page would have lost its colours rather than landed on light. That was reproduced, not reasoned: written twice, an unknown colour function leaves the background transparent; behind `@supports`, the light value is kept.

**Choosing a theme is therefore one property.** `color-scheme: light` or `color-scheme: dark` on `<html>`, set from a `data-theme` attribute the server renders. No rule below the palette knows a choice was made.

**The choice is made without JavaScript**, because the public side has none. The control is a form of three submit buttons in the footer — Light, Dark, System — which posts to `/theme`. That records the choice in a cookie and answers `303` back to the page the reader was on, so the back button does not offer to post it again. System is not a third theme: it clears the cookie, because choosing it is choosing not to have chosen.

The cookie is `HttpOnly`, `SameSite=Lax`, a year long, and **always `Secure`**. It is not worked out from the request: behind whatever terminates HTTPS in front of the application, the connection that reaches it is plain HTTP, so `request.protocol` would say `http` on every request and the cookie would never be `Secure` where it most needs to be — and reading `X-Forwarded-Proto` instead means trusting a header any client can send. Chromium and Firefox treat `localhost` and `127.0.0.1` as secure contexts, so development over plain HTTP loses nothing there. Safari has historically not, so a developer checking the theme choice in Safari against `http://localhost` should expect it not to stick.

**Another site cannot make the choice.** A page elsewhere could otherwise put a button in front of a reader that posts to `/theme`, and the reader's browser would carry the result back and keep it for a year. Such a post is refused with `403`, by the same guard that stands in front of every change on this site (`SETUP.md` §7.7).

**A page that depends on a cookie is not a page anyone else may cache.** The public pages were `public, max-age=60`; they are now `private, no-cache` with `Vary: Cookie`. The `ETag` still does the work — a revalidation that finds nothing changed costs a `304` and no body — but a shared cache can no longer hand one reader's theme to another.

The admin SPA's page is built by Vite ahead of time, and the server says the choice into it as it sends it, putting `data-theme` on `<html>` as it does on every other page (`admin.feature`). The SPA does not read the cookie, and is not made to: loosening `HttpOnly` for a colour would loosen it for whatever is copied from it later. The admin offers the same choice beneath whatever it draws: the public footer's own form, said into its page with the rest, posting to the same `/theme` and coming back to the admin, so that there is one choice rather than two.

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
- **The bars are tight.** The pinned bar is `44px`, and the section bar is as tall as its tabs' words with `0.125rem` above and below them, half the scale's smallest step, and no taller: about `31px` at the body size. Inline navigation items are `36px` at least, while the ones inside the disclosure keep `44px`: those are pressed with a thumb, these are pointed at with a mouse. `36px` still clears the `24px` that WCAG 2.2 asks for. That exception is for the inline navigation and nothing else: the theme buttons in the footer are on screen on a phone and pressed with a thumb, so they are `44px` at every width, like the Donate button beside them.
- **Competitions are tiles; the active tab hugs its words beside them.** In a bar with competitions, each competition is a tile of one width and every tab is as tall as its own words, so that a name wrapped onto three lines does not make the current tab beside it a tall block of black. Elsewhere the active tab fills its bar: no block padding and no row gap on the section list, so the black runs edge to edge and between wrapped rows.
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
- A reader whose machine is set to dark gets dark, and every measured pairing in it meets WCAG AA.
- A reader can choose Light, Dark or System in the footer with JavaScript switched off, is taken at their word on every other page, and is still taken at their word on the next visit.
- `npm run lint`, `npm run typecheck`, `npm run build` and `npm test` are clean, and the browser scenarios covering the navigation still pass.
