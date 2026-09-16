// The shape of every page the public side serves: green header, optional
// section bar, content in a white panel, green footer. Error pages use it too,
// because a page that cannot be found is still a page of this site.
import type { Assets } from "./assets.js";

export interface NavigationLink {
  readonly href: string;
  readonly label: string;
}

export interface Section {
  readonly href: string;
  readonly label: string;
}

export interface Shell {
  /** The <title>, which is not always what the header shows. */
  readonly title: string;
  /** A second line in the green header. Long names wrap; they are not cut. */
  readonly headerTitle?: string | undefined;
  /** The dark green bar. Absent, rather than present and empty, when a page
      has nowhere to move between. */
  readonly sections?: readonly Section[] | undefined;
  readonly currentSection?: string | undefined;
  /** Where in the primary navigation the reader is, if anywhere. */
  readonly currentPath?: string | undefined;
  /** The contents of the panel, already escaped. */
  readonly body: string;
}

export const escape = (text: string): string =>
  text.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[character] ?? character,
  );

// Register is the one that matters. The rest stand in so the navigation has
// enough in it to behave like navigation, and answer 404 until the features
// that provide them land.
export const navigation: readonly NavigationLink[] = [
  { href: "/tournaments", label: "Tournaments" },
  { href: "/blog", label: "Blog" },
  { href: "/help", label: "Help" },
  { href: "/accounts/register", label: "Register" },
];

// Not read from a clock. A rendered year that moves on its own is a year
// nobody decided, and this one is a claim about when the work was done.
const copyright = "© Copyright 2012 – 2026, Tim Murphy";

// The button from the current site, so that donations arrive where they always
// have.
const paypalButton = "AQ432ABTXDPYU";

const menu = (currentPath: string | undefined): string => {
  const items = navigation
    .map(({ href, label }) => {
      const here = href === currentPath ? ' aria-current="page"' : "";
      return `            <li><a href="${href}"${here}>${escape(label)}</a></li>`;
    })
    .join("\n");

  return `          <details class="menu">
          <summary><span class="visually-hidden">Menu</span></summary>
          <nav class="menu-links" aria-label="Primary">
            <ul>
${items}
            </ul>
          </nav>
        </details>`;
};

const sectionBar = (
  sections: readonly Section[] | undefined,
  current: string | undefined,
): string => {
  if (sections === undefined || sections.length === 0) return "";

  const items = sections
    .map(({ href, label }) => {
      const here = label === current ? ' aria-current="page"' : "";
      return `          <li><a href="${href}"${here}>${escape(label)}</a></li>`;
    })
    .join("\n");

  return `
    <nav class="site-sections" aria-label="Sections">
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

export const render = (assets: Assets, shell: Shell): string => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escape(shell.title)}</title>
    <link rel="stylesheet" href="${assets.url("site.css")}" />
  </head>
  <body>
    <a class="skip-link" href="#content">Skip to content</a>
    <header class="site-bar">
      <div class="page">
        <div class="site-bar-inner">
          <a class="site-name" href="/">Croquet Scores</a>
${menu(shell.currentPath)}
        </div>
      </div>
    </header>${titleBar(shell.headerTitle)}${sectionBar(shell.sections, shell.currentSection)}
    <main id="content">
      <div class="page">
        <div class="panel stack">
${shell.body}
        </div>
      </div>
    </main>
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
          <button type="submit">Donate</button>
        </form>
        <p>
          Are you enjoying Croquet Scores? Please donate to help further
          development.
        </p>
          <p class="copyright">${copyright}</p>
        </div>
      </div>
    </footer>
  </body>
</html>
`;
