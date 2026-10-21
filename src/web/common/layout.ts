// The shape of every page the public side serves: green header, optional
// section bar, content in a white panel, green footer. Error pages use it too,
// because a page that cannot be found is still a page of this site.
import { accountItems, accountMenu, type AccountMenu } from "./accountMenu.js";
import type { Assets } from "./assets.js";
import { escape } from "./escape.js";
import {
  directionAttribute,
  nameDirectionAttribute,
  type Speaking,
} from "./language.js";
import { markdownWithoutHtml } from "./markdown.js";
import { themes, type Theme } from "./theme.js";

/**
 * A link in the primary navigation: where it goes, and the name the catalogue
 * keeps its words under. `words` rather than `label`, which a section uses for
 * the words themselves, because the site writes these and a page writes those.
 */
export interface NavigationLink {
  readonly href: string;
  readonly words: string;
}

export interface Section {
  readonly href: string;
  readonly label: string;
  /** Whether it is one of a tournament's competitions, whose names run long
      and so are drawn as tiles of one width with the name wrapped within. */
  readonly competition?: boolean | undefined;
  /** Whether it holds something new to the reader, as a note they have not
      read, which marks it with a red asterisk. */
  readonly isNew?: boolean | undefined;
}

// An asterisk of six spokes, drawn about the middle of its box rather than
// set as the character, which a font draws near the top of its line, where it
// marks a footnote: drawn, it is in the middle of whatever it is set in.
const asterisk =
  '<svg class="new-mark-asterisk" viewBox="0 0 10 10" aria-hidden="true"><path d="M5 0.5v9M1.1 2.75l7.8 4.5M1.1 7.25l7.8-4.5"/></svg>';

/**
 * The red asterisk that marks something new to the reader. A colour and a
 * shape are not read out, so it is said to a screen reader in words.
 */
export const newMark = (speaking: Speaking): string =>
  `<span class="new-mark">${asterisk}<span class="visually-hidden">${escape(speaking.say("marks.new"))}</span></span>`;

export interface Shell {
  /** The <title>, which is not always what the header shows. */
  readonly title: string;
  /** A second line in the green header. Long names wrap; they are not cut. */
  readonly headerTitle?: string | undefined;
  /** The tournament a page is of, if it is of one, named in the pinned bar
      beneath the site's name and leading to its page, since a tournament's
      pages are often headed by a player's name or a block's rather than its
      own. */
  readonly tournament?:
    | {
        readonly name: string;
        /** Where it is found, as "2026/ac/spring-open". */
        readonly address: string;
        /** Its subtitle, in Markdown, drawn on a strip beneath the pinned
            bar, or nothing where it has none. */
        readonly subtitle: string | undefined;
      }
    | undefined;
  /** The dark green bar. Absent, rather than present and empty, when a page
      has nowhere to move between. */
  readonly sections?: readonly Section[] | undefined;
  /** Where the section being read leads, as "/2026/ac/spring-open/players":
      by where it leads rather than what it says, since two sections can say
      the same, as two tests between the same teams do. */
  readonly currentSection?: string | undefined;
  /** A secondary navigation of the page's own making, already escaped, drawn
      where the section bar is, for a page whose bar is more than a row of
      sections to move between. */
  readonly secondary?: string | undefined;
  /** Rules of the page's own, for what depends on what only the page knows,
      such as how many of something it has. Set after the site's stylesheet,
      so that each wins over the site's rule for the same thing. */
  readonly styles?: string | undefined;
  /** Where in the primary navigation the reader is, if anywhere. */
  readonly currentPath?: string | undefined;
  /** Which theme the reader has asked for, if they have asked. */
  readonly theme: Theme;
  /** The name of a page that is of no one tournament, beneath the site's
      name in the pinned bar and leading to itself, as a tournament's is: the
      search's and the players'. */
  readonly pageName?:
    { readonly name: string; readonly href: string } | undefined;
  /** What was typed in the search box of the header, put back in it where a
      page is the answer to a search. Nothing where a page is not. */
  readonly searchText?: string | undefined;
  /** Whether the reader is signed in, which the account menu opens on. Asked
      of every page rather than left out, because a page that forgot it would
      show a reader who is signed in the ways in instead of their own pages, and
      nothing would say so. */
  readonly signedIn: boolean;
  /** Whether the account the reader is signed in to has a password, which
      decides whether the account menu offers the pages that ask for it. Asked
      of every page for the reason signedIn is. */
  readonly hasPassword: boolean;
  /** False where the site could not find out who the reader is, which
      leaves the account menu out rather than saying either thing about them
      (accountMenu.ts). Known, unless a page says otherwise. */
  readonly readerKnown?: boolean | undefined;
  /** The language the page is in, and the others it could be in. */
  readonly speaking: Speaking;
  /** What the site is called, which is the site's own name and in no
      catalogue: a site serving from this repository under another name calls
      itself that in its bars, as it does in its emails (site.ts). */
  readonly siteName: string;
  /** Whether the site is served as a try website, which says so on every
      page. Asked of every page, as signedIn is, so that a page that forgot it
      is refused by the typecheck rather than left without the banner on the
      one website where a reader needs it. */
  readonly tryWebsite: boolean;
  /** The path the theme and language forms return to, so a choice keeps you
      where you were. */
  readonly path: string;
  /** "panel", the default, sets the body in the white panel. "bare" leaves it
      on the page's own background, for a body that brings its own frame — a
      dialog does. */
  readonly frame?: "panel" | "bare" | undefined;
  /** The contents of the panel, already escaped. */
  readonly body: string;
  /**
   * Where to send a reader whose browser has scripting switched off, for a
   * page that cannot be used without it. Absent for every page that can.
   */
  readonly withoutScripting?: string | undefined;
}

