# STYLE.md — Style Foundation Specification

One vocabulary for how this site looks, shared by the server-rendered public pages and the admin SPA. It is a foundation and not a design: it settles what things are called, what the scales are, and how the page is put together, so that the screens arriving later argue about themselves rather than about spacing.

`SETUP.md` says how the repository is built. This says how it looks, and is held to the same rule: it does not specify behaviour. Where a thing has behaviour worth stating — a menu that opens — the behaviour belongs to the markup that provides it, and is named here only where it constrains the CSS.

---

## 1. Decisions

| Decision                                                   | Why                                                                                                                                                                                                                       |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| No CSS framework and no preprocessor                       | Grid, flexbox, custom properties and `clamp()` cover a site of this shape. A framework would have to be learnt, updated and worked around                                                                                 |
| One stylesheet, `assets/site.css`                          | Both halves of the site load the same file, so they cannot drift apart. One file also means no build step and no second request                                                                                           |
| Tokens are custom properties with semantic names           | `--ink` and `--surface` survive a change of palette. `--grey-700` does not                                                                                                                                                |
| A theme follows the machine, until a reader says otherwise | `color-scheme: light dark` with `light-dark()` values, so the choice is one property rather than a second palette. The reader's choice is a cookie the server reads, because the public side has no JavaScript to keep it |
| Fluid type through `clamp()`                               | A type scale that interpolates needs no breakpoint of its own, and no size is ever unreadable between two of them                                                                                                         |
| The public navigation is a `<details>` element             | `SETUP.md` decision 1 says the public pages work with JavaScript switched off. `<details>` opens, closes, takes focus and announces itself with no script at all                                                          |
| Breakpoints are written out, not tokenised                 | `@media` cannot read a custom property. A token that only worked in half the places it was wanted would be worse than a number written twice                                                                              |

---

## 2. One stylesheet, two consumers

`assets/site.css` is the whole foundation. The public pages link it under the hashed name the asset manifest gives them (`SETUP.md` §7.8). The admin SPA imports it from `main.tsx`, so Vite bundles and hashes it the same way it does everything else. Neither side has a stylesheet of its own at this stage; when the SPA grows screens that need styles nobody else does, those go in files beside their components and are still written in the vocabulary below.

The file is in sections, in this order, because CSS cascades and the order is the argument: **tokens → reset → base elements → layout primitives → components → utilities**. A rule that has to come later than it reads has been put in the wrong section.

---

## 3. The tokens

The vocabulary, declared on `:root`.

**Space.** A single scale, `--space-1` through `--space-8`, geometric from `0.25rem`. Every margin, padding and gap comes from it. A value that is not on the scale is a decision that has to be argued for, which is the point.

**Type.** `--text-sm` through `--text-3xl`, each a `clamp()` of a minimum, a viewport-relative middle and a maximum, so the scale grows with the screen and stops at both ends. `--leading-tight` for headings, `--leading-body` for prose. One family, `--font-body`, resolving to the reader's own system font: it is already installed, already legible to them, and costs no request.

**Measure.** `--measure`, the width beyond which a line of prose is tiring to read. There is no page width: the bars run the full width of the window (`LAYOUT.md` §3), so what holds content off the window edge is a gutter rather than a column.

The measure is not applied to every paragraph. The panel runs the width of the window, and most of what will go in it — scores, tables, standings — wants that width; prose held to `65ch` inside it left the right half of the panel empty and read as unfinished. So `.prose` asks for the measure where a block of text wants it, and nothing gets it by default. The cost is honest: a paragraph at `1280px` runs to about 134 characters a line, and at `1920px` to about 205, both beyond what is comfortable. Text that is meant to be read at length should carry `.prose`.

**Colour.** Named for the job, never the hue. `--surface` is what the page is laid on and `--panel` is what anything is read against, with `--ink` and `--ink-muted` for text on it: that distinction is what lets the page be tinted green while the reading stays on white. `--accent` carries the header and footer, `--accent-strong` the section bar, `--accent-ink` whatever sits on either, and `--current` the black marking the section being read. `--action` and `--action-ink` carry the button that does what a form is for: the section bar's green in light, and pale in dark, because the section bar's dark green on a dark dialog stands out at 1.78:1 and reads as a hole rather than the thing to press. `--danger` is for what needs the reader's attention — red in both themes, at 6.54:1 on the content in light and 7.42:1 in dark. `--border` for lines, `--focus` for the ring — which turns white inside the green bars, because a dark ring disappears there. Every pairing that can carry text meets WCAG AA at body size: a property of the palette, checked when the palette changes rather than hoped for.

Dark is not light inverted. The bars keep the brand's hue and lose the lightness that makes a full-width band of it glare at night. The tile marking the current section turns pale, because black on a dark bar reads as a hole rather than as a selection. Links take a colour of their own — `--link`, rather than borrowing `--accent-strong` — because the dark green that works on white disappears on a dark panel. Every token is named for its job in both palettes, so nothing below them knows which is in use.

**What the palette is held to, and where it falls short.** Ten pairings are measured rather than assumed: body and muted text on the panel and on the page, the site name and navigation on their bar, the section tabs on theirs, the current tile against its bar and against its own text, links on the panel, and the focus ring on both. Body-size text is held to WCAG AA's 4.5:1 and non-text contrast to 3:1.

The **dark palette passes all ten**, the closest being the focus ring on a bar at 3.83:1.

The **light palette fails one**: white on `#46a546` — the site name, the navigation and the footer text — reaches **3.12:1** where 4.5:1 is wanted. That green is the current site's, taken deliberately (`LAYOUT.md` §2), and darkening it to `#398639` — the same hue and saturation at 37% lightness rather than 46% — reaches 4.58:1 and fixes it. Changing a brand's colour is not a thing to do quietly, so it is recorded here as known and unfixed rather than left to be discovered.

**Shape.** `--radius-1` and `--radius-2`, and nothing else. Two radii is a house style; five is an accident.

---

## 4. Base and layout

The reset is the small modern one: `box-sizing: border-box` everywhere, margins off the elements that carry them by default, `text-wrap: balance` on headings and `pretty` on paragraphs, images and media capped at `max-width: 100%`.

Three layout primitives carry nearly everything, and are classes rather than element rules because they apply to whatever needs them:

- `.page` — the gutter. The bars run edge to edge; this holds their contents off the window edge and never collapses to nothing on a phone.
- `.stack` — vertical rhythm, applied as a gap so that it cannot double up against a neighbour's margin.
- `.cluster` — a horizontal group that wraps, for navigation, button rows and anything else that runs out of room.

A grid of cards uses `repeat(auto-fit, minmax(…, 1fr))` and needs no breakpoint. Reach for `@media` only when the arrangement itself must change, not when something merely has to be narrower.

---

## 5. The header and its navigation

The public header holds the site name, which is a link home, and the primary navigation. Below `40rem` the navigation is collapsed behind a disclosure; above it, it is laid out inline and the disclosure control is not rendered at all.

That disclosure is `<details>` with a `<summary>`. It is keyboard-reachable, announced as a disclosure by a screen reader, and opens without a line of JavaScript, which is what the public side requires. The `<nav>` inside it carries an accessible name, so a reader arriving by landmark knows which navigation they have found.

The navigation is generated from the list of public pages, so a page that exists is a page that can be reached, and no second list has to be kept true beside the first.

The admin SPA has JavaScript by definition, so its own navigation is under no such constraint. It uses the same tokens, the same header proportions and the same focus treatment, so the two sides look like one site.

---

## 5a. The pinned bar

The site bar is `position: sticky; top: 0`. A sticky element only sticks within its own containing block, so the bar is a sibling of the page's other bands rather than a child of any of them: nested inside a header, it would scroll away the moment that header did. Anything else that is ever meant to pin is subject to the same rule, and the fix is always the same — move it out, not up the z-index.

---

## 5b. Forms