// A refresh inside noscript, which a browser acts on only when scripting is
// off: with it on, the reader stays; with it off, they are taken straight to
// the page that says why, before they have filled anything in. Sending them
// needs no scripting, which is the point: the one thing a page cannot do for a
// reader without scripting is run a script to notice.
const sendAwayWithoutScripting = (path: string | undefined): string =>
  path === undefined
    ? ""
    : `
    <noscript><meta http-equiv="refresh" content="0; url=${escape(path)}" /></noscript>`;

// The way home and the way to help, for every reader, and the way to the admin
// for a reader who is signed in: the admin shows nothing to anybody else, so
// offering it to them would only send them to sign in. Everything to do with
// an account is in the account menu beside them rather than here, so that the
// bar carries one item for an account however many pages an account has.
const everyone: readonly NavigationLink[] = [
  { href: "/", words: "navigation.home" },
  { href: "/players", words: "tournament.players" },
  { href: "/help", words: "navigation.help" },
];

const signedInToo: readonly NavigationLink[] = [
  { href: "/admin/", words: "navigation.admin" },
];

/** The primary navigation, for a reader signed in or not. */
export const navigation = (signedIn: boolean): readonly NavigationLink[] =>
  signedIn ? [...everyone, ...signedInToo] : everyone;

// Not read from a clock. A rendered year that moves on its own is a year
// nobody decided, and this one is a claim about when the work was done. The
// years and whose claim it is are filled into the catalogue's words, so that a
// reader sees one phrase from the catalogue rather than a phrase with a name
// bolted on the end of it.
const copyrightYears = "2012 – 2026";
const copyrightOwner = "Tim Murphy";

// The button from the current site, so that donations arrive where they always
// have.
const paypalButton = "AQ432ABTXDPYU";

// Where the navigation is behind this button the header has room for nothing
// else, so the account's person is not drawn and its pages are the last group
// in what the button opens instead (the stylesheet decides which, by width).
// A group of its own rather than more links in the navigation, so that what the
// navigation offers is the same at every width.
const accountGroup = (bar: AccountMenu): string => {
  if (bar.readerKnown === false) return "";
  const { speaking } = bar;
  return `              <nav class="menu-account" aria-label="${escape(speaking.say("account.menu"))}">
                <p class="menu-account-heading" aria-hidden="true">${escape(speaking.say("account.menu"))}</p>
                <ul>
${accountItems(bar).join("\n")}
                </ul>
              </nav>`;
};

const menu = (bar: AccountMenu): string => {
  const { speaking, currentPath, signedIn } = bar;
  const items = navigation(signedIn)
    .map(({ href, words }) => {
      const here = href === currentPath ? ' aria-current="page"' : "";
      return `            <li><a href="${href}"${here}>${escape(speaking.say(words))}</a></li>`;
    })
    .join("\n");

  return `          <details class="menu">
          <summary><span class="visually-hidden">${escape(speaking.say("navigation.menu"))}</span></summary>
            <div class="menu-panel">
              <nav class="menu-links" aria-label="${escape(speaking.say("navigation.label"))}">
                <ul>
${items}
                </ul>
              </nav>
${accountGroup(bar)}
            </div>
        </details>`;
};

// Beneath the site bar rather than in it, so that it scrolls away once read
// instead of taking a line of every screen for as long as the reader stays.
// Said by the admin's page too (adminPage.ts).
export const tryWebsiteBanner = (
  speaking: Speaking,
  siteName: string,
): string => `
    <div class="try-banner">
      <div class="page">
        <p>${escape(speaking.say("tryWebsite.banner", { siteName }))}</p>
      </div>
    </div>`;

// What a page names its sections is the page's own words; the bar's own word
// is the one it is announced by to a reader who cannot see it.
const sectionBar = (
  speaking: Speaking,
  sections: readonly Section[] | undefined,
  current: string | undefined,
): string => {
  if (sections === undefined || sections.length === 0) return "";

  const items = sections
    .map(({ href, label, competition, isNew }) => {
      const here = href === current ? ' aria-current="page"' : "";
      const tile = competition === true ? ' class="section-competition"' : "";
      // Beside the link rather than in it, so that the link is named by its
      // words alone, as every section is.
      const mark = isNew === true ? newMark(speaking) : "";
      return `          <li${tile}><a href="${href}"${here}>${escape(label)}</a>${mark}</li>`;
    })
    .join("\n");

  return `
    <nav class="site-sections" aria-label="${escape(speaking.say("sections.label"))}">
      <div class="page">
        <ul>
${items}
        </ul>
      </div>
    </nav>`;
};

const titleBar = (title: string | undefined): string =>
  title === undefined
    ? ""
    : `
    <div class="site-title-bar">
      <div class="page">
        <h1 class="page-title">${escape(title)}</h1>
      </div>
    </div>`;

// A subtitle is kept with its HTML taken out (TournamentSubtitle.ts), and is
// drawn by a Markdown that draws none besides (markdown.ts), in case any was
// missed.
const subtitleMarkdown = markdownWithoutHtml();

// A tournament's subtitle, on a strip of the header's green beneath the pinned
// bar, and so beneath the tournament's name in it. Not in the bar itself, so
// that a subtitle of several lines scrolls away with the page rather than
// keeping a phone's screen from what the page says.
const subtitleBar = (tournament: Shell["tournament"]): string =>
  tournament?.subtitle === undefined
    ? ""
    : `
    <div class="tournament-subtitle">
      <div class="page">
        <div class="tournament-subtitle-text">
${subtitleMarkdown.render(tournament.subtitle)}        </div>
      </div>
    </div>`;

const themeWords: Record<Theme, string> = {
  light: "theme.light",
  dark: "theme.dark",
  system: "theme.system",
};

// Three submit buttons rather than a select and a Go: one press, no scripting,
// and the choice that is in force is announced rather than only shaded.
const themeChoice = (
  speaking: Speaking,
  chosen: Theme,
  path: string,
): string => {
  const buttons = themes
    .map((theme) => {
      const current = theme === chosen ? ' aria-current="true"' : "";
      return `            <button type="submit" name="theme" value="${theme}"${current}>${escape(speaking.say(themeWords[theme]))}</button>`;
    })
    .join("\n");

  return `          <form class="theme" method="post" action="/theme">
            <span id="theme-label">${escape(speaking.say("theme.label"))}</span>
            <input type="hidden" name="return" value="${escape(path)}" />
            <span class="theme-options" role="group" aria-labelledby="theme-label">
${buttons}
            </span>
          </form>`;
};

// A list in the footer, and a button beside it that makes the choice. Without
// scripting a list cannot send itself when it changes, and one that did would
// leave a keyboard reader choosing whatever they passed on the way down.
//
// Each language is listed by its own name, in its own language, because that
// is how a reader looks for theirs; the lang on each says so to a screen
// reader. The list opens on the language in force. Only where there is a
// choice to make: a site in one language offers nothing.
//
// The label sits on the list's top border, where a field's label goes once
// something is typed in it (dialog.ts): a list always holds a choice, so its
// label is never anywhere else.
const languageChoice = (speaking: Speaking, path: string): string => {
  if (speaking.offered.length < 2) return "";

  const options = speaking.offered
    .map((language) => {
      const current = language.tag === speaking.language.tag ? " selected" : "";
      return `              <option value="${escape(language.tag)}" lang="${escape(language.tag)}"${nameDirectionAttribute(language)}${current}>${escape(language.name)}</option>`;
    })
    .join("\n");

  return `
          <form class="language" method="post" action="/language">
            <input type="hidden" name="return" value="${escape(path)}" />
            <span class="language-box">
              <label for="language-choice">${escape(speaking.say("language.label"))}</label>
              <select id="language-choice" name="language">
${options}
              </select>
            </span>
            <button type="submit">${escape(speaking.say("language.choose"))}</button>
          </form>`;
};