Every form that is a page's purpose is a `.dialog`: a title bar in the section bar's colour, the fields beneath it on `--panel`, and a row of buttons with the one that does the work furthest right and last in reading order. It stands on the page's own background in place of the panel, centred, `32rem` at most and the full width inside the gutter on a phone. It is a page region named by its title, not an ARIA dialog: it does not sit over the page, take focus or need dismissing, so claiming the role would describe something it is not.

A field is one line tall, the height of the button beneath it. Its label rests inside the border, on the line where the typing will go, and when the field is focused or has something in it the label lifts onto the top border at `--text-sm`, with `--panel` behind it so the border does not run through the words. It moves in one step, never sliding. It comes back down only when the field is left empty, which the stylesheet knows from a blank placeholder of one space that nobody sees. The field does not grow to hold its label, so a label too long for it is cut short with an ellipsis rather than wrapping out over whatever is beside it. The label is still a `<label>`: what a screen reader announces for the field and what a click on it focuses. It is never placeholder text, which disappears the moment anyone types. The border and the focus ring belong to the box around the label and input together, because that box is what the reader sees as the field — and the box _is_ the `<label>`, so a press anywhere inside the border reaches the input, with no scripting asked for.

A message about a field sits beneath it in bold `--danger`, and is tied to the input by `aria-describedby`, so it is read out with the field rather than left for someone to find by looking. `aria-invalid` is a separate statement and is said only where the field is actually wrong: a message can ask for something before anyone has got it wrong, and a field nobody has touched is not in error. A form shows a message only when its field needs attention. The stand-in register form is the exception, for testing only: it shows every message all the time so there is always one whose look can be checked, and that goes with the stand-in.

A notice at the top of a dialog is not a live region. It arrives with the page, and a live region only announces what changes after it exists, so whatever redirects to the page sends the reader to the notice's id: the browser moves focus there and it is read out on arrival.

`.button` is anything to press, whether a `<button>` or a link that behaves like one, and is `44px` tall. `.button-submit` is the only one painted with `--action`, so there is never a second thing that looks like the way forward.

A dialog with more buttons than fit side by side — signing in, with the way back in and the way to register beside it — stacks them instead, with `.dialog-buttons-stacked`: each as wide as the fields, the submit button first, where the eye starts, and the others beneath it in the order they are given. It is the one place the submit button is not last.

Where there is another way to do what a form is for — registering with Google rather than by email address — it is `.dialog-alternative`: a `.button` at the top of the content, beneath anything the reader needs telling and above the fields, as wide as they are, carrying the other way's own icon. It is drawn as the buttons other than the submit button are, because the way forward it is not is the form's. Beneath it, `.dialog-or` says "or", centred, in `--ink-muted`: written in lower case and drawn in capitals, because a screen reader can spell out a word written in capitals letter by letter.

Each part of the dialog carries its own background and the radius of its own corners, rather than the dialog clipping them with `overflow: hidden`, which would also clip the focus ring of any control near its edge.

---

## 6. What is required of every screen

These hold everywhere and are not a matter of taste:

- **Focus is always visible.** A `:focus-visible` ring drawn in `--focus`, with an offset so it is legible against whatever it surrounds. Nothing removes an outline without putting something better in its place.
- **Motion is optional.** Everything that animates is wrapped in `prefers-reduced-motion: no-preference`, so a reader who asked for stillness gets it.
- **Targets are reachable.** Anything meant to be pressed is at least 44px in both directions, which mostly means padding rather than size.
- **The page survives its content.** Long words break rather than overflow, and a layout is tested by putting too much in it.
- **A skip link comes first.** The first focusable thing on a public page jumps to the main content, past the navigation.

---

## 7. Done when

- `assets/site.css` holds the tokens, the base, the primitives and the header, in that order, and nothing hard-codes a value the scale already names.
- The public pages render a header, a main region and a footer, and reach their stylesheet through the asset manifest.
- The navigation opens and closes with JavaScript switched off, and is inline above `40rem`.
- The admin SPA imports the same stylesheet and renders in the same vocabulary.
- Light and dark both read correctly, and neither is an inversion of the other done badly.
- `npm run lint`, `npm run typecheck`, `npm run build` and `npm test` are all clean.