/** What the header needs of the page it is drawn on. */
export type SiteBar = Pick<
  Shell,
  | "speaking"
  | "siteName"
  | "currentPath"
  | "signedIn"
  | "hasPassword"
  | "readerKnown"
  | "tournament"
  | "pageName"
  | "searchText"
> & {
  /** Whether the header has the site's search box, which every public page
      has and the admin, a page of its own kind, does not. */
  readonly withSearch?: boolean | undefined;
};

// The site's search, a form of its own that is sent as any is and so needs no
// scripting (search.feature). A search type rather than a text one, so that a
// phone offers what is typed to be cleared.
const searchBox = (bar: SiteBar): string => {
  if (bar.withSearch !== true) return "";
  const label = escape(bar.speaking.say("search.label"));
  return `          <form class="site-search" role="search" action="/search" method="get">
            <input type="search" name="q" aria-label="${label}" value="${escape(bar.searchText ?? "")}" />
            <button type="submit">${label}</button>
          </form>
`;
};

// Said by the admin's page too (adminPage.ts), so that there is one header
// rather than a copy of it that drifts.
export const siteBar = (bar: SiteBar): string => `
    <a class="skip-link" href="#content">${escape(bar.speaking.say("site.skipToContent"))}</a>
    <header class="site-bar">
      <div class="page">
        <div class="site-bar-inner">
          <div class="site-names">
            <a class="site-name" href="/">${escape(bar.siteName)}</a>
${bar.tournament === undefined ? "" : `            <a class="site-tournament" href="/${escape(bar.tournament.address)}">${escape(bar.tournament.name)}</a>\n`}${bar.pageName === undefined ? "" : `            <a class="site-page" href="${escape(bar.pageName.href)}">${escape(bar.pageName.name)}</a>\n`}          </div>
${searchBox(bar)}${menu(bar)}
${accountMenu(bar)}
        </div>
      </div>
    </header>`;

/** What the footer needs of the page it is drawn on. */
export type SiteFooter = Pick<
  Shell,
  "speaking" | "siteName" | "theme" | "path"
> & {
  /** Which version of the website this is, where it is known. */
  readonly version?: number | undefined;
};

// Said by the admin's page too, for the reason the header is.
export const siteFooter = (footer: SiteFooter): string => `
    <footer class="site-footer">
      <div class="page">
        <div class="site-footer-bar">
        <form
          class="donate"
          action="https://www.paypal.com/cgi-bin/webscr"
          method="post"
          target="_top"
        >
          <input type="hidden" name="cmd" value="_s-xclick" />
          <input type="hidden" name="hosted_button_id" value="${paypalButton}" />
          <button type="submit">${escape(footer.speaking.say("footer.donate"))}</button>
        </form>
        <p>${escape(footer.speaking.say("footer.plea", { siteName: footer.siteName }))}</p>
          <p class="copyright">${escape(
            footer.speaking.say("footer.copyright", {
              years: copyrightYears,
              owner: copyrightOwner,
            }),
          )}</p>${
            footer.version === undefined
              ? ""
              : `
          <p class="site-version">v${String(footer.version)}</p>`
          }
          <p><a href="/privacy">${escape(footer.speaking.say("footer.privacy"))}</a></p>
          <p><a href="/terms-of-use">${escape(footer.speaking.say("footer.termsOfUse"))}</a></p>
        </div>
        <div class="site-footer-theme">
${themeChoice(footer.speaking, footer.theme, footer.path)}${languageChoice(footer.speaking, footer.path)}
        </div>
      </div>
    </footer>`;

export const render = (assets: Assets, shell: Shell): string => `<!doctype html>
<html lang="${escape(shell.speaking.language.tag)}"${directionAttribute(shell.speaking.language)}${shell.theme === "system" ? "" : ` data-theme="${shell.theme}"`}>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escape(shell.title)}</title>${sendAwayWithoutScripting(shell.withoutScripting)}
    <link rel="stylesheet" href="${assets.url("site.css")}" />${
      shell.styles === undefined
        ? ""
        : `
    <style>
${shell.styles}
    </style>`
    }
  </head>
  <body>${siteBar({ ...shell, withSearch: true })}${subtitleBar(shell.tournament)}${shell.tryWebsite ? tryWebsiteBanner(shell.speaking, shell.siteName) : ""}${titleBar(shell.headerTitle)}${shell.secondary ?? sectionBar(shell.speaking, shell.sections, shell.currentSection)}
    <main id="content">
      <div class="page">
${
  shell.frame === "bare"
    ? shell.body
    : `        <div class="panel stack">
${shell.body}
        </div>`
}
      </div>
    </main>${siteFooter({ ...shell, version: assets.version })}
  </body>
</html>
`;
